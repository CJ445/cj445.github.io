import { profile } from '../../data/portfolio';
import AgentToggle from '../ui/AgentToggle';
import ThemeToggle from '../ui/ThemeToggle';
import ViewToggle from '../ui/ViewToggle';

/** The closed case. The name is printed on the 3D lid behind this; the cover itself only holds the controls. */
const Cover = () => (
  <div data-shot="0" className="relative flex min-h-dvh flex-col justify-between px-3 pb-8 pt-3 sm:px-5">
    <p className="sr-only">
      {profile.name}, {profile.headline}. Scroll to power on and open the case.
    </p>
    <div className="mx-auto flex w-full max-w-[70.9rem] justify-end gap-1">
      <ViewToggle view="3d" />
      <AgentToggle />
      <ThemeToggle />
    </div>
    <p className="gpu-scroll-hint mx-auto flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-secondary">
      Scroll to power on
      <span aria-hidden="true" className="gpu-scroll-line" />
    </p>
  </div>
);

export default Cover;
