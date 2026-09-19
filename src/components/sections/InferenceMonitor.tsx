import React, { useCallback, useEffect, useRef, useState } from 'react';
import { COCO_LABELS } from '../inference/coco';
import { VARIANTS } from '../inference/protocol';
import type { Detection, Variant, WorkerIn, WorkerOut } from '../inference/protocol';

type Source = HTMLVideoElement | HTMLImageElement;
type Phase = 'idle' | 'starting' | 'running';

interface Hud {
  fps: number;
  p50: number;
  p95: number;
  spark: number[];
  objects: number;
}

const EMPTY_HUD: Hud = { fps: 0, p50: 0, p95: 0, spark: [], objects: 0 };
const MAX_STAGE_WIDTH = 640;
const MIN_FRAME_INTERVAL_MS = 33; // cap the loop near 30 iterations/s
const WINDOW = 60; // latency samples behind each percentile
const BOX_COLORS = ['#4ADE80', '#FCD34D', '#FF9FAC', '#60A5FA', '#A78BFA', '#F87171'];

const percentile = (values: number[], p: number) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
};

const friendlyError = (err: unknown) => {
  if (!navigator.mediaDevices) return 'The camera needs a secure (HTTPS) connection. Try the sample image instead.';
  const name = err instanceof DOMException ? err.name : '';
  if (name === 'NotAllowedError' || name === 'SecurityError')
    return 'Camera access was blocked. Allow it in your browser’s site settings, or use the sample image.';
  if (name === 'NotFoundError' || name === 'OverconstrainedError')
    return 'No camera was found on this device. Try the sample image instead.';
  return err instanceof Error ? err.message : 'Something went wrong starting the demo.';
};

function drawFrame(canvas: HTMLCanvasElement, source: Source, detections: Detection[]) {
  const g = canvas.getContext('2d');
  if (!g) return;
  const { width: cw, height: ch } = canvas;
  g.drawImage(source, 0, 0, cw, ch);
  g.lineWidth = 3;
  g.font = '700 14px ui-monospace, SFMono-Regular, Menlo, monospace';
  g.textBaseline = 'top';
  for (const d of detections) {
    const color = BOX_COLORS[d.cls % BOX_COLORS.length];
    const x = d.x * cw;
    const y = d.y * ch;
    g.strokeStyle = color;
    g.strokeRect(x, y, d.w * cw, d.h * ch);
    const label = `${COCO_LABELS[d.cls]} ${Math.round(d.score * 100)}%`;
    const tw = g.measureText(label).width + 10;
    const ly = y >= 20 ? y - 20 : y;
    g.fillStyle = color;
    g.fillRect(x - 1.5, ly, tw, 20);
    g.fillStyle = '#000';
    g.fillText(label, x + 3, ly + 3);
  }
}

const Metric = ({ label, value, unit }: { label: string; value: string; unit?: string }) => (
  <div className="border-2 border-neutral-700 rounded-lg px-3 py-2">
    <div className="text-xs text-neutral-400 uppercase tracking-wider">{label}</div>
    <div className="text-2xl font-bold text-white tabular-nums">
      {value}
      {unit && <span className="text-sm font-normal text-neutral-400 ml-1">{unit}</span>}
    </div>
  </div>
);

