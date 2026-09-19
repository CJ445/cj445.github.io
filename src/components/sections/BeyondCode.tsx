import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHandHoldingHeart, FaBullhorn } from 'react-icons/fa';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

const BeyondCode: React.FC<SectionProps> = ({ isOpen, onToggle }) => {
    return (
        <motion.section
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.3, ease: "linear" }}
            className="w-[95%] md:w-[85%] lg:w-[75%] relative bg-custom-purple border-4 border-l-0 border-black shadow-neo"
        >

            <div className="flex items-center justify-between px-6 md:px-10 py-6">
                <h2 className="text-3xl md:text-4xl font-shrikhand text-black uppercase tracking-wide">BEYOND CODE</h2>
                <button
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Close' : 'Open'} beyond code`}
                    className="bg-white text-black px-6 py-2 font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase tracking-wider"
                >
                    {isOpen ? 'Close' : 'Open'}
                </button>
            </div>


            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 md:px-10 pb-10 pt-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto relative z-10">
                                <div className="bg-white border-4 border-black p-8 border-b-8 border-r-8 hover:-translate-y-1 transition-all relative shadow-neo mt-4">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <FaBullhorn className="text-4xl text-custom-blue" />
                                            <h3 className="text-3xl font-shrikhand">Campus Lead</h3>
                                        </div>
                                        <p className="font-bold text-xl mb-4">@ Google Developer Groups On Campus, Karunya</p>
                                        <p className="text-sm font-mono bg-custom-green text-black font-bold inline-block px-3 py-1 border-2 border-black rounded-full mb-6 shadow-sm">
                                            2024 - 2025
                                        </p>
                                        <p className="text-base font-medium leading-relaxed bg-gray-100 p-4 rounded-2xl border-2 border-black">
                                            Led a <span className="font-bold bg-custom-pink px-1 border border-black">25-member</span> student engineering community and coordinated workshops, developer events, and a state-level hackathon.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border-4 border-black p-8 border-b-8 border-r-8 hover:-translate-y-1 transition-all relative shadow-neo mt-4">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <FaHandHoldingHeart className="text-4xl text-custom-red" />
                                            <h3 className="text-3xl font-shrikhand">Team Lead</h3>
                                        </div>
                                        <p className="font-bold text-xl mb-4">@ Bharatiya Antariksh Hackathon 2025 (ISRO)</p>
                                        <p className="text-sm font-mono bg-custom-blue text-black font-bold inline-block px-3 py-1 border-2 border-black rounded-full mb-6 shadow-sm">
                                            2025
                                        </p>
                                        <p className="text-base font-medium leading-relaxed bg-gray-100 p-4 rounded-2xl border-2 border-black">
                                            Led satellite image super-resolution work to <span className="font-bold bg-custom-yellow px-1 border border-black">4th Place Nationally</span> among 61,000+ students.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
};

export default BeyondCode;
