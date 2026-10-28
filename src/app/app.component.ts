import { Component, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { BIRTHDAY } from './birthday.config';
import { Fx, playMelody } from './fx';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  readonly b = BIRTHDAY;
  @ViewChild('fx', { static: true }) fxRef!: ElementRef<HTMLCanvasElement>;

  stage: 'cake' | 'dark' | 'party' = 'cake';
  lit = false;      // bougies allumées
  ready = false;    // mélodie terminée : on peut souffler
  blown = false;    // bougies soufflées
  micOn = false;
  micAttempted = false;
  micMessage = '';
  cutOk = false;    // le portrait détouré est bien chargé
  rx = 0; ry = 0;   // inclinaison de la boîte
  musicOn = false;
  readonly rowA = [...BIRTHDAY.media, ...BIRTHDAY.media];
  readonly rowB = [...BIRTHDAY.media].reverse().concat([...BIRTHDAY.media].reverse());
  popped: boolean[] = BIRTHDAY.wishes.map(() => false);

  private forced = BIRTHDAY.allowPreview ? new URLSearchParams(location.search).get('preview') : null;
  private remaining = this.left();
  private wasOpen = this.isOpen;
  private fx!: Fx;
  private ac?: AudioContext;
  private stream?: MediaStream;
  private raf = 0;
  private song?: HTMLAudioElement;
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.fx = new Fx(this.fxRef.nativeElement);
    const timer = window.setInterval(() => this.tick(), 1000);
    this.destroyRef.onDestroy(() => { clearInterval(timer); this.fx.destroy(); this.stopMic(); });
  }

  private left(): number { return Math.floor((new Date(BIRTHDAY.celebrationAt).getTime() - Date.now()) / 1000); }

  /** Le jour J (et après), l'expérience complète s'ouvre ; avant, on reste sur le compte à rebours. */
  get isOpen(): boolean {
    if (this.forced === 'jour') return true;
    if (this.forced === 'avant') return false;
    return this.remaining <= 0;
  }

  private tick(): void {
    this.remaining = this.left();
    if (!this.wasOpen && this.isOpen) { this.wasOpen = true; this.fx.show(); } // le compte à rebours atteint zéro en direct
  }

  get countdown() {
    const t = Math.max(0, this.remaining);
    return [
      { value: Math.floor(t / 86400), label: 'jours' },
      { value: Math.floor((t % 86400) / 3600), label: 'heures' },
      { value: Math.floor((t % 3600) / 60), label: 'minutes' },
      { value: t % 60, label: 'secondes' },
    ];
  }
  get days(): number { return Math.max(0, Math.ceil(this.remaining / 86400)); }
  /** La photo du teaser devient plus nette à mesure que le jour approche. */
  get teaserBlur(): number { return 6 + Math.max(0, Math.min(1, this.remaining / 86400 / 30)) * 20; }
  pad(n: number): string { return String(n).padStart(2, '0'); }

  // ---------- Gâteau ----------
  light(): void {
    if (this.lit) return;
    this.lit = true;
    let secs = 8;
    try { this.ac = new AudioContext(); secs = playMelody(this.ac); } catch { /* pas d'audio */ }
    setTimeout(() => { this.ready = true; }, secs * 1000 + 300);
  }

  /** Le micro ne démarre qu'après la mélodie, au clic volontaire sur le bouton de souffle. */
  async beginBlow(): Promise<void> {
    if (this.micOn || this.micAttempted) { this.blow(); return; }
    this.micAttempted = true;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone indisponible.');
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ac = this.ac ?? new AudioContext();
      if (ac.state === 'suspended') await ac.resume();
      const an = ac.createAnalyser();
      an.fftSize = 1024;
      an.smoothingTimeConstant = 0.15;
      ac.createMediaStreamSource(this.stream).connect(an);
      const buf = new Uint8Array(an.fftSize);
      let hits = 0;
      let warmupFrames = 0;
      this.micOn = true;
      this.micMessage = 'Souffle vers le téléphone, ou touche le bouton pour continuer.';
      const loop = () => {
        an.getByteTimeDomainData(buf);
        let sum = 0;
        for (const value of buf) sum += (value - 128) ** 2;
        const level = Math.sqrt(sum / buf.length) / 128;
        warmupFrames++;
        hits = warmupFrames > 12 && level > 0.075 ? hits + 1 : 0;
        if (hits > 10) { this.blow(); return; }
        this.raf = requestAnimationFrame(loop);
      };
      loop();
    } catch {
      this.stopMic();
      this.micOn = false;
      this.micMessage = 'Micro indisponible ou refusé. Touche le bouton pour souffler sans micro.';
    }
  }

  private stopMic(): void {
    cancelAnimationFrame(this.raf);
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;
    this.micOn = false;
  }

  cakeTap(): void {
    if (!this.lit) this.light();
    else if (this.ready) this.blow();
  }

  blow(): void {
    if (!this.lit || !this.ready || this.blown) return;
    this.blown = true;
    this.stopMic();
    setTimeout(() => this.stage = 'dark', 1200);
    setTimeout(() => {
      this.stage = 'party';
      this.playSong();
      scrollTo(0, 0);
      this.fx.show();
      this.fx.confetti(innerWidth / 2, innerHeight, 160);
    }, 3000);
  }

  more(): void { this.fx.confetti(innerWidth / 2, innerHeight, 120); }

  replay(): void {
    this.stage = 'cake'; this.lit = this.ready = this.blown = false;
    this.micAttempted = false; this.micMessage = '';
    this.popped = this.popped.map(() => false);
    scrollTo(0, 0);
  }

  // ---------- Fête ----------
  pop(i: number, e: MouseEvent): void { this.popped[i] = true; this.fx.confetti(e.clientX, e.clientY, 45); }
  /** Penche la boîte de poupée selon la souris / le doigt. */
  tilt(e: PointerEvent): void { this.ry = (e.clientX / innerWidth - .5) * 16; this.rx = -(e.clientY / innerHeight - .5) * 10; }
  isVideo(src: string): boolean { return /\.(mp4|webm|mov)$/i.test(src); }
  playSong(): void {
    if (!this.b.music) return;
    this.song ??= Object.assign(new Audio(this.b.music), { loop: true, volume: .6 });
    this.song.play().then(() => this.musicOn = true).catch(() => this.musicOn = false);
  }
  toggleMusic(): void { if (this.musicOn) { this.song?.pause(); this.musicOn = false; } else this.playSong(); }
  imageFailed(e: Event): void { (e.target as HTMLElement).hidden = true; }
}
