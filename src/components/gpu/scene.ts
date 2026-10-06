import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { lidSize, listPanels, setWorldActive } from './panelRegistry';
import { FLEET_UNIT, setFleetPhase } from '../../lib/fleetState';
import { getInferenceLive } from '../../lib/inferenceLive';
import type { Vec } from './shots';

/* A procedural graphics card and its retail box, built from primitives. No models, no textures on disk:
   the name on the lid, the PCB traces and the die are drawn to canvases at load. */

export interface GpuScene {
  apply: (v: Vec, wide: boolean, f: number) => void;
  /** Card-local point to screen pixels (view offset included). */
  project: (a: [number, number, number]) => [number, number];
  resize: () => void;
  setMotion: (on: boolean) => void;
  dispose: () => void;
}

interface Labels {
  name: string;
  headline: string;
}

const ACCENT = '#e8502f';

const canvasTexture = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const lidTexture = ({ name, headline }: Labels) =>
  canvasTexture(2200, 1300, (c) => {
    const g = c.createLinearGradient(0, 0, 2200, 1300);
    g.addColorStop(0, '#1a1d22');
    g.addColorStop(1, '#101215');
    c.fillStyle = g;
    c.fillRect(0, 0, 2200, 1300);
    c.strokeStyle = '#2c3037';
    c.lineWidth = 2;
    for (let i = 0; i <= 44; i++) {
      c.beginPath();
      c.moveTo(60 + i * 48.6, 60);
      c.lineTo(60 + i * 48.6, i % 5 === 0 ? 96 : 78);
      c.moveTo(60 + i * 48.6, 1240);
      c.lineTo(60 + i * 48.6, i % 5 === 0 ? 1204 : 1222);
      c.stroke();
    }
    c.strokeRect(60, 60, 2080, 1180);
    c.fillStyle = ACCENT;
    c.fillRect(120, 140, 120, 120);
    const font = 'Inter, ui-sans-serif, system-ui, sans-serif';
    c.fillStyle = '#fff';
    c.font = `500 52px ${font}`;
    c.textBaseline = 'middle';
    c.textAlign = 'center';
    c.fillText('CJ', 180, 202);
    c.textAlign = 'left';
    c.fillStyle = '#8a8f98';
    c.font = '500 34px ui-monospace, Menlo, Consolas, monospace';
    c.fillText('INFERENCE ENGINEER', 280, 176);
    c.fillText('SKU CJ-445', 280, 226);
    c.fillStyle = '#ece7dc';
    c.font = `500 330px ${font}`;
    c.textBaseline = 'alphabetic';
    const [first, last] = name.split(' ');
    c.fillText(first, 112, 780);
    c.fillText(last, 112, 1080);
    c.fillStyle = '#8a8f98';
    c.font = '500 34px ui-monospace, Menlo, Consolas, monospace';
    c.textAlign = 'right';
    c.fillText(headline.split('·')[1]?.trim().toUpperCase() ?? '', 2090, 1196);
    c.fillStyle = ACCENT;
    c.fillRect(1480, 360, 610, 6);
    c.strokeStyle = '#3a3f47';
    c.lineWidth = 12;
    c.beginPath();
    c.arc(1930, 760, 120, 0, Math.PI * 2);
    c.stroke();
    c.fillStyle = '#2a2e34';
    c.beginPath();
    c.arc(1930, 760, 40, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#6b7079';
    c.font = '500 30px ui-monospace, Menlo, Consolas, monospace';
    c.textAlign = 'center';
    c.fillText('POWER', 1930, 940);
  });

/** What glows on the lid: the ignition ring, the CJ mark and the accent bar. Everything else stays black. */
const lidGlowTexture = () =>
  canvasTexture(2200, 1300, (c) => {
    c.fillStyle = '#000';
    c.fillRect(0, 0, 2200, 1300);
    c.fillStyle = '#fff';
    c.fillRect(120, 140, 120, 120);
    c.fillRect(1480, 360, 610, 6);
    c.strokeStyle = '#fff';
    c.lineWidth = 16;
    c.beginPath();
    c.arc(1930, 760, 120, 0, Math.PI * 2);
    c.stroke();
    c.beginPath();
    c.arc(1930, 760, 40, 0, Math.PI * 2);
    c.fill();
    c.lineWidth = 16;
    c.beginPath();
    c.arc(1930, 760, 120, -Math.PI / 2 - 0.5, -Math.PI / 2 + 0.5);
    c.clearRect(1900, 600, 60, 70);
    c.stroke();
  });

const sideTexture = () =>
  canvasTexture(1400, 160, (c) => {
    c.fillStyle = '#14161a';
    c.fillRect(0, 0, 1400, 160);
    c.fillStyle = '#ece7dc';
    c.font = '500 60px Inter, system-ui, sans-serif';
    c.textBaseline = 'middle';
    c.fillText('Cyril Jacob', 40, 82);
    c.fillStyle = ACCENT;
    c.fillRect(1280, 56, 80, 48);
  });

const pcbTexture = () =>
  canvasTexture(1200, 480, (c) => {
    c.fillStyle = '#0d1014';
    c.fillRect(0, 0, 1200, 480);
    c.strokeStyle = '#242b34';
    c.lineWidth = 3;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 90; i++) {
      let x = rnd() * 1200;
      let y = rnd() * 480;
      c.beginPath();
      c.moveTo(x, y);
      for (let k = 0; k < 4; k++) {
        if (k % 2) y += (rnd() - 0.5) * 220;
        else x += (rnd() - 0.5) * 320;
        c.lineTo(x, y);
      }
      c.stroke();
    }
    c.fillStyle = '#323a45';
    for (let i = 0; i < 160; i++) c.fillRect(rnd() * 1200, rnd() * 480, 6, 6);
  });

