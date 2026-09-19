import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

interface ProjectCardProps {
  title: string;
  tools: string[];
  description: string[];
  /** Repo or demo URL. Leave undefined until it exists; the card shows "Link soon". */
  link?: string;
  color: string;
  tag: string;
}

const ProjectCard = ({ title, tools, description, link, color, tag }: ProjectCardProps) => (
  <div className={`bg-white border-4 border-black rounded-3xl  p-6 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all relative overflow-hidden`}>
    
    <div className={`absolute top-0 left-0 right-0 h-4 ${color} border-b-4 border-black`}></div>
    
    <div className="mt-4 flex justify-between items-start mb-4">
        <div>
            <h3 className="text-2xl font-shrikhand">{title}</h3>
            <span className="inline-block mt-2 bg-white text-black text-xs font-bold font-mono px-2 py-1 border border-black rounded-md">
                {tag}
            </span>
        </div>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" aria-label={`${title}: view project`} className="bg-black text-white w-11 h-11 flex items-center justify-center flex-shrink-0 rounded-lg hover:bg-gray-800 transition-colors">
              <FaExternalLinkAlt />
          </a>
        ) : (
          <span className="flex-shrink-0 self-start bg-gray-100 text-black text-xs font-bold font-mono px-2 py-1 border-2 border-dashed border-black rounded-md">
              LINK SOON
          </span>
        )}
    </div>

    <div className="flex flex-wrap gap-2 mb-4">
        {tools.map((t) => (
            <span key={t} className="bg-gray-100 border border-black px-2 py-1 text-xs font-bold font-mono rounded-md">
                {t}
            </span>
        ))}
    </div>

    <ul className="list-disc list-inside space-y-2 text-sm font-medium border-t-2 border-black pt-4">
        {description.map((point, i) => (
            <li key={i}>{point}</li>
        ))}
    </ul>
  </div>
);

const Projects = () => {
    const projects = [
      {
        title: "Optical-Guided Thermal Super-Resolution",
        tag: "SIH 2025 FINALIST · ISRO",
        color: "bg-custom-purple",
        tools: ["Python", "PyTorch", "Computer Vision", "Physics-Guided ML"],
        // link: "https://github.com/cj445/<repo>",  // TODO: add project link
        description: [
          "Developed a physics-guided, self-supervised framework for 2x-4x thermal super-resolution using gated optical-thermal fusion, MTF-based synthetic degradation, and residual reconstruction.",
          "Applied a Planck/radiance-domain physics constraint; evaluated SSIM, PSNR, and RMSE while mitigating optical texture and hallucination artifacts.",
          "Smart India Hackathon 2025 Finalist - ISRO Track."
        ]
      },
      {
        title: "IoT Fleet Management Platform",
        tag: "OCT – NOV 2025",
        color: "bg-custom-blue",
        tools: ["Docker", "PostgreSQL", "MongoDB", "Redis", "MQTT", "REST APIs"],
        // link: "https://github.com/cj445/<repo>",  // TODO: add project link
        description: [
          "Designed a distributed edge orchestration platform for 100+ Raspberry Pi nodes using containerized microservices, PostgreSQL, MongoDB, and Redis.",
          "Implemented OTA updates with rollback, real-time telemetry, and remote commands through MQTT and REST APIs.",
          "Monitored device health, network status, and system metrics across the fleet."
        ]
      },
      {
        title: "Real-Time Occupancy Analytics System",
        tag: "SEP – DEC 2024",
        color: "bg-custom-red",
        tools: ["Kafka", "PostgreSQL", "Docker", "Grafana"],
        // link: "https://github.com/cj445/<repo>",  // TODO: add project link
        description: [
          "Built a real-time system for live campus CCTV streams using Kafka, PostgreSQL, and Docker.",
          "Designed Grafana dashboards for floor-wise occupancy insights.",
          "Processed continuous streaming data for live analytics."
        ]
      }
    ];

  return (
    <section id="projects" className="py-10 px-4 mx-auto max-w-7xl  bg-custom-yellow border-2 border-b-4 border-r-4 border-black rounded-3xl shadow-neo">
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-custom-green px-8 py-3 rounded-full border-4 border-black shadow-neo">
            <h2 className="text-3xl font-shrikhand text-black">PROJECTS</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p, i) => (
            <ProjectCard key={i} {...p} />
        ))}
      </div>
    </section>
  );
};

export default Projects;