/* The camera rig. Each [data-shot] element on the page holds one shot; the scene blends between neighbours as the
   reader scrolls. A shot is a plain vector so blending is just arithmetic. Anchors are in card-local coordinates:
   the point on the GPU the section's heading is wired to. */

export interface Shot {
  cam: [number, number, number];
  look: [number, number, number];
  /** 0 closed .. 1 open */
  lid: number;
  /** card rising out of the box */
  rise: number;
  /** box sinking out of frame */
  boxOut: number;
  /** cooler shroud + fans lifted off */
  shroud: number;
  /** heatsink lifted off */
  heat: number;
  /** 0 centred, 1 subject sits right of the reading column */
  side: number;
  yaw: number;
  /** rack of cards behind */
  fleet: number;
  /** 0 standby .. 1 fully powered: LEDs, seam light, fan RPM, die glow */
  power: number;
  anchor: [number, number, number];
  label: string;
  note: string;
}

const base = { lid: 1, rise: 1, boxOut: 1, shroud: 0, heat: 0, side: 1, yaw: -0.35, fleet: 0, power: 1 };

export const shots: Shot[] = [
  { ...base, cam: [0, 2.7, 6.4], look: [0, -0.2, 0], lid: 0, rise: 0, boxOut: 0, side: 0, yaw: 0, power: 0, anchor: [0, 0, 0], label: 'Box', note: 'Sealed.' },
  { ...base, cam: [0, 2.5, 2.3], look: [0, 1.2, -1.5], rise: 0.35, boxOut: 0, side: 0, yaw: 0, power: 0.7, anchor: [0, 0.4, 0], label: 'Unboxing', note: 'The lid comes off.' },
  { ...base, cam: [1.8, 2.3, 4.6], look: [0, 0.8, 0], side: 1, anchor: [0.95, 0.5, 0.3], label: 'The card', note: 'Three fans, one shroud: the part everyone sees.' },
  { ...base, cam: [1.2, 3.0, 3.9], look: [0, 1.5, 0], shroud: 1, yaw: -0.5, side: -1, anchor: [-0.9, 1.95, 0.3], label: 'Cooler', note: 'Heat out, so clocks stay up.' },
  { ...base, cam: [-0.3, 3.2, 2.9], look: [0.35, 0.9, 0], shroud: 1, heat: 1, yaw: -0.2, side: 1, anchor: [0.35, 0.07, 0], label: 'GPU die', note: 'Thousands of cores on one slab of silicon.' },
  { ...base, cam: [0.8, 2.0, 2.3], look: [0.4, 0.85, 0], shroud: 1, heat: 1, yaw: 0.1, side: -1, anchor: [0.85, 0.06, 0.4], label: 'Memory', note: 'Weights live here. Bandwidth is the limit.' },
  { ...base, cam: [1.5, 1.6, 2.9], look: [0.4, 0.9, 0.05], shroud: 1, heat: 1, yaw: 0.5, side: -1, anchor: [0.35, 0.07, 0], label: 'Inference', note: 'Tokens in, tokens out.' },
  { ...base, cam: [-2.2, 2.0, 2.6], look: [-1.0, 0.9, 0], shroud: 1, heat: 1, yaw: 0.2, side: -1, anchor: [-1.1, 0.1, 0], label: 'Power', note: 'Clean power or it throttles.' },
  { ...base, cam: [0.6, 1.1, 4.1], look: [-0.2, 0.75, 0.7], shroud: 1, heat: 1, yaw: 0, side: 1, anchor: [-0.3, -0.02, 0.62], label: 'PCIe link', note: 'Where the card meets the system.' },
  { ...base, cam: [3.1, 3.0, 5.3], look: [0, 1.0, 0], shroud: 0.6, heat: 0.4, yaw: -0.6, side: -1, anchor: [0.35, 0.07, 0], label: 'Assembled', note: 'Every part, working as one.' },
  { ...base, cam: [0, 4.8, 10.5], look: [0, 0.6, -1.5], fleet: 1, side: 1, yaw: -0.3, anchor: [0, 0.3, 0], label: 'Fleet', note: 'One card becomes a cluster.' },
];

export const FIRST_CONTENT_SHOT = 2;

export type Vec = number[];

const BACK = 1.5; // pull every shot back so the whole object breathes

export const flatten = (s: Shot): Vec => [
  ...(s.cam.map((c, i) => s.look[i] + (c - s.look[i]) * BACK) as [number, number, number]), ...s.look, s.lid, s.rise, s.boxOut, s.shroud, s.heat, s.side, s.yaw, s.fleet, ...s.anchor, s.power,
];