/** The die: an 8x8 grid of tiles. `wave` (0..1) sweeps a bright front across it, the way one inference crosses the chip. */
const makeDie = () => {
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 512;
  const c = cv.getContext('2d')!;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const n = 8;
  const s = 512 / n;
  const draw = (wave: number | null) => {
    c.fillStyle = '#15181d';
    c.fillRect(0, 0, 512, 512);
    for (let r = 0; r < n; r++)
      for (let k = 0; k < n; k++) {
        const hot = (r * 7 + k * 3) % 11 === 0;
        const d = (r + k) / (2 * n - 2);
        // Each tile lights as the front passes it, then cools behind it.
        const lit = wave === null ? (hot ? 1 : 0) : Math.max(0, 1 - Math.abs(wave * 1.3 - 0.15 - d) * 3.2);
        c.fillStyle = lit > 0.02 ? `rgb(${Math.round(31 + (232 - 31) * lit)},${Math.round(36 + (80 - 36) * lit)},${Math.round(43 + (47 - 43) * lit)})` : '#1f242b';
        c.fillRect(k * s + 6, r * s + 6, s - 12, s - 12);
        c.strokeStyle = '#3a414b';
        c.lineWidth = 2;
        c.strokeRect(k * s + 6, r * s + 6, s - 12, s - 12);
      }
    tex.needsUpdate = true;
  };
  draw(null);
  return { texture: tex, draw };
};

const std = (color: string, metalness: number, roughness: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });

