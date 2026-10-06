/* The fleet finale plays the Inference Autopilot loop: detect, find the cause, dispatch a fix, verify. The 3D scene
   owns the clock and publishes the phase here so the caption can say what the lit node is doing. */
export type FleetPhase = 0 | 1 | 2 | 3;

export const FLEET_UNIT = 37;
export const FLEET_PHASES = [
  'All 60 nodes healthy.',
  `Node ${FLEET_UNIT} faulted. Detected from telemetry.`,
  'Root cause found. Remediation dispatched.',
  `Recovery verified. Node ${FLEET_UNIT} is healthy again.`,
] as const;

let phase: FleetPhase = 0;
const listeners = new Set<() => void>();

export const getFleetPhase = () => phase;
export const subscribeFleetPhase = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const setFleetPhase = (p: FleetPhase) => {
  if (p === phase) return;
  phase = p;
  listeners.forEach((l) => l());
};
