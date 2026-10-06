import { Suspense, lazy, useEffect, useRef } from 'react';
import About from '../sections/About';
import Education from '../sections/Education';
import Experience from '../sections/Experience';
import FeaturedWork from '../sections/FeaturedWork';
import Projects from '../sections/Projects';
import Recognition from '../sections/Recognition';
import Skills from '../sections/Skills';
import Writing from '../sections/Writing';
import { SheetContext } from '../ui/SheetContext';
import type { SheetKey } from './stageContent';

const LiveDemo = lazy(() => import('../sections/LiveDemo'));

const CONTENT: Record<SheetKey, () => React.JSX.Element> = {
  about: About,
  featured: FeaturedWork,
  experience: Experience,
  projects: Projects,
  demo: () => (
    <Suspense fallback={<div className="m-6 h-96 animate-pulse rounded-2xl border border-primary/10 bg-primary/[0.03]" />}>
      <LiveDemo />
    </Suspense>
  ),
  skills: Skills,
  education: Education,
  recognition: Recognition,
  writing: Writing,
};

interface DatasheetProps {
  open: SheetKey | null;
  onClose: () => void;
}

/** The long form of a stage: the original section, in a sheet. Esc, the backdrop and Close all dismiss it. */
const Datasheet = ({ open, onClose }: DatasheetProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const Body = open ? CONTENT[open] : null;

  return (
    <dialog
      ref={ref}
      aria-label="Datasheet"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="datasheet"
    >
      <div className="datasheet-bar">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-secondary">Datasheet</span>
        <button type="button" onClick={onClose} className="datasheet-close">
          Close
        </button>
      </div>
      <SheetContext.Provider value>{Body && <Body />}</SheetContext.Provider>
    </dialog>
  );
};

export default Datasheet;
