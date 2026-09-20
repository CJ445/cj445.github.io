import { FaExternalLinkAlt } from 'react-icons/fa';
import { articles } from '../../data/portfolio';
import Section from '../ui/Section';

const Writing = () => (
  <Section id="writing" eyebrow="On Medium" title="Writing">
    <div className="grid gap-6 md:grid-cols-2">
      {articles.map((a) => (
        <a
          key={a.href}
          href={a.href}
          target="_blank"
          rel="noreferrer"
          className="group flex flex-col rounded-[1.75rem] border border-primary/10 bg-white p-5 shadow-sm transition-colors hover:bg-primary/[0.02] sm:p-6"
        >
          <h3 className="flex items-start justify-between gap-3 text-lg leading-tight">
            {a.title}
            <FaExternalLinkAlt aria-hidden="true" className="mt-1.5 shrink-0 text-xs text-secondary group-hover:text-primary" />
          </h3>
          <p className="mt-3 leading-7 text-secondary">{a.summary}</p>
        </a>
      ))}
    </div>
  </Section>
);

export default Writing;
