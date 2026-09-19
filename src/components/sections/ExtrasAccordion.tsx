import React, { useState } from 'react';
import Hackathons from './Hackathons';
import BeyondCode from './BeyondCode';

const ExtrasAccordion = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="flex flex-col gap-12 w-full overflow-hidden pb-10">
      <Hackathons isOpen={expandedId === 'hackathons'} onToggle={() => toggleSection('hackathons')} />
      <BeyondCode isOpen={expandedId === 'beyond-code'} onToggle={() => toggleSection('beyond-code')} />
    </div>
  );
};

export default ExtrasAccordion;
