import { useEffect, useRef } from 'react';
import Taskbar from './components/layout/Taskbar';
import Hero from './components/sections/Hero';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import InferenceMonitor from './components/sections/InferenceMonitor';
import Education from './components/sections/Education';
import Experience from './components/sections/Experience';
import ExtrasAccordion from './components/sections/ExtrasAccordion';
import Footer from './components/layout/Footer';
import CustomCursor from './components/ui/CustomCursor';
import Marquee from './components/ui/Marquee';
import Preloader from './components/ui/Preloader';
import Blogs from './components/sections/Blogs';

function App() {
  const progressRef = useRef<HTMLDivElement>(null);

  // Scroll progress is written straight to the DOM so scrolling never re-renders the page.
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const ratio = max > 0 ? el.scrollTop / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-custom-blue overflow-x-hidden selection:bg-custom-yellow selection:text-black font-sans relative">
      <Preloader />

      <CustomCursor />

      <div ref={progressRef} aria-hidden="true" className="fixed top-0 left-0 h-2 w-full origin-left bg-custom-green z-[100]" style={{ transform: 'scaleX(0)' }}></div>
      <div aria-hidden="true" className="fixed top-0 left-0 w-full h-2 bg-custom-yellow z-[90]"></div>


      <Taskbar />


      <main className="flex flex-col gap-20 pt-32 pb-20">


        <Hero />


        <Experience />
        <Skills />

        <InferenceMonitor />

        <Projects />

        <Blogs />



        <Education />

        <ExtrasAccordion />


        <Marquee />

      </main>


      <Footer />

    </div>
  );
}

export default App;