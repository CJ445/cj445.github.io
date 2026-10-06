import { useSyncExternalStore } from 'react';
import { FaDownload, FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaMedium } from 'react-icons/fa';
import { profile } from '../../data/portfolio';
import ScenePanel from './ScenePanel';
import VisitorCount from '../ui/VisitorCount';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const pillBase = 'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors';
const pillLight = `${pillBase} border-primary/10 bg-raised text-primary hover:bg-primary/5`;
const pillDark = `${pillBase} border-primary bg-primary text-surface hover:bg-primary/90`;

const LidHeroWide = () => (
  <ScenePanel shot={1} id="top">
    <div className="flex h-full items-stretch gap-8 p-10">
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--a-accent)]">Unboxing</p>
          <h1 className="text-4xl font-normal leading-none tracking-[-0.04em]">{profile.name}</h1>
          <p className="text-accent">{profile.headline}</p>
          <p className="flex items-center gap-2 text-sm">
            <FaMapMarkerAlt aria-hidden="true" className="text-secondary" />
            {profile.location}
          </p>
          <p className="max-w-md text-[15px] leading-7 text-secondary">{profile.summary}</p>
        </div>
        <div className="space-y-4">
          <p className="flex items-center gap-2 text-sm text-primary">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-green-500" />
            {profile.status}
          </p>
          <VisitorCount />
        </div>
      </div>

      <div className="flex w-56 shrink-0 flex-col items-end justify-between">
        <img
          src={asset('cyril.jpg')}
          alt="Cyril Jacob"
          width={144}
          height={144}
          className="avatar h-36 w-36 rounded-full border-4 border-surface object-cover"
        />
        <div className="flex flex-col items-end gap-2">
          <a href={asset('Cyril_Jacob_Resume.pdf')} download="Cyril_Jacob_Resume.pdf" className={pillDark}>
            <FaDownload aria-hidden="true" /> Resume
          </a>
          <a href={`mailto:${profile.email}`} className={pillLight}>
            <FaEnvelope aria-hidden="true" /> Email me
          </a>
          <div className="flex gap-2">
            {[
              { href: profile.links.github, label: 'GitHub', icon: <FaGithub /> },
              { href: profile.links.linkedin, label: 'LinkedIn', icon: <FaLinkedin /> },
              { href: profile.links.medium, label: 'Medium', icon: <FaMedium /> },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                aria-label={l.label}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-raised transition-colors hover:bg-primary/5"
              >
                {l.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </ScenePanel>
);

const COMPACT = '(max-width: 1023px)';
const subscribeCompact = (cb: () => void) => {
  const m = window.matchMedia(COMPACT);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const isCompact = () => window.matchMedia(COMPACT).matches;

/** Phone layout: a 460 x 272 screen, so the same lid shows type large enough to read. */
const LidHeroCompact = () => (
  <ScenePanel shot={1} id="top">
    <div className="flex h-full flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--a-accent)]">Unboxing</p>
          <h1 className="mt-1 text-[28px] font-normal leading-none tracking-[-0.04em]">{profile.name}</h1>
          <p className="mt-1.5 text-[12px] leading-snug text-accent">{profile.headline}</p>
        </div>
        <img
          src={asset('cyril.jpg')}
          alt="Cyril Jacob"
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full border-2 border-surface object-cover"
        />
      </div>
      <p className="text-[12px] leading-[1.45] text-secondary">{profile.summary.split('. ')[0]}.</p>
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11px] text-primary">
          <FaMapMarkerAlt aria-hidden="true" className="text-secondary" />
          {profile.location}
        </p>
        <div className="flex items-center gap-1.5">
          <a href={asset('Cyril_Jacob_Resume.pdf')} download="Cyril_Jacob_Resume.pdf" className="inline-flex h-8 items-center gap-1.5 rounded-full border border-primary bg-primary px-3 text-[11px] text-surface">
            <FaDownload aria-hidden="true" /> Resume
          </a>
          {[
            { href: profile.links.github, label: 'GitHub', icon: <FaGithub /> },
            { href: profile.links.linkedin, label: 'LinkedIn', icon: <FaLinkedin /> },
            { href: `mailto:${profile.email}`, label: 'Email', icon: <FaEnvelope /> },
          ].map((l) => (
            <a key={l.label} href={l.href} aria-label={l.label} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/15 bg-raised text-[12px]">
              {l.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  </ScenePanel>
);

const LidHero = () => {
  const compact = useSyncExternalStore(subscribeCompact, isCompact);
  return compact ? <LidHeroCompact /> : <LidHeroWide />;
};

export default LidHero;
