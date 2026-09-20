import { about } from '../../data/portfolio';
import Section from '../ui/Section';

const About = () => (
  <Section id="about" eyebrow="Introduction" title="About">
    <div className="max-w-2xl space-y-4">
      {about.map((p) => (
        <p key={p} className="leading-7 text-secondary">
          {p}
        </p>
      ))}
    </div>
  </Section>
);

export default About;
