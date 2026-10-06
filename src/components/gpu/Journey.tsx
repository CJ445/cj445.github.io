import { useEffect, useRef, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { profile } from '../../data/portfolio';
import { setView } from '../../lib/viewMode';
import type { GpuScene } from './scene';
import { stageContent } from './stageContent';
import type { SheetKey } from './stageContent';
import FleetReadout from './FleetReadout';
import LiveReadout from './LiveReadout';
import { FIRST_CONTENT_SHOT, flatten, shots } from './shots';

/* The whole portfolio is the unboxing. A fixed WebGL canvas holds a GPU box and the card inside it; every section of
   the page is a camera shot. Each stage says one thing in type set directly on the scene and wires short callouts to
   parts of the hardware. The long form opens in a datasheet. Scroll position is written straight to the scene and the
   DOM, so React only re-renders when the focused stage changes. */

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const pad = (i: number) => String(i).padStart(2, '0');
const reducedMotionQuery = () => window.matchMedia('(prefers-reduced-motion: reduce)');
const vectors = shots.map(flatten);
const YAW = 12;
const POWER = 17;
const SEGS = 12;
const MAX_CLOCK = 2520;
const MAX_RPM = 2400;
/** One readable address per stage, so a link can point straight at Experience (#die) or the finale (#fleet). */
const SLUGS: Record<number, string> = { 2: 'card', 3: 'cooler', 4: 'die', 5: 'memory', 6: 'inference', 7: 'power', 8: 'pcie', 9: 'assembled', 10: 'fleet' };
const shotForHash = (hash: string) => Number(Object.entries(SLUGS).find(([, s]) => `#${s}` === hash)?.[0] ?? -1);
/** The link the reader arrived with, read before anything can rewrite it. */
const ARRIVAL_HASH = typeof window === 'undefined' ? '' : window.location.hash;
const SHEET_LABEL: Record<SheetKey, string> = {
  about: 'About',
  featured: 'Featured work',
  experience: 'Experience',
  projects: 'Projects',
  demo: 'Live demo',
  skills: 'Skills',
  education: 'Education',
  recognition: 'Recognition',
  writing: 'Writing',
};

interface JourneyProps {
  onOpenSheet: (key: SheetKey) => void;
}

const Journey = ({ onOpenSheet }: JourneyProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  const calloutRefs = useRef<(HTMLDivElement | null)[][]>(stageContent.map(() => []));
  const lineRefs = useRef<(SVGPathElement | null)[][]>(stageContent.map(() => []));
  const dotRefs = useRef<(SVGGElement | null)[][]>(stageContent.map(() => []));
  const hudRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLElement>(null);
  const fanRef = useRef<HTMLElement>(null);
  const segRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [shot, setShot] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!canvas || !layer) return;
    let disposed = false;
    let scene: GpuScene | null = null;
    let raf = 0;
    let lastShot = 0;
    // While an arrival link is being honoured, leave the address bar alone.
    let holdHash = shotForHash(ARRIVAL_HASH) >= 0;
    const rm = reducedMotionQuery();

    const frame = () => {
      raf = 0;
      if (!scene) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const wide = vw >= 1024;
      const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-shot]'))
        .map((el) => ({ n: Number(el.dataset.shot), top: el.getBoundingClientRect().top + y, h: el.offsetHeight }))
        .sort((a, b) => a.top - b.top);
      if (!anchors.length) return;
      const line = y + vh * 0.5;
      const w = vh * 0.3;
      const v = vectors[anchors[0].n].slice();
      let f = anchors[0].n;
      for (let i = 1; i < anchors.length; i++) {
        const t = smooth(clamp((line - anchors[i].top + w) / (2 * w)));
        const a = vectors[anchors[i - 1].n];
        const b = vectors[anchors[i].n];
        for (let k = 0; k < v.length; k++) v[k] += (b[k] - a[k]) * t;
        f += (anchors[i].n - anchors[i - 1].n) * t;
      }

      // Progress inside each stage drives both the callout reveal and a slow camera sway.
      const progress = new Map<number, number>();
      for (const a of anchors) progress.set(a.n, clamp((line - a.top) / Math.max(a.h, 1)));
      const near = clamp(Math.round(f), 0, shots.length - 1);
      if (!rm.matches) v[YAW] += ((progress.get(near) ?? 0.5) - 0.5) * 0.5 * clamp(1.4 - 2 * Math.abs(f - near));
      scene.apply(v, wide, f);

      // Power readout: clock and fan RPM climb with the ignition, then the readout steps aside.
      const power = clamp(v[POWER]);
      const hint = document.querySelector<HTMLElement>('.gpu-scroll-hint');
      if (hint) hint.style.opacity = String(clamp(1 - y / (vh * 0.12)));
      if (hudRef.current) hudRef.current.style.opacity = String(clamp(1 - (f - 1.7) / 0.8));
      if (clockRef.current) clockRef.current.textContent = Math.round(power * MAX_CLOCK).toLocaleString();
      if (fanRef.current) fanRef.current.textContent = Math.round(power * power * MAX_RPM).toLocaleString();
      segRefs.current.forEach((s, i) => s && s.classList.toggle('is-on', power * SEGS * 1.02 > i));

      // The shot the reader is in.
      let current = anchors[0];
      for (const a of anchors) if (a.top <= line) current = a;
      if (current.n !== lastShot) {
        lastShot = current.n;
        setShot(current.n);
        const slug = holdHash ? undefined : SLUGS[current.n];
        const target = slug ? `#${slug}` : '';
        if (!holdHash && window.location.hash !== target) window.history.replaceState(null, '', target || window.location.pathname + window.location.search);
      }

      // Callouts: type on the scene, wired to parts of the card. Hidden stages cost nothing.
      stageContent.forEach((s, si) => {
        const weight = clamp(1.4 - 2 * Math.abs(f - s.shot));
        const col = colRefs.current[si];
        if (!col) return;
        col.style.opacity = String(weight);
        col.style.visibility = weight < 0.02 ? 'hidden' : 'visible';
        col.style.pointerEvents = weight > 0.6 ? 'auto' : 'none';
        if (weight < 0.02) {
          lineRefs.current[si].forEach((p) => p && (p.style.opacity = '0'));
          dotRefs.current[si].forEach((d) => d && (d.style.opacity = '0'));
          return;
        }
        const p = progress.get(s.shot) ?? 0;
        const n = s.callouts.length;
        // Pair callouts (top to bottom) with their anchors (top to bottom on screen) so the wires fan out without crossing.
        const pts = s.callouts.map((c) => scene!.project(c.anchor));
        const order = pts.map((_, i) => i).sort((a, b) => pts[a][1] - pts[b][1]);
        s.callouts.forEach((c, i) => {
          const el = calloutRefs.current[si][i];
          const path = lineRefs.current[si][i];
          const dot = dotRefs.current[si][i];
          if (!el || !path || !dot) return;
          // wide: each callout fades in as the reader scrolls through the stage; narrow: one at a time
          const reveal = wide ? clamp((p - (i / n) * 0.65) / 0.12) : i === Math.min(n - 1, Math.floor(p * n * 0.999)) ? 1 : 0;
          const o = weight * reveal;
          el.style.opacity = String(o);
          el.style.transform = `translateY(${(1 - reveal) * 10}px)`;
          const port = el.querySelector('.callout-port')?.getBoundingClientRect();
          if (!port || o < 0.02) {
            path.style.opacity = '0';
            dot.style.opacity = '0';
            return;
          }
          const [ax, ay] = wide ? pts[order[i]] : pts[i];
          const px = port.left + port.width / 2;
          const py = port.top + port.height / 2;
          path.setAttribute('d', `M${px} ${py} Q${(px + ax) / 2} ${py} ${ax} ${ay}`);
          path.style.opacity = String(o);
          dot.setAttribute('transform', `translate(${ax} ${ay})`);
          dot.style.opacity = String(o);
        });
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    (async () => {
      try {
        const { createScene } = await import('./scene');
        await Promise.race([document.fonts.load('500 120px Inter'), new Promise((r) => setTimeout(r, 1200))]);
        if (disposed) return;
        scene = createScene(canvas, layer, profile);
        scene.setMotion(!rm.matches);
        setReady(true);
        schedule();
        const start = shotForHash(ARRIVAL_HASH);
        if (start >= 0) {
          // Spacer heights settle a moment after the scene starts, so wait for layout before jumping.
          window.setTimeout(() => {
            const el = document.querySelector<HTMLElement>(`[data-shot="${start}"]`);
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 2, behavior: 'auto' });
            holdHash = false;
            lastShot = -1;
            schedule();
          }, 900);
        }
      } catch (err) {
        // No WebGL (or the scene failed): fall back to the classic page for this visit.
        console.warn('3D view unavailable, showing the classic page.', err);
        if (!disposed) setView('2d', { persist: false });
      }
    })();

    const onResize = () => {
      scene?.resize();
      schedule();
    };
    const onMotion = () => scene?.setMotion(!rm.matches);
    const onHash = () => {
      const k = shotForHash(window.location.hash);
      const el = k >= 0 ? document.querySelector<HTMLElement>(`[data-shot="${k}"]`) : null;
      if (el && k !== lastShot) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 2, behavior: rm.matches ? 'auto' : 'smooth' });
    };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    rm.addEventListener('change', onMotion);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      disposed = true;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('hashchange', onHash);
      rm.removeEventListener('change', onMotion);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      scene?.dispose();
    };
  }, []);

  const goTo = (k: number) => {
    const el = document.querySelector<HTMLElement>(`[data-shot="${k}"]`);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 2, behavior: reducedMotionQuery().matches ? 'auto' : 'smooth' });
  };

  const reading = ready && shot >= FIRST_CONTENT_SHOT;

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className={`gpu-canvas ${ready ? 'is-ready' : ''}`} />
      <div ref={layerRef} className="gpu-layer" />

      <div ref={hudRef} aria-hidden="true" className="power-hud">
        <div className="power-row">
          <span>Core clock</span>
          <b ref={clockRef}>0</b>
          <i>MHz</i>
        </div>
        <div className="power-row">
          <span>Fan</span>
          <b ref={fanRef}>0</b>
          <i>RPM</i>
        </div>
        <div className="power-bar">
          {Array.from({ length: SEGS }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                segRefs.current[i] = el;
              }}
              className={i >= SEGS * 0.8 ? 'is-red' : ''}
            />
          ))}
        </div>
      </div>

      <svg aria-hidden="true" className="gpu-leader">
        {stageContent.map((s, si) =>
          s.callouts.map((c, i) => (
            <g key={`${s.shot}-${i}`}>
              <path
                ref={(el) => {
                  lineRefs.current[si][i] = el;
                }}
                fill="none"
                stroke="var(--a-accent)"
                strokeWidth="1"
              />
              <g
                ref={(el) => {
                  dotRefs.current[si][i] = el;
                }}
              >
                <circle r="8" fill="none" stroke="var(--a-accent)" strokeWidth="1" className="gpu-ping" />
                <circle r="3" fill="var(--a-accent)" />
              </g>
            </g>
          )),
        )}
      </svg>

      <div className="stage-layer">
        {stageContent.map((s, si) => {
          const left = shots[s.shot].side > 0;
          return (
            <div
              key={s.shot}
              ref={(el) => {
                colRefs.current[si] = el;
              }}
              className={`stage-col ${left ? 'stage-col-left' : 'stage-col-right'}`}
            >
              <div className="stage-head">
                <p className="stage-kicker">
                  {pad(s.shot - FIRST_CONTENT_SHOT + 1)} <span>/ {pad(shots.length - FIRST_CONTENT_SHOT)}</span> · {shots[s.shot].label}
                </p>
                <h2 className="stage-headline">{s.headline}</h2>
                <p className="stage-lede">{s.lede}</p>
                {s.sheet === 'demo' && <LiveReadout />}
                {s.sheet === 'writing' && <FleetReadout />}
                <button type="button" className="stage-sheet" onClick={() => onOpenSheet(s.sheet)}>
                  {s.sheet === 'demo' ? 'Run the demo' : `Open ${SHEET_LABEL[s.sheet].toLowerCase()} datasheet`} <FaArrowRight aria-hidden="true" />
                </button>
              </div>
              <div className="stage-callouts">
                {s.callouts.map((c, i) => (
                  <div
                    key={c.title}
                    ref={(el) => {
                      calloutRefs.current[si][i] = el;
                    }}
                    className="callout"
                  >
                    <span className="callout-port" aria-hidden="true" />
                    <h3 className="callout-title">{c.title}</h3>
                    {c.text && <p className="callout-text">{c.text}</p>}
                    {c.photo && (
                      <img
                        src={`${import.meta.env.BASE_URL}${c.photo.src}`}
                        alt={c.photo.alt}
                        loading="lazy"
                        width={160}
                        height={120}
                        className="callout-photo"
                      />
                    )}
                    {c.stats && (
                      <dl className="callout-stats">
                        {c.stats.map((st) => (
                          <div key={st.label}>
                            <dt>{st.label}</dt>
                            <dd>{st.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {c.link && (
                      <a href={c.link.href} target={c.link.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" className="callout-link">
                        {c.link.label} <FaArrowRight aria-hidden="true" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <nav aria-label="Stages of inference" className={`gpu-rail ${reading ? 'is-on' : ''}`}>
        {shots.slice(FIRST_CONTENT_SHOT).map((s, i) => {
          const k = i + FIRST_CONTENT_SHOT;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => goTo(k)}
              aria-label={s.label}
              aria-current={k === shot ? 'step' : undefined}
              className="gpu-tick group flex h-6 items-center justify-end gap-2 pl-2"
            >
              <span className="hidden font-mono text-[10px] uppercase tracking-widest text-secondary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:inline">
                {s.label}
              </span>
              <span className={`gpu-tick-bar ${k === shot ? 'is-on' : ''}`} />
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Journey;
