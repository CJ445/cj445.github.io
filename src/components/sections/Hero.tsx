import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaMedium, FaDownload, FaInstagram } from 'react-icons/fa';
import ContactModal from '../ui/ContactModal';
import MiniTerminal from '../ui/MiniTerminal';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="pt-4 pb-10 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-start justify-center">


      <div className="w-full md:w-1/3 bg-white border-2 border-b-4 border-r-4 border-black rounded-3xl p-6 shadow-neo flex flex-col items-center text-center relative overflow-hidden">

        <div className="w-32 h-32 bg-custom-pink rounded-full border-4 border-black mb-4 flex items-center justify-center text-4xl overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}cyril.jpg`}
            alt="Cyril Jacob"
            className="w-full h-full object-cover"
          />

        </div>

        <h1 className="text-4xl font-shrikhand mb-1">CYRIL JACOB</h1>
        <div className="bg-black text-white px-3 py-1 font-mono text-sm rounded-md mb-4 rotate-1">
          SOFTWARE_ENGINEER()
        </div>

        <div className="w-full space-y-3 text-left font-bold text-sm font-mono border-t-2 border-black pt-4">
          <div>
            <span className="bg-custom-yellow px-1 border border-black mr-2">[LOCATION]</span>
            NEW DELHI, INDIA
          </div>
          <div>
            <span className="bg-custom-green px-1 border border-black mr-2">[STATUS]</span>
            4th YEAR BTECH STUDENT
          </div>
          <div>
            <span className="bg-custom-blue px-1 border border-black mr-2">[MISSION]</span>
            Build. Ship. Learn.
          </div>
        </div>


        <div className="w-full flex flex-col gap-3 mt-6">
          <a
            href={`${import.meta.env.BASE_URL}Cyril_Jacob_Resume.pdf`}
            download="Cyril_Jacob_Resume.pdf"
            className="bg-custom-green w-full min-h-11 py-3 rounded-xl border-2 border-black font-bold shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaDownload aria-hidden="true" /> DOWNLOAD_RESUME
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-custom-red text-black w-full py-3 rounded-xl border-2 border-black font-bold shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FaEnvelope /> CONTACT ME
          </button>
        </div>


        <ul className="flex gap-2 mt-6 text-2xl flex-wrap justify-center">
          {[
            { href: 'mailto:itscyriljacob@gmail.com', label: 'Email', icon: <FaEnvelope />, tone: 'text-red-600' },
            { href: 'https://github.com/cj445', label: 'GitHub', icon: <FaGithub />, tone: '' },
            { href: 'https://www.linkedin.com/in/thecyriljacob/', label: 'LinkedIn', icon: <FaLinkedin />, tone: 'text-blue-700' },
            { href: 'https://medium.com/@thecyriljacob', label: 'Medium', icon: <FaMedium />, tone: 'text-black' },
            { href: 'https://www.instagram.com/ente.peru.cyril/', label: 'Instagram', icon: <FaInstagram />, tone: 'text-pink-700' },
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                aria-label={l.label}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                className={`w-11 h-11 flex items-center justify-center rounded-full hover:scale-110 transition-transform ${l.tone}`}
              >
                {l.icon}
              </a>
            </li>
          ))}
        </ul>
      </div>


      <div className="w-full md:w-2/3 flex flex-col gap-6" id="about">

        <div className="bg-custom-yellow p-6 md:p-10 rounded-3xl border-2 border-b-4 border-r-4 border-black shadow-neo">
          <h2 className="text-4xl font-shrikhand mb-6">Hi people!</h2>
          <p className="text-lg font-medium leading-relaxed mb-4">
            I'm a <span className="font-bold bg-white px-1 border border-black">CSE (AI & ML) student at Karunya Institute of Technology & Sciences</span>, graduating in 2027. I build backend and distributed systems, cloud infrastructure, and DevOps pipelines, backed up by AI/ML and computer vision experience.
          </p>
          <p className="text-lg font-medium leading-relaxed mb-4">
            I'm always excited to connect with folks building scalable products or conducting impactful AI research!
          </p>
          <div className="bg-white p-4 border-2 border-black rounded-xl inline-block font-bold shadow-neo-sm ">
            🚀 Open to Software Engineering and Research opportunities
          </div>
        </div>

        <MiniTerminal />
      </div>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </section>
  );
};

export default Hero;