import { FaArrowRight } from 'react-icons/fa';
import { benchmark, featuredProjects } from '../../data/portfolio';
import type { FeaturedProject } from '../../data/portfolio';
import Section from '../ui/Section';
import { TagList } from '../ui/Tag';

const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const BenchmarkTable = () => (
  <div className="mt-6">
    <p className="mb-3 text-xs uppercase tracking-[2px] text-primary/60">Benchmark: PSNR and SSIM</p>
    <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-raised">
      <table className="w-full min-w-[30rem] text-left text-sm">
        <thead>
          <tr className="border-b border-primary/10 text-xs text-secondary">
            <th scope="col" className="px-4 py-3 font-medium">Model</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">PSNR (dB)</th>
            <th scope="col" className="px-4 py-3 text-right font-medium">SSIM</th>
            <th scope="col" className="px-4 py-3 font-medium">Notes</th>
          </tr>
        </thead>
        <tbody>
          {benchmark.map((row) => (
            <tr
              key={row.model}
              className={`border-b border-dashed border-primary/10 last:border-b-0 ${row.ours ? 'bg-accent/10 font-medium' : ''}`}
            >
              <th scope="row" className="px-4 py-3 font-normal">{row.model}</th>
              <td className="px-4 py-3 text-right tabular-nums">{row.psnr}</td>
              <td className="px-4 py-3 text-right tabular-nums">{row.ssim}</td>
              <td className="px-4 py-3 text-secondary">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="mt-2 text-xs text-secondary">Comparison from the team's benchmarking.</p>
  </div>
);

const ProjectCard = ({ project }: { project: FeaturedProject }) => (
  <article className="rounded-[1.75rem] border border-primary/10 bg-raised p-5 shadow-sm sm:p-6">
    <p className="text-xs uppercase tracking-[2px] text-primary/60">{project.eyebrow}</p>
    <h3 className="mt-3 text-xl leading-tight">{project.title}</h3>
    <p className="mt-4 leading-7 text-secondary">{project.summary}</p>

    <figure className="mt-6">
      <img
        src={asset(project.image.src)}
        alt={project.image.alt}
        loading="lazy"
        className="dim-dark w-full rounded-2xl border border-primary/10"
      />
      <figcaption className="mt-2 text-xs text-secondary">{project.image.caption}</figcaption>
    </figure>

    <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {project.stats.map((s) => (
        <div key={s.label} className="flex flex-col rounded-2xl border border-primary/10 bg-primary/[0.03] px-4 py-3">
          <dt className="order-2 text-xs leading-5 text-secondary">{s.label}</dt>
          <dd className="text-2xl tabular-nums tracking-[-0.02em] text-primary">{s.value}</dd>
        </div>
      ))}
    </dl>
    {project.statsNote && <p className="mt-2 text-xs text-secondary">{project.statsNote}</p>}

    <ul className="mt-6 space-y-2">
      {project.points.map((p) => (
        <li key={p} className="flex items-start gap-2 leading-7 text-secondary">
          <span aria-hidden="true">•</span>
          {p}
        </li>
      ))}
    </ul>

    {project.id === 'satellite-sr' && <BenchmarkTable />}

    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-primary/10 pt-5">
      <TagList tags={project.tags} />
      {project.link && (
        <a
          href={asset(project.link.href)}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary/10 bg-raised px-4 py-2 text-sm hover:bg-primary/5"
        >
          {project.link.label} <FaArrowRight aria-hidden="true" className="text-xs" />
        </a>
      )}
    </div>
  </article>
);

const FeaturedWork = () => (
  <Section
    id="featured"
    tint
    eyebrow="Featured work"
    title="Super-resolution for ISRO"
    description="Two national-level hackathon projects on satellite imagery, built with teammates, with the results they produced."
  >
    <div className="flex flex-col gap-8">
      {featuredProjects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  </Section>
);

export default FeaturedWork;
