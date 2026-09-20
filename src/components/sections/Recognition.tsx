import { recognition } from '../../data/portfolio';
import Section from '../ui/Section';

const Recognition = () => (
  <Section id="recognition" tint eyebrow="Hackathons & leadership" title="Recognition">
    <ul className="flex flex-col">
      {recognition.map((r) => (
        <li
          key={r.title}
          className="grid gap-2 border-b border-dashed border-primary/10 py-6 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_auto] md:gap-6"
        >
          <div>
            <h3 className="font-medium">{r.title}</h3>
            <p className="mt-1 text-sm text-accent">{r.result}</p>
            <p className="mt-2 leading-7 text-secondary">{r.detail}</p>
          </div>
          <p className="h-fit w-fit rounded-lg border border-primary/10 px-3 py-1.5 text-sm">{r.period}</p>
        </li>
      ))}
    </ul>
  </Section>
);

export default Recognition;
