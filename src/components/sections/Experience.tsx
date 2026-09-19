import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

interface ExperienceProps {
  role: string;
  company: string;
  duration: string;
  location: string;
  description: string;
  color: string;
}

const Experience = () => {
  const experiences = [
    {
      role: "Software Engineering Intern",
      company: "Graceful Management Systems",
      duration: "Jan 2025 - Dec 2025",
      location: "Remote",
      description: "Automated Ubuntu server provisioning with Netplan and shell scripting, reducing deployment time by 70%. Built software delivery workflows in Azure DevOps using Azure Repos, self-hosted Ubuntu agents, automated testing, CI/CD pipelines, and containerized deployments through Azure Container Registry. Deployed containerized microservices to Azure Cloud and designed database schemas and data preparation pipelines for a RAG application. Managed Ubuntu servers, VMs, permissions, secure SSH access, and dual-interface static IP routing in multi-server network environments.",
      color: "bg-custom-pink"
    },
    {
      role: "Computer Vision Engineer (Trainee)",
      company: "Karunya Innovation and Design Studio",
      duration: "Jul 2024 - Dec 2024",
      location: "Coimbatore, Tamil Nadu, India",
      description: "Deployed real-time CCTV analytics with NVIDIA DeepStream SDK, improving streaming throughput by 40% from 15 to 21 FPS. Optimized YOLOv8 and Mask R-CNN with TensorRT INT8 quantisation to reduce latency by 60%. Managed Git/GitHub collaboration workflows across a multi-member engineering team building practical computer vision systems.",
      color: "bg-custom-purple"
    }
  ];

  return (
    <section id="experience" className="py-10 px-4 max-w-7xl mx-auto w-full relative">

      {/* Section Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="bg-custom-yellow px-8 py-3 rounded-full border-4 border-black shadow-neo">
          <h2 className="text-3xl font-shrikhand italic uppercase tracking-wide">EXPERIENCE</h2>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto z-10 pb-8">



        <div className="flex flex-col gap-12 lg:gap-20">
          {experiences.map((exp, index) => (
            <div key={index} className="flex flex-col lg:flex-row gap-6 lg:gap-16 items-start relative group">

              {/* Date & Location (Left Side) */}
              <div className="w-full lg:w-[260px] flex-shrink-0 flex flex-col items-start gap-4 z-10">
                {/* Date Capsule */}
                <div className="inline-flex items-center gap-3 bg-gray-100 px-5 py-2 border-4 border-black rounded-full shadow-[4px_4px_0_rgba(0,0,0,1)] font-bold text-sm md:text-base">
                  <FaCalendarAlt className="text-black" />
                  <span>{exp.duration}</span>
                </div>

                {/* Location (Text only) */}
                <div className="flex items-center gap-2 font-bold text-sm md:text-base text-gray-800 ml-2">
                  <FaMapMarkerAlt className="text-black text-lg flex-shrink-0" />
                  <span>{exp.location}</span>
                </div>
              </div>

              {/* Connecting Horizontal Line Element for Desktop */}
              <div className="hidden lg:block absolute top-6 left-[260px] w-16 h-1 bg-black z-0 border-t-4 border-black group-hover:bg-custom-yellow transition-colors"></div>

              {/* Dotted wavy line to next date */}
              {index !== experiences.length - 1 && (
                <div className="hidden lg:block absolute top-[40px] -bottom-[80px] left-[260px] w-16 -z-10 pointer-events-none">
                  <svg
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 50 0 C 120 25, -20 75, 50 100"
                      stroke="black"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="2 12"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>
              )}

              {/* Main Experience Card (Right Side) */}
              <div className="w-full flex-grow border-4 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex flex-col h-full relative bg-white">

                {/* Top Bar (like BlogCard) */}
                <div className={`border-b-4 border-black px-3 py-2 flex justify-between items-center ${exp.color}`}>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
                    <div className="w-3 h-3 rounded-full bg-white border-2 border-black"></div>
                  </div>
                  <span className="font-mono text-[10px] font-black uppercase tracking-widest text-black">
                    experience.exe
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  {/* Role */}
                  <h3 className="text-2xl md:text-3xl italic leading-tight mb-5 tracking-wide text-black font-shrikhand">
                    {exp.role}
                  </h3>

                  {/* Company Name Pill */}
                  <div className={`inline-block ${exp.color} px-5 py-2 border-4 border-black rounded-full font-bold text-lg md:text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] mb-8 tracking-wide w-fit`}>
                    {exp.company}
                  </div>

                  {/* Description Box */}
                  <div className="bg-gray-50 border-4 border-black rounded-xl p-5 md:p-6 shadow-sm relative overflow-hidden">
                    {/* Inner Dots */}
                    <div className="flex gap-1.5 mb-4">
                      <div className="w-3 h-3 rounded-full bg-custom-red border-2 border-black"></div>
                      <div className="w-3 h-3 rounded-full bg-custom-yellow border-2 border-black"></div>
                      <div className="w-3 h-3 rounded-full bg-custom-green border-2 border-black"></div>
                    </div>

                    <p className="font-sans text-base md:text-lg font-bold leading-relaxed text-gray-900">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
