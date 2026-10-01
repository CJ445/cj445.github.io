const KEY = 'mode';
const META_COLOR = { agent: '#000000', human: '#ffffff' };

const listeners = new Set<() => void>();

export const isAgentMode = () => document.documentElement.classList.contains('agent');

const apply = (on: boolean) => {
  const root = document.documentElement;
  root.classList.toggle('agent', on);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (on) meta?.setAttribute('content', META_COLOR.agent);
  else meta?.setAttribute('content', root.classList.contains('dark') ? '#07090e' : META_COLOR.human);
  listeners.forEach((l) => l());
};

export const setAgentMode = (on: boolean) => {
  try {
    if (on) localStorage.setItem(KEY, 'agent');
    else localStorage.removeItem(KEY);
  } catch {
    /* private mode: the choice just won't persist */
  }
  apply(on);
  window.scrollTo(0, 0);
};

export const subscribeAgentMode = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Call once on load. The class itself is set before first paint by the inline script in index.html. */
export const initAgentMode = () => {
  if (isAgentMode()) apply(true);
};
