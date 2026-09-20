import { useState } from 'react';
import type { MouseEvent } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { currentTheme, setTheme } from '../../lib/theme';

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => currentTheme() === 'dark');

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next = dark ? 'light' : 'dark';
    const box = e.currentTarget.getBoundingClientRect();
    setTheme(next, { x: box.left + box.width / 2, y: box.top + box.height / 2 });
    setDark(next === 'dark');
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Night mode"
      onClick={toggle}
      className="group flex h-11 cursor-pointer items-center gap-2 rounded-full pl-3 pr-1 text-xs text-primary"
    >
      <span className="hidden sm:inline">Night</span>
      <span
        aria-hidden="true"
        className={`relative h-7 w-12 rounded-full border transition-colors duration-300 ${
          dark ? 'border-accent/50 bg-accent/25 shadow-[0_0_16px_rgba(139,92,246,0.45)]' : 'border-primary/15 bg-raised/70'
        }`}
      >
        <span
          className={`absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-all duration-300 ease-out ${
            dark ? 'left-[1.625rem] bg-accent text-surface' : 'left-0.5 bg-primary text-surface'
          }`}
        >
          {dark ? <FaMoon /> : <FaSun />}
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
