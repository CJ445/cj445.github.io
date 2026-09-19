import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaTimes, FaMedium, FaInstagram } from 'react-icons/fa';
import { useModal } from './useModal';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useModal<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        className="bg-white w-full max-w-md border-4 border-black rounded-3xl p-6 shadow-neo relative animate-bounce-in"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="contact-title" className="text-3xl font-shrikhand">Get in Touch 📬</h2>
          <button
            onClick={onClose}
            aria-label="Close contact dialog"
            className="w-11 h-11 flex items-center justify-center text-2xl rounded-full hover:rotate-90 transition-transform cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col gap-4 font-bold">
          <a href="mailto:itscyriljacob@gmail.com" className="flex items-center gap-3 p-3 bg-custom-yellow border-2 border-black rounded-xl hover:translate-x-1 hover:shadow-neo-sm transition-all">
            <FaEnvelope className="text-xl" /> itscyriljacob@gmail.com
          </a>
          <a href="https://github.com/cj445" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-gray-200 border-2 border-black rounded-xl hover:translate-x-1 hover:shadow-neo-sm transition-all">
            <FaGithub className="text-xl" /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/thecyriljacob/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-blue-200 border-2 border-black rounded-xl hover:translate-x-1 hover:shadow-neo-sm transition-all">
            <FaLinkedin className="text-xl" /> LinkedIn
          </a>
          <a href="https://medium.com/@thecyriljacob" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white text-black border-2 border-black rounded-xl hover:translate-x-1 hover:shadow-neo-sm transition-all">
            <FaMedium className="text-xl" /> Medium
          </a>
          <a href="https://www.instagram.com/ente.peru.cyril/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-pink-200 text-black border-2 border-black rounded-xl hover:translate-x-1 hover:shadow-neo-sm transition-all">
            <FaInstagram className="text-xl" /> Instagram
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-custom-red text-black font-bold py-3 border-2 border-black rounded-xl shadow-neo-sm hover:shadow-none hover:translate-y-1 transition-all cursor-pointer"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
