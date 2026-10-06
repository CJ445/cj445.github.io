/* A tiny live feed between the browser demo and the 3D die. Every real inference reports how long it took; the die
   plays one sweep of that duration. Nothing here is simulated: with the demo closed, the die is idle. */
export interface InferenceLive {
  /** Increments on every completed inference. */
  tick: number;
  lastMs: number;
  objects: number;
  /** performance.now() of the last result, 0 if none yet. */
  at: number;
}

let state: InferenceLive = { tick: 0, lastMs: 0, objects: 0, at: 0 };
const listeners = new Set<() => void>();

export const getInferenceLive = () => state;
export const subscribeInferenceLive = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

let idleTimer = 0;

export const reportInference = (ms: number, objects: number) => {
  state = { tick: state.tick + 1, lastMs: ms, objects, at: performance.now() };
  listeners.forEach((l) => l());
  // Results stop arriving when the demo stops: fall back to idle after a couple of seconds of silence.
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(reportIdle, 2500);
};

export function reportIdle() {
  state = { ...state, at: 0 };
  listeners.forEach((l) => l());
}
