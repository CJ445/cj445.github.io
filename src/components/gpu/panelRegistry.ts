/* Where the portfolio's content lives. Every section registers a "panel": a host element that holds its real DOM.
   Until the 3D scene is ready the host sits in the page flow (a normal readable page). Once the scene takes over,
   hosts are moved into the 3D world and the section placeholder only reserves scroll distance. */

export interface PanelEntry {
  shot: number;
  /** 'lid' hangs on the inside of the box lid; 'float' is projected from a part of the card. */
  kind: 'lid' | 'float';
  section: HTMLElement;
  host: HTMLElement;
  inner: HTMLElement;
  contentH: number;
  panelH: number;
}

const panels = new Map<number, PanelEntry>();
const listeners = new Set<() => void>();
export const world = { active: false };

/** Fixed size of the lid screen in CSS px. The scene scales it onto the 4.4 x 2.6 inner face of the lid. */
export const LID_W = 880;
export const LID_H = 520;

/** Phones get a smaller logical screen, so the same lid shows larger, readable type. */
export const lidSize = () => (typeof window !== 'undefined' && window.innerWidth < 1024 ? { w: 460, h: 272 } : { w: LID_W, h: LID_H });

const emit = () => listeners.forEach((l) => l());

export const registerPanel = (p: PanelEntry) => {
  panels.set(p.shot, p);
  emit();
};
export const unregisterPanel = (shot: number) => {
  panels.delete(shot);
  emit();
};
export const listPanels = () => Array.from(panels.values()).sort((a, b) => a.shot - b.shot);
export const subscribePanels = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const setWorldActive = (on: boolean) => {
  world.active = on;
  emit();
};
