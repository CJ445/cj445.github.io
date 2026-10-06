export interface Stage {
  id: string;
  name: string;
  /** One line, shown on hover. */
  summary: string;
  /** Technical explanation, shown in the expanded view. */
  detail: string;
  facts: { label: string; value: string }[];
}

export const AUTOPILOT_URL = 'https://github.com/CJ445/inference-autopilot';

export const stages: Stage[] = [
  {
    id: 'silicon',
    name: 'Silicon',
    summary: 'The die: streaming multiprocessors tiled around a shared L2 cache.',
    detail:
      'A GPU die is a tiled array of streaming multiprocessors (SMs) surrounded by memory controllers and I/O. Everything above this layer is scheduled onto these repeating units, so the floorplan sets the ceiling for parallelism.',
    facts: [
      { label: 'Unit of compute', value: 'Streaming multiprocessor' },
      { label: 'Example scale', value: '132 SMs on an H100 SXM' },
      { label: 'Shared by all SMs', value: 'L2 cache + memory controllers' },
    ],
  },
  {
    id: 'cuda',
    name: 'CUDA',
    summary: 'Threads grouped into warps, warps into blocks, blocks into a grid.',
    detail:
      'A kernel launches a grid of thread blocks. Each block lands on one SM and executes as warps of 32 threads in lockstep. Divergent branches serialize a warp, which is why control flow shows up directly in throughput.',
    facts: [
      { label: 'Warp size', value: '32 threads' },
      { label: 'Block limit', value: '1,024 threads' },
      { label: 'Block placement', value: 'One block, one SM' },
    ],
  },
  {
    id: 'memory',
    name: 'Memory',
    summary: 'Registers, shared memory, L2 and HBM: each tier larger and slower.',
    detail:
      'Performance is mostly a question of where the bytes live. Registers and shared memory sit on the SM; L2 is shared across the die; HBM is off-die but wide. Inference decode is typically bound by HBM bandwidth, not arithmetic.',
    facts: [
      { label: 'Fastest tier', value: 'Registers' },
      { label: 'On-SM, programmable', value: 'Shared memory / L1' },
      { label: 'Decode bottleneck', value: 'HBM bandwidth' },
    ],
  },
  {
    id: 'tensor',
    name: 'Tensor',
    summary: 'Matrix multiply-accumulate on small tiles, the core of every layer.',
    detail:
      'Tensor cores compute D = A × B + C on small matrix tiles in a single operation. Large matmuls are decomposed into these tiles, and precision (FP16, FP8, INT8) trades accuracy for throughput and memory.',
    facts: [
      { label: 'Primitive', value: 'D = A × B + C' },
      { label: 'Precisions', value: 'FP16 · FP8 · INT8' },
      { label: 'Decomposition', value: 'Tiled matmul' },
    ],
  },
  {
    id: 'model',
    name: 'Model',
    summary: 'Layers of matmuls and attention, with a KV cache carrying context.',
    detail:
      'Inference has two phases. Prefill processes the whole prompt in parallel and is compute-bound. Decode generates one token at a time, reads the KV cache every step, and is memory-bound. The two stress the hardware differently.',
    facts: [
      { label: 'Prefill', value: 'Parallel, compute-bound' },
      { label: 'Decode', value: 'Sequential, memory-bound' },
      { label: 'State carried', value: 'KV cache per request' },
    ],
  },
  {
    id: 'scheduler',
    name: 'Scheduler',
    summary: 'Requests of different lengths packed into shared batches.',
    detail:
      'Serving one request at a time wastes the GPU. Continuous batching admits new requests into the running batch at every decode step, so short requests leave early and long ones do not block them. The scheduler trades latency for utilization.',
    facts: [
      { label: 'Technique', value: 'Continuous batching' },
      { label: 'Admission point', value: 'Every decode step' },
      { label: 'Trade-off', value: 'Latency vs. utilization' },
    ],
  },
  {
    id: 'telemetry',
    name: 'Telemetry',
    summary: 'GPU and serving signals sampled over time, judged against thresholds.',
    detail:
      'A running system is only understandable through its signals: latency percentiles, queue depth, GPU utilization, memory, temperature and error counters. Tail latency (p99) exposes problems that averages hide.',
    facts: [
      { label: 'Latency', value: 'p50 / p99' },
      { label: 'GPU signals', value: 'Utilization, memory, temperature' },
      { label: 'Why p99', value: 'Averages hide the tail' },
    ],
  },
  {
    id: 'recovery',
    name: 'Recovery',
    summary: 'Detect a fault, contain it, restore service and verify it held.',
    detail:
      'Failures are a state machine, not an exception: healthy, degraded, failed, recovering. Recovery is only complete once the service is verified healthy again, otherwise a fix is just a guess that nobody checked.',
    facts: [
      { label: 'Loop', value: 'Detect → contain → recover → verify' },
      { label: 'Exit condition', value: 'Verified healthy' },
      { label: 'Guard', value: 'Policy-gated remediation' },
    ],
  },
  {
    id: 'fleet',
    name: 'Fleet',
    summary: 'A router spreading load across nodes, each with several GPUs.',
    detail:
      'At scale the unit is the fleet: a router places requests across nodes, each hosting several GPUs. Telemetry from every node feeds a control loop that reacts to faults. That loop is what Inference Autopilot builds.',
    facts: [
      { label: 'Topology', value: 'Router → nodes → GPUs' },
      { label: 'Feedback', value: 'Telemetry into control loop' },
      { label: 'Project', value: 'Inference Autopilot' },
    ],
  },
];
