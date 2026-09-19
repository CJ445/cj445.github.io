import React from 'react';

const highlights = [
  'Software engineer: backend, distributed systems, cloud infrastructure',
  'TensorRT INT8: −60% YOLOv8 / Mask R-CNN latency',
  'DeepStream: 15 → 21 FPS on live CCTV streams',
  'Netplan + shell automation: −70% server provisioning time',
  'Smart India Hackathon 2025: Grand Finale Top 5 (ISRO)',
  'Bharatiya Antariksh Hackathon 2025: 4th place nationally',
  'Open to software engineering and research roles',
  'itscyriljacob@gmail.com',
];

const Group = ({ hidden = false }: { hidden?: boolean }) => (
  <ul
    aria-hidden={hidden || undefined}
    className={`flex shrink-0 items-center motion-reduce:flex-wrap motion-reduce:justify-center ${hidden ? 'motion-reduce:hidden' : ''}`}
  >
    {highlights.map((text) => (
      <li key={text} className="mx-6 whitespace-nowrap motion-reduce:whitespace-normal">
        {text} <span aria-hidden="true">•</span>
      </li>
    ))}
  </ul>
);

const Marquee = () => {
  return (
    <div
      role="region"
      aria-label="Highlights"
      className="group bg-custom-yellow border-y-4 border-black py-3 overflow-hidden z-20 my-10 font-bold text-lg uppercase tracking-wide"
    >
      {/* Two identical groups so the loop is seamless; the copy is hidden from screen readers.
          Hover or focus pauses it, and reduced-motion users get a static, wrapped list. */}
      <div className="flex w-max animate-marquee-track motion-reduce:w-auto motion-reduce:animate-none">
        <Group />
        <Group hidden />
      </div>
    </div>
  );
};

export default Marquee;
