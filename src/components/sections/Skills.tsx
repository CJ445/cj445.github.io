import { skills } from '../../data/portfolio';
import Section from '../ui/Section';
import { TagList } from '../ui/Tag';

const Skills = () => (
  <Section id="skills" tint eyebrow="Toolbox" title="Skills">
    <dl className="flex flex-col">
      {skills.map((g) => (
        <div
          key={g.group}
          className="grid gap-3 border-b border-dashed border-primary/10 py-6 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-6"
        >
          <dt className="text-sm font-medium">{g.group}</dt>
          <dd>
            <TagList tags={g.items} />
          </dd>
        </div>
      ))}
    </dl>
  </Section>
);

export default Skills;
