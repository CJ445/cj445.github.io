export const profile = {
  name: 'Cyril Jacob',
  headline: 'Software Engineer · Distributed Systems, Cloud & AI/ML',
  location: 'New Delhi, India',
  summary:
    'CSE (AI & ML) student at Karunya Institute of Technology & Sciences, graduating in 2027. I build backend and distributed systems, cloud infrastructure, and DevOps pipelines, backed by AI/ML and computer vision experience.',
  status: 'Open to software engineering and research opportunities',
  email: 'itscyriljacob@gmail.com',
  links: {
    github: 'https://github.com/cj445',
    linkedin: 'https://www.linkedin.com/in/thecyriljacob/',
    medium: 'https://medium.com/@thecyriljacob',
  },
};

export const about = [
  'At Graceful Management Systems I automated server provisioning and built CI/CD and containerized deployments on Azure. At Karunya Innovation and Design Studio I optimized computer vision models for NVIDIA hardware with TensorRT.',
  'Outside of work I compete in ISRO hackathons on satellite image super-resolution, and I am always keen to connect with people building scalable products or doing impactful AI research.',
];

export interface Stat {
  value: string;
  label: string;
}

export interface FeaturedProject {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  image: { src: string; alt: string; caption: string };
  stats: Stat[];
  statsNote?: string;
  points: string[];
  tags: string[];
  link?: { href: string; label: string };
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'satellite-sr',
    eyebrow: 'ISRO Bharatiya Antariksh Hackathon 2025 · 4th nationally',
    title: 'Dual Image Super-Resolution for Satellite Imagery',
    summary:
      'Fuses two low-resolution captures of the same scene into one 512×512 high-resolution image, and scores the result with a blind image-quality model. Built as Team HumbleOps for Problem Statement 12, among 61,000+ students across 8,744 teams.',
    image: {
      src: 'images/projects/satellite-sr.webp',
      alt: 'Three satellite image crops of the same street: the super-resolved output (SR), the high-resolution reference (HR) and the low-resolution input (LR).',
      caption: 'Super-resolved output (SR) against the high-resolution reference (HR) and the low-resolution input (LR).',
    },
    stats: [
      { value: '41.45 dB', label: 'PSNR on the official ISRO test set' },
      { value: '0.97', label: 'SSIM, above the 0.96 HighRes-Net baseline' },
      { value: '33', label: 'epochs, against 84 for our HighRes-Net track' },
    ],
    points: [
      'Two tracks were compared: a HighRes-Net tuned with 50 Optuna trials (40.5 dB, 0.96 SSIM) and an enhanced dual SwinIR (41.45 dB, 0.97 SSIM) trained with a composite MSE, SSIM, edge-gradient and perceptual loss.',
      'The SwinIR track matched state-of-the-art PSNR in a third of the epochs, and the composite loss is what lifted SSIM.',
      'A ViT + ResNet-50 blind quality regressor was trained on 17,344 image pairs across 1,084 scenes, because PSNR and SSIM alone can reward soft, blurry output.',
    ],
    tags: ['PyTorch', 'SwinIR', 'HighRes-Net', 'Optuna', 'ViT', 'ResNet-50', 'GeoTIFF'],
    link: { href: 'reports/satellite-sr/', label: 'Read the case study' },
  },
  {
    id: 'thermal-sr',
    eyebrow: 'Smart India Hackathon 2025 · ISRO track · Grand Finale top 5',
    title: 'Optical-Guided Thermal Super-Resolution',
    summary:
      'A self-supervised framework that upscales thermal satellite imagery 2× to 4× without any high-resolution ground truth. A gated fusion network borrows sharp structure from the optical bands, while a Planck-law radiance constraint stops it from inventing detail.',
    image: {
      src: 'images/projects/thermal-sr.webp',
      alt: 'Six-panel thermal super-resolution result for one scene: RGB composite, panchromatic band, low-resolution input, ground truth, 2× super-resolved output and the temperature error map.',
      caption: 'One test scene at 2×: inputs, ground truth, super-resolved output and the temperature error map.',
    },
    stats: [
      { value: '48.61 dB', label: 'PSNR' },
      { value: '0.9945', label: 'SSIM' },
      { value: '0.26 K', label: 'RMSE' },
    ],
    statsNote: 'Metrics are for the single scene shown (2× upscale), not an average over the test set.',
    points: [
      'Trained with MTF-based synthetic degradation and residual reconstruction, so no high-resolution thermal reference is needed.',
      'The Planck/radiance-domain constraint limits optical texture leaking into the thermal output. Evaluated on SSIM, PSNR and RMSE in kelvin.',
      'Quantized and deployed on an NVIDIA Jetson. The accompanying paper is accepted at IEEE ICECA 2026.',
    ],
    tags: ['PyTorch', 'ResUNet', 'FiLM fusion', 'RasterIO', 'Landsat 8', 'NVIDIA Jetson'],
  },
];

