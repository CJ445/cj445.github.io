import { INPUT_SIZE, VARIANTS } from './protocol';
import type { Detection, Variant, WorkerIn, WorkerOut } from './protocol';

// Minimal typing for the worker global; the project compiles against the DOM lib.
const ctx = self as unknown as {
  postMessage(message: WorkerOut): void;
  onmessage: ((event: MessageEvent<WorkerIn>) => void) | null;
  crossOriginIsolated: boolean;
  navigator: Navigator & { hardwareConcurrency: number };
};

type Ort = typeof import('onnxruntime-web');
type Session = import('onnxruntime-web').InferenceSession;

const CONF_THRESHOLD = 0.35;
const IOU_THRESHOLD = 0.45;
const NUM_CLASSES = 80;

const sessions = new Map<Variant, Session>();
const runtimes = new Map<'wasm' | 'webgpu', Ort>();
let active: Variant | null = null;

const post = (message: WorkerOut) => ctx.postMessage(message);

const canvas = new OffscreenCanvas(INPUT_SIZE, INPUT_SIZE);
const g = canvas.getContext('2d', { willReadFrequently: true })!;
const chw = new Float32Array(3 * INPUT_SIZE * INPUT_SIZE);

async function loadRuntime(kind: 'wasm' | 'webgpu'): Promise<Ort> {
  const cached = runtimes.get(kind);
  if (cached) return cached;
  const ort: Ort =
    kind === 'webgpu' ? await import('onnxruntime-web/webgpu') : await import('onnxruntime-web/wasm');
  // Threads need SharedArrayBuffer, which needs cross-origin isolation.
  ort.env.wasm.numThreads = ctx.crossOriginIsolated ? Math.min(4, ctx.navigator.hardwareConcurrency || 1) : 1;
  runtimes.set(kind, ort);
  return ort;
}

async function fetchModel(url: string, label: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Could not download ${label} (HTTP ${res.status}).`);
  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    post({
      type: 'status',
      text: `Downloading ${label} · ${(received / 1e6).toFixed(1)}${total ? ` / ${(total / 1e6).toFixed(1)}` : ''} MB`,
      progress: total ? received / total : undefined,
    });
  }
  const out = new Uint8Array(received);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

async function load(variant: Variant) {
  try {
    if (!sessions.has(variant)) {
      const v = VARIANTS[variant];
      const kind = v.backend === 'WebGPU' ? 'webgpu' : 'wasm';
      post({ type: 'status', text: `Loading ${v.backend} runtime (~${v.runtimeMB} MB, cached after first run)` });
      const ort = await loadRuntime(kind);
      const model = await fetchModel(v.file, `${v.precision} model`);
      post({ type: 'status', text: `Compiling ${v.precision} graph for ${v.backend}` });
      const session = await ort.InferenceSession.create(model, {
        executionProviders: [kind],
        graphOptimizationLevel: 'all',
      });
      // Warm-up so the first measured frame isn't dominated by kernel setup.
      const warm = new ort.Tensor('float32', new Float32Array(chw.length), [1, 3, INPUT_SIZE, INPUT_SIZE]);
      await session.run({ images: warm });
      sessions.set(variant, session);
    }
    active = variant;
    post({ type: 'ready', variant });
  } catch (err) {
    post({ type: 'error', variant, message: err instanceof Error ? err.message : String(err) });
  }
}

function iou(a: Detection, b: Detection) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  return inter / (a.w * a.h + b.w * b.h - inter || 1);
}

/** YOLOv8 head output is [1, 4 + classes, anchors]: cx, cy, w, h, then class scores. */
function decode(data: Float32Array, anchors: number, scale: number, padX: number, padY: number, srcW: number, srcH: number) {
  const found: Detection[] = [];
  for (let i = 0; i < anchors; i++) {
    let best = 0;
    let cls = 0;
    for (let c = 0; c < NUM_CLASSES; c++) {
      const s = data[(4 + c) * anchors + i];
      if (s > best) {
        best = s;
        cls = c;
      }
    }
    if (best < CONF_THRESHOLD) continue;
    const cx = data[i];
    const cy = data[anchors + i];
    const w = data[2 * anchors + i];
    const h = data[3 * anchors + i];
    // Undo the letterbox, then normalize to the source frame.
    const x = (cx - w / 2 - padX) / scale / srcW;
    const y = (cy - h / 2 - padY) / scale / srcH;
    found.push({ x, y, w: w / scale / srcW, h: h / scale / srcH, score: best, cls });
  }
  found.sort((a, b) => b.score - a.score);
  const kept: Detection[] = [];
  for (const d of found) {
    if (kept.every((k) => k.cls !== d.cls || iou(k, d) < IOU_THRESHOLD)) kept.push(d);
  }
  return kept;
}

async function infer(id: number, bitmap: ImageBitmap) {
  const session = active && sessions.get(active);
  const ort = active && runtimes.get(VARIANTS[active].backend === 'WebGPU' ? 'webgpu' : 'wasm');
  if (!session || !ort) {
    bitmap.close();
    return;
  }
  try {
    const t0 = performance.now();
    const srcW = bitmap.width;
    const srcH = bitmap.height;
    const scale = Math.min(INPUT_SIZE / srcW, INPUT_SIZE / srcH);
    const w = Math.round(srcW * scale);
    const h = Math.round(srcH * scale);
    const padX = Math.floor((INPUT_SIZE - w) / 2);
    const padY = Math.floor((INPUT_SIZE - h) / 2);
    g.fillStyle = 'rgb(114,114,114)';
    g.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE);
    g.drawImage(bitmap, padX, padY, w, h);
    bitmap.close();
    const rgba = g.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE).data;
    const plane = INPUT_SIZE * INPUT_SIZE;
    for (let p = 0; p < plane; p++) {
      chw[p] = rgba[p * 4] / 255;
      chw[plane + p] = rgba[p * 4 + 1] / 255;
      chw[2 * plane + p] = rgba[p * 4 + 2] / 255;
    }
    const t1 = performance.now();

    const outputs = await session.run({ images: new ort.Tensor('float32', chw, [1, 3, INPUT_SIZE, INPUT_SIZE]) });
    const t2 = performance.now();

    const out = outputs[session.outputNames[0]];
    const anchors = out.dims[2];
    const detections = decode(out.data as Float32Array, anchors, scale, padX, padY, srcW, srcH);
    const t3 = performance.now();

    post({ type: 'result', id, detections, preMs: t1 - t0, inferMs: t2 - t1, postMs: t3 - t2 });
  } catch (err) {
    post({ type: 'error', message: err instanceof Error ? err.message : String(err) });
  }
}

ctx.onmessage = (event) => {
  const msg = event.data;
  if (msg.type === 'load') void load(msg.variant);
  else void infer(msg.id, msg.bitmap);
};
