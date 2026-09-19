import React, { useEffect, useRef, useState } from 'react';

// Only replace the system cursor when there is a fine pointer (mouse/trackpad).
// Touch devices, and anyone who prefers reduced motion, keep the native cursor.
const shouldUseCustomCursor = () =>
  window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const INTERACTIVE = 'a, button, label, summary, input, textarea, [role="button"]';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(shouldUseCustomCursor);

  useEffect(() => {
    if (!enabled) return;
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        // Over controls the native cursor takes over, so hide the drawn arrow.
        const overControl = e.target instanceof Element && e.target.closest(INTERACTIVE) !== null;
        cursorRef.current.style.opacity = overControl ? '0' : '1';
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Keep the native cursor where it carries meaning: links, buttons, text fields. */}
      <style>{`
        body, div, section, main { cursor: none; }
        a, button, label, summary, [role="button"] { cursor: pointer; }
        input, textarea { cursor: text; }
      `}</style>

      <div
        ref={cursorRef}
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ marginLeft: '-2px', marginTop: '-2px' }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.5 2L18 13.5L11.5 13.5L15 21L12 22L8.5 14.5L2.5 19.5L5.5 2Z"
            fill="#FF9FAC"
            stroke="black"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  );
};

export default CustomCursor;
