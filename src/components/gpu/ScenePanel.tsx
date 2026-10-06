import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { lidSize, registerPanel, subscribePanels, unregisterPanel, world } from './panelRegistry';

interface ScenePanelProps {
  shot: number;
  id?: string;
  children: ReactNode;
}

/* DOM mutations on the host live outside the component: the host is created once and owned by the 3D scene later. */
const resetHost = (host: HTMLElement, section: HTMLElement) => {
  if (host.parentElement !== section) section.appendChild(host);
  host.style.cssText = '';
  host.classList.remove('is-world');
};
const sizeHost = (host: HTMLElement) => {
  const { w, h } = lidSize();
  host.classList.add('is-world');
  host.style.width = `${w}px`;
  host.style.height = `${h}px`;
};

/** Content that hangs on the inside of the box lid. Until the scene is ready it is an ordinary block in the page. */
const ScenePanel = ({ shot, id, children }: ScenePanelProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [host] = useState(() => {
    const el = document.createElement('div');
    el.className = 'world-panel world-panel-lid';
    return el;
  });

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;
    const entry = { shot, kind: 'lid' as const, section, host, inner, contentH: 0, panelH: lidSize().h };

    const measure = () => {
      if (!world.active) {
        resetHost(host, section);
        section.style.height = '';
        return;
      }
      sizeHost(host);
      section.style.height = `${window.innerHeight * 1.4}px`;
    };

    registerPanel(entry);
    const unsub = subscribePanels(measure);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      unsub();
      window.removeEventListener('resize', measure);
      unregisterPanel(shot);
      resetHost(host, section);
      host.remove();
    };
  }, [shot, host]);

  return (
    <section ref={sectionRef} id={id} data-shot={shot}>
      {createPortal(
        <div ref={innerRef} className="world-panel-inner">
          {children}
        </div>,
        host,
      )}
    </section>
  );
};

export default ScenePanel;