const InferenceMonitor = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [variant, setVariant] = useState<Variant>('wasm-int8');
  const [loading, setLoading] = useState<{ text: string; progress?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hud, setHud] = useState<Hud>(EMPTY_HUD);
  const [medians, setMedians] = useState<Partial<Record<Variant, number>>>({});
  const [summary, setSummary] = useState('');
  const [sourceKind, setSourceKind] = useState<'camera' | 'sample'>('sample');
  const [hasWebGPU] = useState(() => typeof navigator !== 'undefined' && 'gpu' in navigator);

  // Loop state lives in a ref: it changes every frame and must not re-render the page.
  const rt = useRef({
    worker: null as Worker | null,
    source: null as Source | null,
    stream: null as MediaStream | null,
    raf: 0,
    running: false,
    ready: false,
    inflight: false,
    onscreen: true,
    lastSent: 0,
    frameId: 0,
    active: 'wasm-int8' as Variant,
    detections: [] as Detection[],
    latencies: [] as number[],
    finished: [] as number[],
    medians: {} as Partial<Record<Variant, number>>,
  });

  const stopLoop = useCallback(() => {
    const s = rt.current;
    s.running = false;
    cancelAnimationFrame(s.raf);
    s.stream?.getTracks().forEach((t) => t.stop());
    s.stream = null;
    s.source = null;
    s.ready = false;
    s.inflight = false;
    s.detections = [];
    s.latencies = [];
    s.finished = [];
    s.medians = {};
  }, []);

  const sendFrame = useCallback(async (source: Source) => {
    const s = rt.current;
    try {
      const w = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
      const h = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
      const rw = Math.min(w, MAX_STAGE_WIDTH);
      const bitmap = await createImageBitmap(source, {
        resizeWidth: rw,
        resizeHeight: Math.round((rw * h) / w),
        resizeQuality: 'low',
      });
      const msg: WorkerIn = { type: 'frame', id: ++s.frameId, bitmap };
      s.worker?.postMessage(msg, [bitmap]);
    } catch {
      s.inflight = false;
    }
  }, []);

  const startLoop = useCallback(() => {
    const s = rt.current;
    if (s.running) return;
    s.running = true;
    const frame = (now: number) => {
      if (!s.running) return;
      s.raf = requestAnimationFrame(frame);
      const source = s.source;
      const canvas = canvasRef.current;
      if (!source || !canvas || !s.onscreen) return;
      if (source instanceof HTMLVideoElement && source.readyState < 2) return;
      drawFrame(canvas, source, s.detections);
      if (s.ready && !s.inflight && now - s.lastSent >= MIN_FRAME_INTERVAL_MS) {
        s.inflight = true;
        s.lastSent = now;
        void sendFrame(source);
      }
    };
    s.raf = requestAnimationFrame(frame);
  }, [sendFrame]);

  const ensureWorker = useCallback(() => {
    const s = rt.current;
    if (s.worker) return s.worker;
    const worker = new Worker(new URL('../inference/inference.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<WorkerOut>) => {
      const m = event.data;
      if (m.type === 'status') {
        setLoading({ text: m.text, progress: m.progress });
      } else if (m.type === 'ready') {
        s.active = m.variant;
        s.ready = true;
        s.latencies = [];
        s.finished = [];
        setLoading(null);
        setPhase('running');
        startLoop();
      } else if (m.type === 'result') {
        s.inflight = false;
        s.detections = m.detections;
        s.latencies.push(m.inferMs);
        if (s.latencies.length > WINDOW * 2) s.latencies.shift();
        s.finished.push(performance.now());
        if (s.finished.length > 240) s.finished.shift();
      } else if (m.type === 'error') {
        s.inflight = false;
        setLoading(null);
        if (m.variant) {
          // The requested variant failed to load: fall back to the one that was working.
          setError(
            m.variant === 'webgpu-fp32'
              ? 'WebGPU could not start on this device. Staying on WASM.'
              : `Could not load the model: ${m.message}`,
          );
          if (s.running && s.active !== m.variant) {
            setVariant(s.active);
            s.ready = true;
          } else {
            stopLoop();
            setPhase('idle');
          }
        } else {
          setError(m.message);
        }
      }
    };
    s.worker = worker;
    return worker;
  }, [startLoop, stopLoop]);

  const start = async (kind: 'camera' | 'sample') => {
    const s = rt.current;
    setError(null);
    setPhase('starting');
    setSourceKind(kind);
    setLoading({ text: kind === 'camera' ? 'Waiting for camera permission…' : 'Loading sample image…' });
    try {
      let source: Source;
      if (kind === 'camera') {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        s.stream = stream;
        const video = document.createElement('video');
        video.muted = true;
        video.playsInline = true;
        video.srcObject = stream;
        await video.play();
        source = video;
      } else {
        const img = new Image();
        img.src = `${import.meta.env.BASE_URL}sample/bus.jpg`;
        await img.decode();
        source = img;
      }
      const sw = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
      const sh = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = Math.min(sw, MAX_STAGE_WIDTH);
        canvas.height = Math.round((canvas.width * sh) / sw);
      }
      s.source = source;
      s.ready = false;
      const msg: WorkerIn = { type: 'load', variant };
      ensureWorker().postMessage(msg);
    } catch (err) {
      stopLoop();
      setLoading(null);
      setPhase('idle');
      setError(friendlyError(err));
    }
  };

  const stop = () => {
    stopLoop();
    setPhase('idle');
    setLoading(null);
    setHud(EMPTY_HUD);
    setMedians({});
    setSummary('');
  };

  const changeVariant = (next: Variant) => {
    if (next === variant) return;
    setError(null);
    setVariant(next);
    const s = rt.current;
    if (s.running) {
      s.ready = false; // pause sending frames until the new session is ready
      const msg: WorkerIn = { type: 'load', variant: next };
      ensureWorker().postMessage(msg);
    }
  };

  // Publish the numbers a few times a second instead of on every frame.
  useEffect(() => {
    if (phase !== 'running') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tick = 0;
    const id = window.setInterval(() => {
      const s = rt.current;
      const now = performance.now();
      const recent = s.latencies.slice(-WINDOW);
      const p50 = percentile(recent, 50);
      setHud({
        fps: s.finished.filter((t) => now - t <= 1000).length,
        p50,
        p95: percentile(recent, 95),
        spark: recent,
        objects: s.detections.length,
      });
      if (recent.length >= 20 && s.medians[s.active] !== p50) {
        s.medians = { ...s.medians, [s.active]: p50 };
        setMedians(s.medians);
      }
      // Screen readers get a calmer summary, roughly every two seconds.
      if (tick++ % (reduced ? 2 : 8) === 0) {
        const counts = new Map<string, number>();
        for (const d of s.detections) counts.set(COCO_LABELS[d.cls], (counts.get(COCO_LABELS[d.cls]) ?? 0) + 1);
        const parts = [...counts].map(([label, n]) => (n > 1 ? `${label} ×${n}` : label));
        setSummary(parts.length ? `${s.detections.length} detected: ${parts.join(', ')}` : 'Nothing detected');
      }
    }, reduced ? 1000 : 250);
    return () => window.clearInterval(id);
  }, [phase]);

  // Don't burn CPU while the widget is off screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      rt.current.onscreen = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const s = rt.current;
    return () => {
      stopLoop();
      s.worker?.terminate();
      s.worker = null;
    };
  }, [stopLoop]);

  const fp32 = medians['wasm-fp32'];
  const int8 = medians['wasm-int8'];
  const delta = fp32 && int8 ? Math.round((1 - int8 / fp32) * 100) : null;
  const running = phase === 'running';
  const v = VARIANTS[variant];
  const firstRunMB = (VARIANTS['wasm-int8'].sizeMB + VARIANTS['wasm-int8'].runtimeMB).toFixed(0);

  const options: Variant[] = hasWebGPU ? ['wasm-fp32', 'wasm-int8', 'webgpu-fp32'] : ['wasm-fp32', 'wasm-int8'];
  const sparkMax = Math.max(1, ...hud.spark);
  const sparkPoints = hud.spark
    .map((val, i) => `${(i / Math.max(1, WINDOW - 1)) * 100},${34 - (val / sparkMax) * 30}`)
    .join(' ');

  return (
    <section id="monitor" ref={sectionRef} className="py-10 px-4 max-w-7xl mx-auto scroll-mt-28">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-custom-green px-8 py-3 rounded-full border-4 border-black shadow-neo">
          <h2 className="text-3xl font-shrikhand text-black">INFERENCE MONITOR</h2>
        </div>
      </div>
      <p className="font-medium text-lg max-w-3xl mb-8 bg-white border-2 border-black rounded-xl px-4 py-3 shadow-neo-sm">
        Real-time object detection, running entirely in <strong>your</strong> browser. Switch between FP32 and INT8
        and compare their latency on your device. The WASM modes run on the CPU, so expect slower numbers than a native
        or GPU deployment.
      </p>

      <div className="bg-black border-4 border-black rounded-2xl shadow-neo overflow-hidden font-mono text-white">
        <div className="bg-gray-200 border-b-4 border-black px-4 py-2 flex items-center justify-between text-black">
          <div className="flex gap-2" aria-hidden="true">
            <div className="w-3 h-3 rounded-full bg-custom-red border-2 border-black"></div>
            <div className="w-3 h-3 rounded-full bg-custom-yellow border-2 border-black"></div>
            <div className="w-3 h-3 rounded-full bg-custom-green border-2 border-black"></div>
          </div>
          <span className="font-bold text-xs tracking-widest">inference-monitor.exe</span>
          <span className="text-xs font-bold flex items-center gap-1.5 w-16 justify-end">
            <span
              aria-hidden="true"
              className={`inline-block w-2 h-2 rounded-full border border-black ${running ? 'bg-custom-green' : 'bg-gray-400'}`}
            ></span>
            {running ? 'LIVE' : 'IDLE'}
          </span>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Stage */}
          <div className="relative bg-neutral-950 min-h-[22rem] lg:min-h-0 lg:aspect-[4/3] lg:border-r-4 border-black">
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              role="img"
              aria-label={
                running
                  ? `Live ${sourceKind === 'camera' ? 'camera feed' : 'sample image'} with detected objects outlined`
                  : 'Detection stage, not running'
              }
              className={`w-full h-full object-contain ${running ? '' : 'invisible'}`}
            />

            {phase === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <p className="text-lg font-bold max-w-md">YOLOv8n object detection, on-device.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => start('camera')}
                    className="min-h-11 bg-custom-green text-black font-bold px-6 py-2 rounded-xl border-2 border-white shadow-[4px_4px_0_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
                  >
                    START CAMERA
                  </button>
                  <button
                    onClick={() => start('sample')}
                    className="min-h-11 bg-white text-black font-bold px-6 py-2 rounded-xl border-2 border-white shadow-[4px_4px_0_rgba(255,255,255,0.4)] hover:translate-y-1 hover:shadow-none transition-all cursor-pointer"
                  >
                    USE SAMPLE IMAGE
                  </button>
                </div>
                <p className="text-sm text-neutral-300 max-w-md">
                  Nothing is uploaded. Frames stay in this tab. The first run downloads about {firstRunMB} MB (model
                  and runtime), then it is cached.
                </p>
                {error && (
                  <p role="alert" className="text-sm font-bold text-black bg-custom-yellow border-2 border-black rounded-lg px-3 py-2 max-w-md">
                    {error}
                  </p>
                )}
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-6 text-center">
                <p role="status" className="font-bold">{loading.text}</p>
                {loading.progress !== undefined && (
                  <div
                    role="progressbar"
                    aria-label="Download progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(loading.progress * 100)}
                    className="w-64 h-3 border-2 border-white rounded-full overflow-hidden"
                  >
                    <div className="h-full bg-custom-green" style={{ width: `${loading.progress * 100}%` }}></div>
                  </div>
                )}
              </div>
            )}

            {running && !loading && error && (
              <p role="alert" className="absolute bottom-3 left-3 right-3 text-sm font-bold text-black bg-custom-yellow border-2 border-black rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </div>

          {/* HUD */}
          <div className="p-4 flex flex-col gap-4 bg-neutral-900">
            <fieldset>
              <legend className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Precision · backend</legend>
              <div className="flex flex-col gap-2">
                {options.map((opt) => (
                  <label
                    key={opt}
                    className="min-h-11 flex items-center justify-between gap-3 px-3 py-2 rounded-lg border-2 border-neutral-600 cursor-pointer text-sm font-bold has-[:checked]:bg-custom-green has-[:checked]:text-black has-[:checked]:border-white has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-white"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="variant"
                        value={opt}
                        checked={variant === opt}
                        onChange={() => changeVariant(opt)}
                        className="accent-black"
                      />
                      {VARIANTS[opt].label}
                    </span>
                    <span className="text-xs font-normal opacity-80">{VARIANTS[opt].sizeMB} MB</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-2">
              <Metric label="FPS" value={running ? String(hud.fps) : '–'} />
              <Metric label="Objects" value={running ? String(hud.objects) : '–'} />
              <Metric label="p50" value={running && hud.p50 ? hud.p50.toFixed(0) : '–'} unit="ms" />
              <Metric label="p95" value={running && hud.p95 ? hud.p95.toFixed(0) : '–'} unit="ms" />
            </div>

            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Inference latency</div>
              <svg viewBox="0 0 100 36" preserveAspectRatio="none" className="w-full h-10" aria-hidden="true">
                <polyline points={sparkPoints} fill="none" stroke="#4ADE80" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <div className="text-sm border-t-2 border-neutral-700 pt-3 leading-relaxed">
              {delta !== null ? (
                <p>
                  <span className="text-custom-green font-bold">
                    INT8 vs FP32 in your browser: {delta >= 0 ? `−${delta}%` : `+${-delta}%`} latency
                  </span>{' '}
                  <span className="text-neutral-300">
                    ({int8!.toFixed(0)} vs {fp32!.toFixed(0)} ms, WASM)
                  </span>
                </p>
              ) : (
                <p className="text-neutral-300">
                  {running
                    ? 'Try both FP32 and INT8 (WASM) to compare them on your device.'
                    : 'Start the demo, then switch precision to compare.'}
                </p>
              )}
            </div>

            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-neutral-300">
              <dt className="text-neutral-400">Model</dt>
              <dd>YOLOv8n · COCO 80</dd>
              <dt className="text-neutral-400">Input</dt>
              <dd>320×320, letterboxed</dd>
              <dt className="text-neutral-400">Running</dt>
              <dd>{v.label}</dd>
            </dl>

            {phase !== 'idle' && (
              <button
                onClick={stop}
                className="min-h-11 mt-auto bg-custom-red text-black font-bold px-4 py-2 rounded-xl border-2 border-white hover:translate-y-1 transition-transform cursor-pointer"
              >
                STOP {sourceKind === 'camera' ? 'CAMERA' : 'DEMO'}
              </button>
            )}
          </div>
        </div>

        <div className="border-t-4 border-black bg-neutral-950 px-4 py-3 text-xs text-neutral-300 leading-relaxed">
          <details className="group mb-3">
            <summary className="min-h-11 flex items-center gap-2 cursor-pointer font-bold text-neutral-200 marker:content-none [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="inline-block transition-transform group-open:rotate-90">▸</span>
              How this runs
            </summary>
            <ul className="mt-1 mb-2 ml-5 list-disc space-y-1.5">
              <li>
                <strong className="text-white">Hosting:</strong> this site is static files on GitHub Pages: the page,
                the two ONNX models and the WebAssembly runtime. There is no backend and no inference server.
              </li>
              <li>
                <strong className="text-white">Inference:</strong> your browser downloads those files and runs the model
                in a Web Worker on your device. The WASM modes use your CPU; the WebGPU mode uses your GPU when the
                browser supports it.
              </li>
              <li>
                <strong className="text-white">Your frames:</strong> camera frames stay in this tab and are never sent
                anywhere.
              </li>
              <li>
                <strong className="text-white">Why the numbers are modest:</strong> static hosting can't enable
                multi-threaded WASM, so the CPU modes run on a single thread.
              </li>
            </ul>
          </details>
          INT8 stores weights and activations in 8 bits, which shrinks the model and usually cuts latency. In my
          TensorRT work it reduced YOLOv8 latency by 60%. Results in the browser vary with your device. Here INT8 is
          static QDQ quantization running on ONNX Runtime Web. Model: Ultralytics YOLOv8n (AGPL-3.0).
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {summary}
      </div>
    </section>
  );
};

export default InferenceMonitor;
