/** Effets visuels (canvas) et mélodie « music box » — aucune dépendance externe. */
type P = { x: number; y: number; vx: number; vy: number; l: number; m: number; c: string; s: number; g: number; k: 'c' | 'f'; r: number };

export class Fx {
  private ctx: CanvasRenderingContext2D;
  private ps: P[] = [];
  private raf = 0;
  constructor(private cv: HTMLCanvasElement) {
    this.ctx = cv.getContext('2d')!;
    this.resize();
    addEventListener('resize', this.resize);
  }
  private resize = () => {
    const d = devicePixelRatio || 1;
    this.cv.width = innerWidth * d; this.cv.height = innerHeight * d;
    this.ctx.setTransform(d, 0, 0, d, 0, 0);
  };
  /** Confettis qui jaillissent d'un point. */
  confetti(x: number, y: number, n = 90): void {
    const cols = ['#ffc857', '#ff6f91', '#7ee7c7', '#8ab4ff', '#fff3e2'];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - .5) * 1.8, v = 6 + Math.random() * 9;
      this.ps.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 0, m: 120 + Math.random() * 80, c: cols[i % 5], s: 5 + Math.random() * 6, g: .22, k: 'c', r: Math.random() * 6 });
    }
    this.start();
  }
  /** Un bouquet de feu d'artifice. */
  burst(x: number, y: number): void {
    const h = Math.random() * 360;
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2, v = 2 + Math.random() * 4;
      this.ps.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 0, m: 60 + Math.random() * 30, c: `hsl(${h + Math.random() * 40} 100% 65%)`, s: 2.2, g: .05, k: 'f', r: 0 });
    }
    this.start();
  }
  /** Série de feux d'artifice. */
  show(): void {
    for (let i = 0; i < 7; i++) setTimeout(() => this.burst(innerWidth * (.15 + Math.random() * .7), innerHeight * (.15 + Math.random() * .4)), i * 420);
  }
  private start(): void { if (!this.raf) this.raf = requestAnimationFrame(this.loop); }
  private loop = () => {
    const c = this.ctx;
    c.clearRect(0, 0, innerWidth, innerHeight);
    this.ps = this.ps.filter(p => p.l < p.m && p.y < innerHeight + 30);
    for (const p of this.ps) {
      p.l++; p.vx *= .985; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += .15;
      c.globalAlpha = Math.max(0, 1 - p.l / p.m);
      c.fillStyle = p.c;
      if (p.k === 'c') { c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore(); }
      else { c.beginPath(); c.arc(p.x, p.y, p.s, 0, 7); c.fill(); }
    }
    c.globalAlpha = 1;
    this.raf = this.ps.length ? requestAnimationFrame(this.loop) : 0;
  };
  destroy(): void { cancelAnimationFrame(this.raf); removeEventListener('resize', this.resize); }
}

/** Joue « Joyeux anniversaire » (domaine public) avec un timbre de boîte à musique. Retourne la durée en secondes. */
export function playMelody(ac: AudioContext): number {
  const N: Record<string, number> = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 };
  const seq: [string, number][] = [
    ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
    ['G4', .75], ['G4', .25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
    ['G4', .75], ['G4', .25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 1],
    ['F5', .75], ['F5', .25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
  ];
  let t = ac.currentTime + .2;
  const beat = .42;
  for (const [n, b] of seq) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'triangle'; o.frequency.value = N[n];
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.22, t + .02);
    g.gain.exponentialRampToValueAtTime(.0008, t + b * 1.8);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + b * 1.9);
    t += b * beat;
  }
  return t - ac.currentTime;
}
