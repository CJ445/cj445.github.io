import { lazy, Suspense } from 'react';
import Section from '../ui/Section';

// The ONNX runtime is large, so it only loads once this section is rendered.
const InferenceMonitor = lazy(() => import('./InferenceMonitor'));

const LiveDemo = () => (
  <Section
    id="demo"
    eyebrow="Live demo"
    title="Inference monitor"
    description="Real-time object detection running entirely in your browser. Switch between FP32 and INT8 and compare latency on your own device. The WASM modes run on the CPU, so expect slower numbers than a native or GPU deployment."
  >
    <Suspense fallback={<div className="h-96 animate-pulse rounded-[1.75rem] border border-primary/10 bg-primary/[0.03]" />}>
      <InferenceMonitor />
    </Suspense>
  </Section>
);

export default LiveDemo;
