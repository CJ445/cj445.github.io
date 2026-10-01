import {
  about,
  articles,
  benchmark,
  certifications,
  education,
  experience,
  featuredProjects,
  profile,
  projects,
  publications,
  recognition,
  skills,
} from './portfolio.ts';

export const SITE_URL = 'https://cj445.github.io';

const abs = (path: string) => `${SITE_URL}/${path.replace(/^\//, '')}`;

/**
 * The whole portfolio as one markdown document, generated from the same data the UI renders.
 * Used by Agent Mode on the page, by the static /agent.md file, and by the no-JS fallback in index.html.
 */
export const buildAgentMarkdown = (): string => {
  const lines: string[] = [];
  const add = (...l: string[]) => lines.push(...l);

  add(
    `# ${profile.name}`,
    '',
    `> ${profile.headline}`,
    '',
    `- Location: ${profile.location}`,
    `- Status: ${profile.status}`,
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.links.github}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    `- Medium: ${profile.links.medium}`,
    `- Resume (PDF): ${abs('Cyril_Jacob_Resume.pdf')}`,
    `- Site: ${SITE_URL}/`,
    '',
    '## Summary',
    '',
    profile.summary,
    '',
    ...about.flatMap((p) => [p, '']),
  );

  add('## Featured work', '');
  for (const p of featuredProjects) {
    add(`### ${p.title}`, '', `*${p.eyebrow}*`, '', p.summary, '');
    add(...p.stats.map((s) => `- **${s.value}**: ${s.label}`));
    if (p.statsNote) add('', `Note: ${p.statsNote}`);
    add('', ...p.points.map((pt) => `- ${pt}`), '', `Tech: ${p.tags.join(', ')}`);
    if (p.link) add(`Case study: ${abs(p.link.href)}`);
    add('');
  }

  add(
    '#### Benchmark: ISRO dual-image super-resolution',
    '',
    '| Model | PSNR (dB) | SSIM | Note |',
    '| --- | --- | --- | --- |',
    ...benchmark.map((b) => `| ${b.ours ? `**${b.model}**` : b.model} | ${b.psnr} | ${b.ssim} | ${b.note} |`),
    '',
  );

  add('## Experience', '');
  for (const r of experience) {
    add(`### ${r.role}, ${r.company}`, '', `${r.period} · ${r.location}`, '', ...r.points.map((pt) => `- ${pt}`), '');
  }

  add('## Projects', '');
  for (const p of projects) {
    add(`### ${p.title}`, '', `${p.period}`, '', p.summary, '', `Tech: ${p.tags.join(', ')}`);
    if (p.href) add(`Source: ${p.href}`);
    add('');
  }

  add(
    '## Live demo',
    '',
    'Inference Monitor: YOLOv8n object detection running FP32 vs INT8 on ONNX Runtime Web, entirely in the visitor\'s browser. Camera frames are never uploaded.',
    `Open it on the main page: ${SITE_URL}/#demo`,
    '',
  );

  add('## Skills', '', ...skills.map((s) => `- **${s.group}**: ${s.items.join(', ')}`), '');

  add(
    '## Education',
    '',
    `${education.degree}, ${education.school} (${education.period})`,
    '',
    education.detail,
    '',
  );

  add(
    '## Publications',
    '',
    ...publications.map((p) => `- ${p.title}. ${p.venue} (${p.status})`),
    '',
    '## Certifications',
    '',
    ...certifications.map((c) => `- ${c}`),
    '',
  );

  add('## Recognition', '', ...recognition.map((r) => `- **${r.title}**, ${r.result} (${r.period}). ${r.detail}`), '');

  add('## Writing', '', ...articles.map((a) => `- [${a.title}](${a.href}): ${a.summary}`), '');

  return `${lines.join('\n').trimEnd()}\n`;
};