export interface BenchmarkRow {
  model: string;
  psnr: string;
  ssim: string;
  note: string;
  ours?: boolean;
}

export const benchmark: BenchmarkRow[] = [
  { model: 'CrossSensor SISR', psnr: '12.30', ssim: '0.45', note: 'Failed on domain mismatch' },
  { model: 'TR-MISR', psnr: '32.00', ssim: '0.40', note: 'Poor SSIM on this data' },
  { model: 'MAT-light ×2', psnr: '33.50', ssim: '0.91', note: 'Accuracy limited' },
  { model: 'SPOT6 interpolated SISR', psnr: '35.39', ssim: '0.88', note: 'Single-image baseline' },
  { model: 'ESC-MISR', psnr: '39.00', ssim: '0.84', note: 'Strong multi-image model' },
  { model: 'HighRes-Net (original)', psnr: '41.50', ssim: '0.96', note: 'State-of-the-art baseline' },
  { model: 'Enhanced dual SwinIR', psnr: '41.45', ssim: '0.97', note: 'Our submission', ours: true },
];

export interface Role {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

export const experience: Role[] = [
  {
    role: 'Software Engineering Intern',
    company: 'Graceful Management Systems',
    location: 'Remote',
    period: 'Jan 2025 – Dec 2025',
    points: [
      'Automated Ubuntu server provisioning with Netplan and shell scripting, cutting deployment time by 70%.',
      'Built delivery workflows in Azure DevOps: Azure Repos, self-hosted Ubuntu agents, automated testing, CI/CD pipelines, and containerized deployments through Azure Container Registry.',
      'Deployed containerized microservices to Azure and designed the database schemas and data preparation pipelines for a RAG application.',
      'Managed Ubuntu servers, VMs, permissions, secure SSH access, and dual-interface static IP routing across multi-server networks.',
    ],
  },
  {
    role: 'Computer Vision Engineer (Trainee)',
    company: 'Karunya Innovation and Design Studio',
    location: 'Coimbatore, India',
    period: 'Jul 2024 – Dec 2024',
    points: [
      'Deployed real-time CCTV analytics with NVIDIA DeepStream SDK, raising streaming throughput 40% (15 to 21 FPS).',
      'Optimized YOLOv8 and Mask R-CNN with TensorRT INT8 quantization, reducing latency by 60%.',
      'Managed Git/GitHub collaboration across a multi-member team building practical computer vision systems.',
    ],
  },
];

export interface Project {
  title: string;
  period: string;
  summary: string;
  tags: string[];
  href?: string;
}

export const projects: Project[] = [
  {
    title: 'IoT Fleet Management Platform',
    period: 'Oct – Nov 2025',
    summary:
      'Distributed edge orchestration for 100+ Raspberry Pi nodes using containerized microservices, PostgreSQL, MongoDB and Redis. OTA updates with rollback, real-time telemetry, and remote commands over MQTT and REST.',
    tags: ['Docker', 'PostgreSQL', 'MongoDB', 'Redis', 'MQTT'],
    href: 'https://github.com/cj445/IoT-Fleet-Management',
  },
  {
    title: 'Real-Time Occupancy Analytics',
    period: 'Sep – Dec 2024',
    summary:
      'Live campus CCTV streams processed through Kafka into PostgreSQL, with Grafana dashboards for floor-wise occupancy insights.',
    tags: ['Kafka', 'PostgreSQL', 'Docker', 'Grafana'],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Programming', items: ['Python', 'SQL', 'Shell Scripting'] },
  {
    group: 'Backend & software engineering',
    items: ['REST APIs', 'Microservices', 'CI/CD', 'Git', 'GitHub', 'RAG schema design'],
  },
  {
    group: 'Databases & distributed systems',
    items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Apache Kafka', 'MQTT', 'ChromaDB', 'HNSW indexing'],
  },
  {
    group: 'Cloud & infrastructure',
    items: [
      'Azure',
      'Azure DevOps',
      'Azure Container Registry',
      'Docker',
      'Kubernetes',
      'Linux',
      'Ubuntu',
      'Netplan',
      'Networking',
      'SSH',
      'Grafana',
    ],
  },
  {
    group: 'AI/ML & computer vision',
    items: [
      'PyTorch',
      'TensorFlow',
      'Keras',
      'scikit-learn',
      'OpenCV',
      'ONNX',
      'TensorRT',
      'NVIDIA DeepStream',
      'YOLOv8',
      'Mask R-CNN',
      'CLIP',
      'RasterIO',
    ],
  },
];

export const education = {
  degree: 'B.Tech, Computer Science Engineering (AI & ML)',
  school: 'Karunya Institute of Technology & Sciences',
  period: '2023 – 2027',
  detail: 'CGPA 7.75 / 10. Focus: distributed systems, cloud & infrastructure, AI/ML.',
};

export const publications = [
  {
    title: 'Physics-Guided Residual Super-Resolution for Thermal Infrared Satellite Imagery',
    venue: 'IEEE ICECA 2026',
    status: 'Accepted',
  },
  {
    title: 'Smart Security Management using IoT and HC-05 Bluetooth Module',
    venue: 'IEEE',
    status: '2024',
  },
];

export const certifications = [
  'Microsoft Certified: Azure Fundamentals',
  'SnowPro Associate: Platform Certification',
  'NVIDIA Deep Learning and AI on Jetson Nano',
  'Duke University: RAG',
  'University of London: Machine Learning for All',
  'Scaler: PyTorch',
  'OpenCV Bootcamp',
];

export const recognition = [
  {
    title: 'Bharatiya Antariksh Hackathon 2025 (ISRO)',
    result: '4th place nationally',
    detail: 'Team Lead. Satellite image super-resolution among 61,000+ students across 8,744 teams.',
    period: '2025',
  },
  {
    title: 'Smart India Hackathon 2025 (ISRO track)',
    result: 'Grand Finale, top 5',
    detail: 'Quantized and deployed the thermal super-resolution model on NVIDIA Jetson.',
    period: '2025',
  },
  {
    title: 'Google Developer Groups On Campus, Karunya',
    result: 'Campus Lead',
    detail: 'Led a 25-member student engineering community and organized workshops, developer events, and a state-level hackathon.',
    period: '2024 – 2025',
  },
];

export const articles = [
  {
    title: 'How to Run RT-DETR in DeepStream',
    summary: "Deploying RT-DETR object detection inside NVIDIA's DeepStream SDK for real-time inference pipelines.",
    href: 'https://medium.com/@thecyriljacob/how-to-run-rt-detr-in-deepstream-c3e32940e71d',
  },
  {
    title: 'What Is Buildspace, Anyway?',
    summary: 'What it means to build projects in public alongside a community of makers.',
    href: 'https://medium.com/@thecyriljacob/what-is-buildspace-anyway-78c825742cf4',
  },
];
