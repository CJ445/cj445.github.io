export type Theme = 'light' | 'dark';

const KEY = 'theme';
const META_COLOR: Record<Theme, string> = { light: '#ffffff', dark: '#07090e' };

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const currentTheme = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

const apply = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLOR[theme]);
};

const saved = (): Theme | null => {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
};

/** Replays the ignition animation: a light sweep across the top edge and the glow spooling up. */
const ignite = () => {
  if (prefersReducedMotion()) return;
  const root = document.documentElement;
  root.classList.remove('igniting');
  void root.offsetWidth; // restart the animations if they are already running
  root.classList.add('igniting');
  window.setTimeout(() => root.classList.remove('igniting'), 1900);
};

/**
 * Switches appearance. Going dark opens as a circle from `origin` (the switch) and then ignites;
 * going light is a plain swap. With Reduce Motion or no View Transitions API it is instant.
 */
export const setTheme = (theme: Theme, origin?: { x: number; y: number }) => {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* private mode: the choice just won't persist */
  }

  const change = () => {
    apply(theme);
    if (theme === 'dark') ignite();
  };

  if (prefersReducedMotion() || !document.startViewTransition) {
    change();
    return;
  }

  const transition = document.startViewTransition(change);
  if (theme === 'dark' && origin) {
    transition.ready.then(() => {
      const radius = Math.hypot(Math.max(origin.x, innerWidth - origin.x), Math.max(origin.y, innerHeight - origin.y));
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${radius}px at ${origin.x}px ${origin.y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.6, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  }
};

/** Call once on load: plays the ignition if the visitor arrives in night, and follows the system until they choose. */
export const initTheme = () => {
  if (currentTheme() === 'dark') requestAnimationFrame(ignite);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (saved() === null) apply(e.matches ? 'dark' : 'light');
  });
};
