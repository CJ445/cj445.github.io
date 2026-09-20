import { FaDownload, FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaMedium } from 'react-icons/fa';
import { profile } from '../../data/portfolio';
import ThemeToggle from '../ui/ThemeToggle';
import VisitorCount from '../ui/VisitorCount';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const pillBase = 'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors';
const pillLight = `${pillBase} border-primary/10 bg-raised text-primary hover:bg-primary/5`;
const pillDark = `${pillBase} border-primary bg-primary text-surface hover:bg-primary/90`;

const Hero = () => (
  <header>
    <div className="mx-auto w-full max-w-[70.9rem]">
      <div className="hero-banner relative h-44 overflow-hidden rounded-b-[2rem] sm:h-56">
        <div aria-hidden="true" className="hero-glow" />
        <div aria-hidden="true" className="grid-overlay" />
        <div className="relative mx-auto flex max-w-3xl justify-end px-3 pt-3 sm:px-5">
          <ThemeToggle />
        </div>
      </div>

      <div className="border-x border-primary/10 bg-surface">
        <div className="relative mx-auto max-w-3xl px-5 pb-10 pt-20 sm:px-7 sm:pt-24">
          <div className="absolute -top-14 left-5 sm:-top-16 sm:left-7">
            <img
              src={asset('cyril.jpg')}
              alt="Cyril Jacob"
              width={144}
              height={144}
              className="avatar h-28 w-28 rounded-full border-4 border-surface object-cover shadow-sm sm:h-36 sm:w-36"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-2xl font-normal md:text-3xl">{profile.name}</h1>
                <p className="text-accent">{profile.headline}</p>
              </div>
              <p className="flex items-center gap-2 text-sm">
                <FaMapMarkerAlt aria-hidden="true" className="text-secondary" />
                {profile.location}
              </p>
              <p className="max-w-2xl leading-7 text-secondary">{profile.summary}</p>
              <p className="flex items-center gap-2 text-sm text-primary">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-green-500" />
                {profile.status}
              </p>
            </div>

            <div className="flex flex-wrap items-start gap-2 md:flex-col md:items-end">
              <a href={asset('Cyril_Jacob_Resume.pdf')} download="Cyril_Jacob_Resume.pdf" className={pillDark}>
                <FaDownload aria-hidden="true" /> Resume
              </a>
              <a href={`mailto:${profile.email}`} className={pillLight}>
                <FaEnvelope aria-hidden="true" /> {profile.email}
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

          <VisitorCount className="mt-6" />
        </div>
      </div>
    </div>
  </header>
);

export default Hero;
