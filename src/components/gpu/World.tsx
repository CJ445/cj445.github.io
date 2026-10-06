import { useState } from 'react';
import Cover from '../anatomy/Cover';
import { shots } from './shots';
import Datasheet from './Datasheet';
import Journey from './Journey';
import LidHero from './LidHero';
import { stageContent } from './stageContent';
import type { SheetKey } from './stageContent';

/** The default view: a GPU box that opens as you scroll. Each stage is a spacer; the scene and its type are fixed. */
const World = () => {
  const [sheet, setSheet] = useState<SheetKey | null>(null);
  return (
    <div className="min-h-screen overflow-x-clip selection:bg-accent/30">
      <Journey onOpenSheet={setSheet} />
      <Cover />
      <LidHero />
      {stageContent.map((s) => (
        <section
          key={s.shot}
          data-shot={s.shot}
          aria-label={shots[s.shot].label}
          style={{ height: `${70 + 40 * s.callouts.length}vh` }}
        />
      ))}
      <p className="pb-10 text-center text-xs text-secondary">© {new Date().getFullYear()} Cyril Jacob</p>
      <Datasheet open={sheet} onClose={() => setSheet(null)} />
    </div>
  );
};

export default World;
