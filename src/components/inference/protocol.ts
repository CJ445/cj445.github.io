export type Variant = 'wasm-fp32' | 'wasm-int8' | 'webgpu-fp32';

// Respect Vite's `base`, so the demo also works from a subpath such as GitHub Pages project sites.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const VARIANTS: Record<
  Variant,
  { label: string; precision: 'FP32' | 'INT8'; backend: 'WASM' | 'WebGPU'; file: string; sizeMB: number; runtimeMB: number }
> = {
  'wasm-fp32': { label: 'FP32 · WASM', precision: 'FP32', backend: 'WASM', file: asset('models/yolov8n-fp32-320.onnx'), sizeMB: 12.7, runtimeMB: 14 },
  'wasm-int8': { label: 'INT8 · WASM', precision: 'INT8', backend: 'WASM', file: asset('models/yolov8n-int8-320.onnx'), sizeMB: 3.5, runtimeMB: 14 },
  'webgpu-fp32': { label: 'FP32 · WebGPU', precision: 'FP32', backend: 'WebGPU', file: asset('models/yolov8n-fp32-320.onnx'), sizeMB: 12.7, runtimeMB: 28 },
};

export const INPUT_SIZE = 320;

export interface Detection {
  /** Normalized to the source frame: 0..1 */
  x: number;
  y: number;
  w: number;
  h: number;
  score: number;
  cls: number;
}

export type WorkerIn =
  | { type: 'load'; variant: Variant }
  | { type: 'frame'; id: number; bitmap: ImageBitmap };

export type WorkerOut =
  | { type: 'status'; text: string; progress?: number }
  | { type: 'ready'; variant: Variant }
  | { type: 'error'; message: string; variant?: Variant }
  | { type: 'result'; id: number; detections: Detection[]; preMs: number; inferMs: number; postMs: number };
