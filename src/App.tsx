import Footer from './components/layout/Footer';
import About from './components/sections/About';
import Education from './components/sections/Education';
import Experience from './components/sections/Experience';
import FeaturedWork from './components/sections/FeaturedWork';
import Hero from './components/sections/Hero';
import LiveDemo from './components/sections/LiveDemo';
import Projects from './components/sections/Projects';
import Recognition from './components/sections/Recognition';
import Skills from './components/sections/Skills';
import Writing from './components/sections/Writing';

const App = () => (
  <div className="min-h-screen overflow-x-hidden bg-white selection:bg-violet-200">
    <Hero />
    <main>
      <About />
      <FeaturedWork />
      <Experience />
      <Projects />
      <LiveDemo />
      <Skills />
      <Education />
      <Recognition />
      <Writing />
    </main>
    <Footer />
  </div>
);

export default App;
