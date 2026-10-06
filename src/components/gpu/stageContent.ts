import { AUTOPILOT_URL } from '../anatomy/stages';
import { articles, certifications, education, experience, featuredProjects, profile, projects, publications, recognition, skills } from '../../data/portfolio';

/* The short form. Each stage says one thing in a headline and hangs two to four callouts on parts of the card.
   Everything is derived from the portfolio data; the long form (every bullet, the benchmark table, the live demo)
   opens in the datasheet. Anchors are card-local coordinates. */

export interface Callout {
  anchor: [number, number, number];
  title: string;
  text?: string;
  stats?: { value: string; label: string }[];
  link?: { href: string; label: string };
  photo?: { src: string; alt: string };
}

export type SheetKey = 'about' | 'featured' | 'experience' | 'projects' | 'demo' | 'skills' | 'education' | 'recognition' | 'writing';

export interface StageContent {
  shot: number;
  sheet: SheetKey;
  headline: string;
  lede: string;
  callouts: Callout[];
}

const firstSentence = (s: string) => s.split('. ')[0].replace(/\.$/, '') + '.';
const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

const [sat, thermal] = featuredProjects;
const [intern, intel, cv, ethic] = experience;
const group = (name: string) => skills.find((g) => g.group.startsWith(name))!;

export const stageContent: StageContent[] = [
  {
    shot: 2,
    sheet: 'about',
    headline: 'I build the systems around the model.',
    lede: 'CSE (AI & ML) student, graduating 2027. Backend, cloud and DevOps, backed by computer vision.',
    callouts: [
      { anchor: [-0.97, 0.5, 0], title: 'Backend & distributed', text: 'Microservices, MQTT, Kafka, PostgreSQL.' },
      { anchor: [0, 0.5, 0], title: 'Cloud & DevOps', text: 'Azure, Docker, CI/CD pipelines, Kubernetes.' },
      { anchor: [0.97, 0.5, 0], title: 'AI/ML & vision', text: 'PyTorch, TensorRT, DeepStream, ONNX.' },
    ],
  },
  {
    shot: 3,
    sheet: 'featured',
    headline: 'Two ISRO projects, built to be measured.',
    lede: 'Satellite super-resolution with teammates, scored against real baselines.',
    callouts: [
      {
        anchor: [-0.65, 0.33, 0.1],
        title: 'Satellite super-resolution',
        text: '4th nationally at the Bharatiya Antariksh Hackathon 2025, from 8,744 teams.',
        stats: [sat.stats[0], sat.stats[1]],
        link: { href: asset(sat.link!.href), label: sat.link!.label },
      },
      {
        anchor: [0.7, 0.33, -0.1],
        title: 'Thermal super-resolution',
        text: 'Smart India Hackathon 2025, Grand Finale top 5.',
        stats: [thermal.stats[0], thermal.stats[2]],
      },
    ],
  },
  {
    shot: 4,
    sheet: 'experience',
    headline: 'Where the work actually runs.',
    lede: 'From Flutter apps to GPU inference: work that made systems faster, repeatable and shippable.',
    callouts: [
      {
        anchor: [0.2, 0.07, -0.2],
        title: intern.role,
        text: `${intern.company}, ${intern.period}.`,
        stats: [{ value: '70%', label: 'faster deployments from automated provisioning' }],
      },
      {
        anchor: [0.62, 0.07, -0.05],
        title: intel.role,
        text: `${intel.company}, ${intel.period}. Search by text or image over one shared embedding space.`,
      },
      {
        anchor: [0.1, 0.07, 0.3],
        title: ethic.role,
        text: `${ethic.company}, ${ethic.period}. Flutter apps for Android and iOS, built in teams.`,
      },
      {
        anchor: [0.48, 0.07, 0.2],
        title: cv.role,
        text: `${cv.company}, ${cv.period}.`,
        stats: [
          { value: '+40%', label: 'streaming throughput (15 to 21 FPS)' },
          { value: '-60%', label: 'latency with TensorRT INT8' },
        ],
      },
    ],
  },
  {
    shot: 5,
    sheet: 'projects',
    headline: 'Systems that move data.',
    lede: 'Telemetry, streams and fleets, built on queues and databases.',
    callouts: projects.slice(0, 3).map((p, i) => ({
      anchor: ([[-0.2, 0.05, -0.42], [0.9, 0.05, 0.14], [0.9, 0.05, -0.14]][i]) as [number, number, number],
      title: p.title,
      text: firstSentence(p.summary),
      ...(p.href ? { link: { href: p.href, label: 'View on GitHub' } } : {}),
    })),
  },
  {
    shot: 6,
    sheet: 'demo',
    headline: 'Run inference, right here.',
    lede: 'Object detection in your browser. Switch FP32 and INT8 and watch latency on your own device.',
    callouts: [{ anchor: [0.35, 0.08, 0], title: 'YOLOv8 in a browser tab', text: 'ONNX Runtime on WASM or WebGPU. Nothing leaves your machine.' }],
  },
  {
    shot: 7,
    sheet: 'skills',
    headline: 'The toolbox, clean power in.',
    lede: 'What I reach for, grouped the way I use it.',
    callouts: [
      ['Programming', -0.42],
      ['Backend', -0.14],
      ['Databases', 0.14],
      ['Cloud', 0.42],
    ].map(([name, z]) => {
      const g = group(name as string);
      return {
        anchor: [-1.1, 0.09, z as number] as [number, number, number],
        title: g.group,
        text: g.items.slice(0, 5).join(' · '),
      };
    }),
  },
  {
    shot: 8,
    sheet: 'education',
    headline: 'The link to everything else.',
    lede: 'Education, one accepted paper, and the certifications that back the work.',
    callouts: [
      { anchor: [-0.55, -0.02, 0.64], title: education.degree, text: `${education.school}, ${education.period}. CGPA 7.75 / 10.` },
      { anchor: [-0.15, -0.02, 0.64], title: publications[0].venue, text: `${publications[0].status}: ${publications[0].title}` },
      { anchor: [0.2, -0.02, 0.64], title: 'Certifications', text: `Azure Fundamentals, Intel Unnati, MongoDB, SnowPro Associate, NVIDIA Jetson, and ${certifications.length - 5} more.` },
    ],
  },
  {
    shot: 9,
    sheet: 'recognition',
    headline: 'Everything, working as one.',
    lede: 'Hackathons and community, the parts that were not on a résumé line.',
    callouts: recognition.slice(0, 5).map((r, i) => ({
      anchor: [[-0.97, 0.5, 0], [-0.5, 0.5, 0.3], [0, 0.5, -0.3], [0.5, 0.5, 0.3], [0.97, 0.5, 0]][i] as [number, number, number],
      title: r.result,
      text: r.period ? `${r.title}, ${r.period}.` : `${r.title}.`,
      ...(r.photos ? { photo: r.photos[1] } : {}),
    })),
  },
  {
    shot: 10,
    sheet: 'writing',
    headline: 'One card becomes a fleet.',
    lede: 'I write about what I deploy, and I am building the control loop that keeps a fleet healthy.',
    callouts: [
      ...articles.map((a, i) => ({
        anchor: [[-0.6, 0.5, 0.3], [0.6, 0.5, -0.3]][i] as [number, number, number],
        title: a.title,
        text: a.summary,
        link: { href: a.href, label: 'Read on Medium' },
      })),
      {
        anchor: [0, 0.5, 0],
        title: 'Inference Autopilot',
        text: 'Monitors an inference stack, finds what went wrong, suggests a fix, then checks it worked. Open source.',
        link: { href: AUTOPILOT_URL, label: 'View on GitHub' },
      },
      {
        anchor: [1.2, 0.1, -0.5],
        title: 'Say hello',
        text: profile.email,
        link: { href: `mailto:${profile.email}`, label: 'Email me' },
      },
    ],
  },
];
