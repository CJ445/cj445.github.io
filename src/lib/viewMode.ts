/* Two ways to read the portfolio: the 3D unboxing (default) and the original flat page. The choice persists. */
export type View = '3d' | '2d';

const KEY = 'view';
const listeners = new Set<() => void>();
let current: View = (() => {
  try {
    return localStorage.getItem(KEY) === '2d' ? '2d' : '3d';
  } catch {
    return '3d';
  }
})();

export const getView = (): View => current;

export const setView = (view: View, { persist = true } = {}) => {
  current = view;
  if (persist) {
    try {
      if (view === '2d') localStorage.setItem(KEY, '2d');
      else localStorage.removeItem(KEY);
    } catch {
      /* private mode: the choice just won't persist */
    }
  }
  window.scrollTo(0, 0);
  listeners.forEach((l) => l());
};

export const subscribeView = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
