import { certifications, education, publications } from '../../data/portfolio';
import Section from '../ui/Section';
import { TagList } from '../ui/Tag';

const Education = () => (
  <Section id="education" eyebrow="Background" title="Education & publications">
    <div className="flex flex-col gap-10">
      <div className="rounded-[1.75rem] border border-primary/10 bg-raised p-5 shadow-sm sm:p-6">
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:gap-6">
          <div>
            <h3 className="text-lg font-medium">{education.degree}</h3>
            <p className="mt-1 text-sm text-secondary">{education.school}</p>
          </div>
          <p className="h-fit w-fit rounded-lg border border-primary/10 px-3 py-1.5 text-sm">{education.period}</p>
        </div>
        <p className="mt-4 leading-7 text-secondary">{education.detail}</p>
      </div>

      <div>
        <h3 className="mb-4 text-xs font-normal uppercase tracking-[2px] text-primary/60">Publications</h3>
        <ul className="flex flex-col">
          {publications.map((p) => (
            <li
              key={p.title}
              className="flex flex-col gap-1 border-b border-dashed border-primary/10 py-4 first:pt-0 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span>{p.title}</span>
              <span className="shrink-0 text-sm text-secondary">
                {p.venue} · {p.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-xs font-normal uppercase tracking-[2px] text-primary/60">Certifications</h3>
        <TagList tags={certifications} />
      </div>
    </div>
  </Section>
);

export default Education;