export const createScene = (canvas: HTMLCanvasElement, layer: HTMLElement, labels: Labels): GpuScene => {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const css = new CSS3DRenderer({ element: layer });
  css.domElement.style.overflow = 'visible';

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);

  const key = new THREE.DirectionalLight(0xfff4e6, 2.4);
  key.position.set(3.5, 7, 4.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 20 });
  key.shadow.bias = -0.0006;
  scene.add(key);
  const rim = new THREE.PointLight(0xe8502f, 14, 14, 2);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x20242c, 0.35));

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.28 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.72;
  floor.receiveShadow = true;
  scene.add(floor);

  // Materials
  const graphite = std('#23272e', 0.65, 0.42);
  const black = std('#0c0d10', 0.3, 0.55);
  const alu = std('#b7bcc4', 0.95, 0.32);
  const copper = std('#c0683a', 1, 0.28);
  const gold = std('#dcb460', 1, 0.28);
  const accent = new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 1.6, roughness: 0.4 });
  const die = makeDie();
  const dieMap = die.texture;

  const mesh = (g: THREE.BufferGeometry, m: THREE.Material | THREE.Material[], p: [number, number, number], parent: THREE.Object3D) => {
    const o = new THREE.Mesh(g, m);
    o.position.set(...p);
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  };

  // ---------------- Box ----------------
  const box = new THREE.Group();
  scene.add(box);
  const wall = std('#15171b', 0.2, 0.7);
  const front = new THREE.MeshStandardMaterial({ map: sideTexture(), roughness: 0.6, metalness: 0.2 });
  // Once the wall folds flat toward the camera its inner face is upside-down, so the label is pre-rotated to read right.
  const innerLabel = sideTexture();
  innerLabel.center.set(0.5, 0.5);
  innerLabel.rotation = Math.PI;
  const frontInner = new THREE.MeshStandardMaterial({ map: innerLabel, roughness: 0.6, metalness: 0.2 });
  mesh(new THREE.BoxGeometry(4.4, 0.08, 2.6), wall, [0, -0.66, 0], box);
  // The four walls hang from their bottom edges so they can unfold outward like petals.
  const hinge = (pos: [number, number, number]) => {
    const g = new THREE.Group();
    g.position.set(...pos);
    box.add(g);
    return g;
  };
  const pFront = hinge([0, -0.66, 1.27]);
  const pBack = hinge([0, -0.66, -1.27]);
  const pLeft = hinge([-2.17, -0.66, 0]);
  const pRight = hinge([2.17, -0.66, 0]);
  mesh(new THREE.BoxGeometry(4.4, 0.7, 0.06), [wall, wall, wall, wall, front, frontInner], [0, 0.31, 0], pFront);
  mesh(new THREE.BoxGeometry(4.4, 0.7, 0.06), wall, [0, 0.31, 0], pBack);
  mesh(new THREE.BoxGeometry(0.06, 0.7, 2.6), wall, [0, 0.31, 0], pLeft);
  mesh(new THREE.BoxGeometry(0.06, 0.7, 2.6), wall, [0, 0.31, 0], pRight);
  mesh(new THREE.BoxGeometry(4.3, 0.03, 2.5), std('#0a0b0d', 0, 1), [0, -0.6, 0], box);

  const lidPivot = new THREE.Group();
  lidPivot.position.set(0, 0, -1.3);
  box.add(lidPivot);
  const lidGlow = lidGlowTexture();
  const lidTop = new THREE.MeshStandardMaterial({ map: lidTexture(labels), emissiveMap: lidGlow, emissive: ACCENT, emissiveIntensity: 0.3, roughness: 0.38, metalness: 0.25 });
  const lid = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.14, 2.6), [wall, wall, lidTop, wall, wall, wall]);
  lid.position.set(0, 0.07, 1.3);
  lid.castShadow = true;
  lid.receiveShadow = true;
  lidPivot.add(lid);

  // Ignition hardware: light leaking from the seam, a shift-light bar on the front wall, and a glow inside the box.
  const seam = new THREE.MeshStandardMaterial({ color: '#1a1c20', emissive: ACCENT, emissiveIntensity: 0, roughness: 0.5 });
  mesh(new THREE.BoxGeometry(4.36, 0.018, 0.02), seam, [0, 0.663, 0.04], pFront);
  mesh(new THREE.BoxGeometry(0.02, 0.018, 2.56), seam, [-0.02, 0.663, 0], pLeft);
  mesh(new THREE.BoxGeometry(0.02, 0.018, 2.56), seam, [0.02, 0.663, 0], pRight);
  const SEGMENTS = 16;
  const shiftLights: THREE.MeshStandardMaterial[] = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const m = new THREE.MeshStandardMaterial({ color: '#2a2e34', emissive: ACCENT, emissiveIntensity: 0, roughness: 0.5 });
    shiftLights.push(m);
    mesh(new THREE.BoxGeometry(0.15, 0.035, 0.012), m, [-1.9 + i * 0.253, 0.54, 0.035], pFront);
    mesh(new THREE.BoxGeometry(0.15, 0.035, 0.012), m, [-1.9 + i * 0.253, 0.54, -0.035], pFront);
  }
  // The floor ring and the elevator rods the card rides up on, plus a spotlight that finds it.
  const ringMat = new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.95, 2.02, 128), ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -0.575;
  box.add(ring);
  const rods = [-1.25, 1.25].flatMap((x) => [-0.42, 0.42].map((z) => mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 12), alu, [x, -0.3, z], box)));
  const spot = new THREE.SpotLight(0xfff1e0, 0, 0, 0.5, 0.85, 2);
  spot.position.set(0, 6.5, 2.5);
  spot.target.position.set(0, 0.2, 0);
  scene.add(spot, spot.target);
  const glow = new THREE.PointLight(0xff7a4d, 0, 7, 2);
  glow.position.set(0, -0.1, 0.2);
  box.add(glow);

  // ---------------- Card ----------------
  const card = new THREE.Group();
  scene.add(card);

  const pcbMat = new THREE.MeshStandardMaterial({ map: pcbTexture(), roughness: 0.55, metalness: 0.3 });
  mesh(new THREE.BoxGeometry(3.0, 0.05, 1.15), pcbMat, [0, -0.025, 0], card);
  mesh(new THREE.BoxGeometry(3.0, 0.03, 1.15), graphite, [0, -0.07, 0], card);
  mesh(new THREE.BoxGeometry(1.0, 0.012, 0.14), gold, [-0.3, -0.02, 0.64], card);
  const bracket = mesh(new THREE.BoxGeometry(0.03, 0.62, 1.22), alu, [-1.52, 0.2, 0.02], card);
  for (let i = 0; i < 3; i++) mesh(new THREE.BoxGeometry(0.04, 0.1, 0.24), black, [-1.53, 0.12 + (i === 1 ? 0.2 : 0), -0.36 + i * 0.36], card).scale.y = i === 1 ? 0.8 : 1;
  bracket.castShadow = true;

  // die + substrate
  const DIE: [number, number] = [0.35, 0];
  mesh(new THREE.BoxGeometry(0.84, 0.04, 0.84), std('#1c2127', 0.4, 0.5), [DIE[0], 0.02, DIE[1]], card);
  const dieMat = new THREE.MeshStandardMaterial({ map: dieMap, emissiveMap: dieMap, emissive: 0xffffff, emissiveIntensity: 0.7, roughness: 0.3, metalness: 0.6 });
  mesh(new THREE.BoxGeometry(0.5, 0.03, 0.5), dieMat, [DIE[0], 0.055, DIE[1]], card);

  // memory
  const chipPos: [number, number][] = [];
  for (const x of [-0.2, 0.9]) for (const z of [-0.42, -0.14, 0.14, 0.42]) chipPos.push([x, z]);
  chipPos.forEach(([x, z]) => mesh(new THREE.BoxGeometry(0.24, 0.045, 0.22), black, [x, 0.022, z], card));

  // power delivery
  for (let i = 0; i < 6; i++) mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.09, 24), graphite, [-1.1, 0.045, -0.46 + i * 0.185], card);
  for (let i = 0; i < 5; i++) mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.11, 16), black, [-0.85, 0.055, -0.38 + i * 0.19], card);
  mesh(new THREE.BoxGeometry(0.36, 0.12, 0.2), black, [1.2, 0.06, -0.5], card);

  // heatsink
  const heat = new THREE.Group();
  card.add(heat);
  mesh(new THREE.BoxGeometry(2.4, 0.04, 1.0), copper, [0, 0.11, 0], heat);
  for (let i = 0; i < 36; i++) mesh(new THREE.BoxGeometry(0.018, 0.2, 0.95), alu, [-1.12 + i * 0.064, 0.23, 0], heat);
  for (const z of [-0.3, 0, 0.3]) {
    const p = mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.35, 20), copper, [0, 0.15, z], heat);
    p.rotation.z = Math.PI / 2;
  }

  // shroud + fans
  const shroud = new THREE.Group();
  card.add(shroud);
  const outline = new THREE.Shape();
  const W = 3.05;
  const D = 1.22;
  const R = 0.12;
  outline.moveTo(-W / 2 + R, -D / 2);
  outline.lineTo(W / 2 - R, -D / 2);
  outline.quadraticCurveTo(W / 2, -D / 2, W / 2, -D / 2 + R);
  outline.lineTo(W / 2, D / 2 - R);
  outline.quadraticCurveTo(W / 2, D / 2, W / 2 - R, D / 2);
  outline.lineTo(-W / 2 + R, D / 2);
  outline.quadraticCurveTo(-W / 2, D / 2, -W / 2, D / 2 - R);
  outline.lineTo(-W / 2, -D / 2 + R);
  outline.quadraticCurveTo(-W / 2, -D / 2, -W / 2 + R, -D / 2);
  const fanX = [-0.97, 0, 0.97];
  fanX.forEach((x) => {
    const h = new THREE.Path();
    h.absarc(x, 0, 0.44, 0, Math.PI * 2, true);
    outline.holes.push(h);
  });
  const body = new THREE.ExtrudeGeometry(outline, { depth: 0.16, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2, curveSegments: 40 });
  const shell = new THREE.Mesh(body, graphite);
  shell.rotation.x = -Math.PI / 2;
  shell.position.set(0, 0.32, 0);
  shell.castShadow = true;
  shell.receiveShadow = true;
  shroud.add(shell);
  mesh(new THREE.BoxGeometry(2.7, 0.012, 0.025), accent, [0, 0.492, 0.585], shroud);
  mesh(new THREE.BoxGeometry(0.4, 0.012, 0.02), accent, [1.25, 0.492, -0.585], shroud);

  const fans: THREE.Group[] = [];
  fanX.forEach((x, fi) => {
    const f = new THREE.Group();
    f.position.set(x, 0.4, 0);
    shroud.add(f);
    mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 32), black, [0, 0, 0], f);
    mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.065, 24), fi === 1 ? accent : alu, [0, 0, 0], f);
    for (let b = 0; b < 11; b++) {
      const arm = new THREE.Group();
      arm.rotation.y = (b / 11) * Math.PI * 2;
      f.add(arm);
      const blade = mesh(new THREE.BoxGeometry(0.3, 0.012, 0.14), black, [0.26, 0, 0], arm);
      blade.rotation.x = 0.42;
      blade.rotation.y = 0.12;
    }
    fans.push(f);
  });

  // data moving from memory to the die
  const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(0.018, 10, 10), accent, chipPos.length);
  card.add(dots);
  const tmp = new THREE.Object3D();

  // ---------------- Fleet ----------------
  const fleet = new THREE.Group();
  scene.add(fleet);
  const racks = new THREE.InstancedMesh(new RoundedBoxGeometry(1.1, 0.16, 1.5, 2, 0.02), graphite, 60);
  const leds = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.03, 0.02), new THREE.MeshBasicMaterial({ toneMapped: false }), 60);
  const rackPos: [number, number, number][] = [];
  const PAPER = new THREE.Color('#d9d3c7');
  let n = 0;
  for (let r = 0; r < 6; r++)
    for (let k = 0; k < 10; k++) {
      tmp.position.set((k - 4.5) * 1.35, r * 0.36 - 0.2, 0);
      tmp.rotation.set(0, 0, 0);
      tmp.updateMatrix();
      racks.setMatrixAt(n, tmp.matrix);
      racks.setColorAt(n, new THREE.Color(1, 1, 1));
      rackPos.push([tmp.position.x, tmp.position.y, 0.77]);
      tmp.position.z = 0.77;
      tmp.position.x += 0.42;
      tmp.updateMatrix();
      leds.setMatrixAt(n, tmp.matrix);
      leds.setColorAt(n, PAPER.clone().multiplyScalar(0.55 + ((n * 37) % 10) / 22));
      n++;
    }
  racks.castShadow = true;
  fleet.add(racks, leds);
  const remedy = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: ACCENT, toneMapped: false }));
  remedy.visible = false;
  fleet.add(remedy);
  const unitIdx = FLEET_UNIT - 1;
  const unit = rackPos[unitIdx];
  const white = new THREE.Color(1, 1, 1);
  const hot = new THREE.Color(ACCENT);
  const tintRed = new THREE.Color(7, 0.9, 0.6);
  const fleetClock = (time: number) => {
    const t = (time / 1000) % 10;
    // 0 healthy, 1 fault, 2 remediation, 3 verified
    const phase = t < 3.2 ? 0 : t < 5.2 ? 1 : t < 7.4 ? 2 : t < 8.8 ? 3 : 0;
    setFleetPhase(phase as 0 | 1 | 2 | 3);
    const rc = new THREE.Color();
    const lc = new THREE.Color();
    if (phase === 0) {
      rc.copy(white);
      lc.copy(PAPER).multiplyScalar(0.8);
    } else if (phase === 1) {
      const blink = Math.sin(time * 0.04) > 0 ? 1 : 0.15;
      rc.copy(white).lerp(tintRed, Math.min(1, (t - 3.2) * 2));
      lc.copy(hot).multiplyScalar(blink);
    } else if (phase === 2) {
      rc.copy(tintRed).lerp(white, Math.max(0, (t - 6.4) / 1.0) * 0.5);
      lc.copy(hot).lerp(PAPER, 0.35 + 0.35 * Math.sin(time * 0.012));
      // the fix travels from the control card to the node
      const p = Math.min(1, (t - 5.2) / 1.6);
      const from = fleet.worldToLocal(card.getWorldPosition(new THREE.Vector3()));
      remedy.position.set(
        THREE.MathUtils.lerp(from.x, unit[0] + 0.42, p),
        THREE.MathUtils.lerp(from.y, unit[1], p) + Math.sin(p * Math.PI) * 1.4,
        THREE.MathUtils.lerp(from.z, unit[2], p),
      );
    } else {
      const f = Math.max(0, 1 - (t - 7.4) / 1.4);
      rc.copy(white).lerp(tintRed, f * 0.4);
      lc.copy(new THREE.Color(1.6, 1.6, 1.6)).lerp(PAPER, 1 - f);
    }
    remedy.visible = phase === 2 && t - 5.2 < 1.7;
    racks.setColorAt(unitIdx, rc);
    leds.setColorAt(unitIdx, lc);
    if (racks.instanceColor) racks.instanceColor.needsUpdate = true;
    if (leds.instanceColor) leds.instanceColor.needsUpdate = true;
  };
  fleet.position.set(0, 0, -9);

  // ---------------- Lid screen (the hero, printed on the inside of the lid) ----------------
  const objects = new Map<number, CSS3DObject>();

  const syncObjects = () => {
    for (const p of listPanels()) {
      if (objects.has(p.shot)) continue;
      const obj = new CSS3DObject(p.host);
      obj.position.set(0, -0.012, 1.3);
      obj.rotation.x = Math.PI / 2;
      obj.scale.setScalar(4.4 / lidSize().w);
      lidPivot.add(obj);
      objects.set(p.shot, obj);
    }
  };

  const layoutPanels = (f: number, lidA: number) => {
    syncObjects();
    for (const p of listPanels()) {
      const obj = objects.get(p.shot);
      if (!obj) continue;
      obj.scale.setScalar(4.4 / lidSize().w);
      const weight = lidA < 0.5 ? 0 : THREE.MathUtils.clamp(1.4 - 2 * Math.abs(f - p.shot), 0, 1);
      p.host.style.opacity = String(weight);
      p.host.style.visibility = weight < 0.02 ? 'hidden' : 'visible';
      p.host.style.pointerEvents = weight > 0.6 ? 'auto' : 'none';
    }
  };

  // ---------------- State ----------------
  let cur: Vec | null = null;
  let target: Vec | null = null;
  let lastTime = 0;
  let seenTick = getInferenceLive().tick;
  let waveStart = -1e9;
  let waveDur = 120;
  let waveIdle = true;
  let fanTarget = 0;
  let fanSpeed = 0;
  let wideView = true;
  let curF = 0;
  let targetF = 0;
  let motion = true;
  let raf = 0;
  let running = true;
  let lastW = 0;
  let lastH = 0;
  const pointer = { x: 0, y: 0 };
  const smoothPointer = { x: 0, y: 0 };
  const lookAt = new THREE.Vector3();

  const place = (v: Vec, time: number, f: number) => {
    const [cx, cy, cz, tx, ty, tz, lidA, rise, boxOut, sh, he, side, yaw, fl, , , , power] = v;
    // Ignition: the engine catches (rumble) as power passes ~0.35, just before the lid lifts.
    const rumble = motion ? Math.max(0, 1 - Math.abs(power - 0.32) / 0.22) * 0.014 : 0;
    // Narrow screens see less of the world sideways, so back the camera off to keep the whole object in frame.
    const aspect = (lastW || canvas.clientWidth) / Math.max(lastH || canvas.clientHeight, 1);
    const pull = aspect < 1 ? 1 + (1 - aspect) * 0.9 : 1;
    camera.position.set(
      tx + (cx - tx) * pull + smoothPointer.x * 0.18 + rumble * (Math.sin(time * 0.09) + Math.sin(time * 0.173)),
      ty + (cy - ty) * pull + smoothPointer.y * 0.12 + rumble * Math.sin(time * 0.121),
      tz + (cz - tz) * pull,
    );
    lookAt.set(tx, ty, tz);
    camera.lookAt(lookAt);
    const w = lastW || canvas.clientWidth;
    const h = lastH || canvas.clientHeight;
    // The subject sits right of centre on wide screens and low on narrow ones. The CSS 3D renderer honours the same view offset.
    const shiftX = wideView ? side * w * 0.25 : 0;
    const shiftY = wideView ? 0 : -Math.abs(side) * h * 0.16;
    camera.setViewOffset(w, h, -shiftX, -shiftY, w, h);
    camera.updateMatrixWorld();

    // Choreography: seam lights, walls unfold like petals, the lid levitates and tilts up into a screen.
    const clamp01 = (x: number) => THREE.MathUtils.clamp(x, 0, 1);
    const outCubic = (x: number) => 1 - Math.pow(1 - x, 3);
    const uF = outCubic(clamp01((lidA - 0.12) / 0.5));
    const uS = outCubic(clamp01((lidA - 0.17) / 0.5));
    const uB = outCubic(clamp01((lidA - 0.22) / 0.5));
    pFront.rotation.x = uF * 1.5;
    pBack.rotation.x = -uB * 1.5;
    pLeft.rotation.z = uS * 1.5;
    pRight.rotation.z = -uS * 1.5;
    const t = clamp01((lidA - 0.4) / 0.6);
    const lidE = 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
    lidPivot.rotation.x = -lidE * 1.9;
    lidPivot.position.y = lidE * 0.45;
    ringMat.opacity = uF * (0.55 + (motion ? 0.25 * Math.sin(time * 0.004) : 0)) * (1 - clamp01((boxOut - 0.2) / 0.3));
    ring.scale.setScalar(1 + (motion ? 0.015 * Math.sin(time * 0.004) : 0));
    spot.intensity = 130 * uF * (0.5 + 0.5 * power) * (1 - clamp01((boxOut - 0.5) / 0.5) * 0.4);
    box.position.y = -boxOut * 3;
    box.visible = boxOut < 0.98;
    const bob = motion ? Math.sin(time * 0.0012) * 0.025 * rise : 0;
    card.position.y = THREE.MathUtils.lerp(-0.5, 0.9, rise) + bob;
    card.rotation.y = yaw;
    const rodTop = card.position.y - 0.09 - box.position.y;
    const rodLen = Math.max(rodTop + 0.585, 0.001);
    rods.forEach((r) => {
      r.visible = rise > 0.02 && boxOut < 0.6;
      r.scale.y = rodLen;
      r.position.y = -0.585 + rodLen / 2;
    });
    shroud.position.y = sh * 1.75;
    heat.position.y = he * 0.9;
    fleet.visible = fl > 0.01;
    if (fl > 0.05) fleetClock(time);
    fleet.position.z = THREE.MathUtils.lerp(-16, -9, fl);
    fleet.position.y = THREE.MathUtils.lerp(-4, -0.5, fl);
    key.position.x = 3.5 + yaw * 2;
    card.updateMatrixWorld(true);
    lidPivot.updateMatrixWorld(true);
    layoutPanels(f, lidE);

    const flow = he > 0.5;
    dots.visible = flow;
    if (flow) {
      chipPos.forEach(([x, z], i) => {
        const p = (time * 0.0007 + i / chipPos.length) % 1;
        tmp.position.set(THREE.MathUtils.lerp(x, DIE[0], p), 0.07, THREE.MathUtils.lerp(z, DIE[1], p));
        tmp.scale.setScalar(0.5 + Math.sin(p * Math.PI) * 0.8);
        tmp.updateMatrix();
        dots.setMatrixAt(i, tmp.matrix);
      });
      dots.instanceMatrix.needsUpdate = true;
    }
    // The die plays one sweep per real inference, as long as that inference took (stretched so a 20 ms run is visible).
    const live = getInferenceLive();
    if (live.tick !== seenTick) {
      seenTick = live.tick;
      waveStart = time;
      waveDur = THREE.MathUtils.clamp(live.lastMs * 4, 140, 1600);
    }
    const wp = (time - waveStart) / waveDur;
    let waveBoost = 0;
    if (wp >= 0 && wp <= 1.15 && motion) {
      die.draw(Math.min(wp, 1.15));
      waveIdle = false;
      waveBoost = Math.sin(Math.min(wp, 1) * Math.PI) * 0.6;
    } else if (!waveIdle) {
      die.draw(null);
      waveIdle = true;
    }
    dieMat.emissiveIntensity = 0.1 + 0.45 * power + waveBoost + (motion ? Math.sin(time * 0.003) * 0.2 * power : 0);

    // Power-up: standby breath on the ring, seam light with a start-up stutter, shift lights climbing, light spilling out.
    const ign = THREE.MathUtils.clamp(lidA / 0.35, 0, 1);
    const stutter = motion && ign > 0 && ign < 1 ? 0.55 + 0.45 * Math.abs(Math.sin(time * 0.05) * Math.sin(time * 0.017)) : 1;
    const standby = motion ? 0.35 + 0.25 * Math.sin(time * 0.0022) : 0.4;
    lidTop.emissiveIntensity = THREE.MathUtils.lerp(standby, 1.3, ign) * stutter;
    seam.emissiveIntensity = ign * 2.4 * stutter;
    accent.emissiveIntensity = 0.12 + 1.6 * power * (power < 1 ? stutter : 1);
    shiftLights.forEach((m, i) => {
      const on = THREE.MathUtils.clamp(power * SEGMENTS * 1.05 - i, 0, 1);
      m.emissiveIntensity = on * 2.2;
      m.emissive.set(i >= SEGMENTS * 0.8 ? '#ffd9c9' : ACCENT);
    });
    glow.intensity = 26 * THREE.MathUtils.clamp(uF * 1.4, 0, 1) * (0.55 + 0.45 * power) * (0.9 + (motion ? 0.1 * Math.sin(time * 0.01) : 0));
    rim.intensity = 5 + 9 * power;
    fanTarget = motion ? power * power * 9 : 0;
  };

  const draw = (time: number) => {
    if (!cur || !target) return;
    // Frame-rate independent smoothing: the camera eases toward the scroll target with a ~140 ms time constant.
    const dt = Math.min(Math.max(time - lastTime, 0), 250);
    lastTime = time;
    const k = motion ? 1 - Math.exp(-dt / 140) : 1;
    for (let i = 0; i < cur.length; i++) cur[i] += (target[i] - cur[i]) * k;
    curF += (targetF - curF) * k;
    const kp = 1 - Math.exp(-dt / 320);
    smoothPointer.x += (pointer.x - smoothPointer.x) * kp;
    smoothPointer.y += (pointer.y - smoothPointer.y) * kp;
    // The fans have inertia: they spool up after the scroll and keep spinning briefly when you scroll back.
    fanSpeed += (fanTarget - fanSpeed) * (1 - Math.exp(-dt / 700));
    fans.forEach((f, i) => (f.rotation.y -= (fanSpeed * (1 + i * 0.06) * dt) / 1000));
    place(cur, time, curF);
    renderer.render(scene, camera);
    css.render(scene, camera);
  };

  const loop = (time: number) => {
    raf = requestAnimationFrame(loop);
    if (running) draw(time);
  };

  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * -2;
  };
  const onVisibility = () => (running = !document.hidden);

  const api: GpuScene = {
    apply: (v, wide, f) => {
      wideView = wide;
      target = v.slice();
      targetF = f;
      if (!cur) {
        cur = v.slice();
        curF = f;
      }
      if (!motion) draw(performance.now());
    },
    project: (a) => {
      const w = lastW || canvas.clientWidth;
      const h = lastH || canvas.clientHeight;
      const p = card.localToWorld(new THREE.Vector3(...a)).project(camera);
      return [(p.x * 0.5 + 0.5) * w, (-p.y * 0.5 + 0.5) * h];
    },
    resize: () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      lastW = w;
      lastH = h;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 700 ? 1.5 : 2));
      renderer.setSize(w, h, false);
      css.setSize(w, h);
      camera.aspect = w / h;
      camera.fov = w / h < 0.8 ? 46 : 32;
      camera.updateProjectionMatrix();
      if (!motion) draw(performance.now());
    },
    setMotion: (on) => {
      motion = on;
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
      });
      setWorldActive(false);
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };

  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  api.resize();
  syncObjects();
  setWorldActive(true);
  raf = requestAnimationFrame(loop);
  return api;
};
