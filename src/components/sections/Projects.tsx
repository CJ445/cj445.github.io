import { FaGithub } from 'react-icons/fa';
import { projects } from '../../data/portfolio';
import Section from '../ui/Section';
import { TagList } from '../ui/Tag';

const Projects = () => (
  <Section id="projects" tint eyebrow="Systems" title="More projects">
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((p) => (
        <article key={p.title} className="flex flex-col rounded-[1.75rem] border border-primary/10 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs uppercase tracking-[2px] text-primary/60">{p.period}</p>
          <h3 className="mt-3 text-lg leading-tight">{p.title}</h3>
          <p className="mt-3 flex-1 leading-7 text-secondary">{p.summary}</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <TagList tags={p.tags} />
            {p.href && (
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${p.title} on GitHub`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-white hover:bg-primary/5"
              >
                <FaGithub />
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  </Section>
);

export default Projects;
