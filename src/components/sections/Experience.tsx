import { experience } from '../../data/portfolio';
import Section from '../ui/Section';

const Experience = () => (
  <Section id="experience" eyebrow="Professional timeline" title="Experience">
    <div className="flex flex-col">
      {experience.map((job) => (
        <div
          key={job.role}
          className="flex flex-col gap-5 border-b border-dashed border-primary/10 py-8 first:pt-0 last:border-b-0 last:pb-0"
        >
          <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:gap-6">
            <div>
              <h3 className="text-lg font-medium">{job.role}</h3>
              <p className="mt-1 text-sm text-secondary">
                {job.company} · {job.location}
              </p>
            </div>
            <p className="h-fit w-fit rounded-lg border border-primary/10 px-3 py-1.5 text-sm">{job.period}</p>
          </div>
          <ul className="space-y-2">
            {job.points.map((p) => (
              <li key={p} className="flex items-start gap-2 leading-7 text-secondary">
                <span aria-hidden="true">•</span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Section>
);

export default Experience;
