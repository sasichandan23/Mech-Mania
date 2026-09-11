// Mechanical Sound Synthesizer using Web Audio API
// Procedural audio generation: Zero external assets needed, 100% reliable, offline-ready.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const storedMute = localStorage.getItem("mech_mania_muted");
      this.isMuted = storedMute === "true";

      // Mobile Safari / Chrome AudioContext gesture unlock
      const unlock = () => {
        this.unlockAudio();
        window.removeEventListener("touchstart", unlock);
        window.removeEventListener("touchend", unlock);
        window.removeEventListener("click", unlock);
      };
      window.addEventListener("touchstart", unlock, { passive: true, once: true });
      window.addEventListener("touchend", unlock, { passive: true, once: true });
      window.addEventListener("click", unlock, { passive: true, once: true });
    }
  }

  public unlockAudio() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("mech_mania_muted", String(this.isMuted));
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Button click / UI gear thud
  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Countdown beep (3, 2, 1)
  public playCountdownBeep(isFinal: boolean = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isFinal ? "sawtooth" : "sine";
    const freq = isFinal ? 880 : 440;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isFinal ? 0.4 : 0.2));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + (isFinal ? 0.4 : 0.2));
  }

  // Correct answer chime (Bright ascending harmonic chord)
  public playCorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.06);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + index * 0.06);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + index * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + index * 0.06);
      osc.stop(this.ctx.currentTime + index * 0.06 + 0.25);
    });
  }

  // Wrong answer buzzer (Mechanical harsh buzz)
  public playWrong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);
  }

  // Power-up activation (Synthesized sci-fi charge)
  public playPowerUp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Streak bonus chime (High excitement arpeggio)
  public playStreak() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [659.25, 830.61, 987.77, 1318.51];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.05);
      osc.stop(this.ctx.currentTime + idx * 0.05 + 0.2);
    });
  }

  // Boss Warning Klaxon (Industrial alarm)
  public playBossAlarm() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    for (let i = 0; i < 3; i++) {
      const startTime = this.ctx.currentTime + i * 0.35;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(600, startTime);
      osc.frequency.linearRampToValueAtTime(350, startTime + 0.28);

      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.28);
    }
  }

  // Level Complete fanfare
  public playLevelUp() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const chords = [440, 554.37, 659.25, 880];
    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.4);
    });
  }

  // V8 Engine Ignition, Burnout & Launch Nitro SFX
  public playCarBurnoutLaunch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Starter motor cranking (0.0s - 0.6s)
    const starterOsc = this.ctx.createOscillator();
    const starterGain = this.ctx.createGain();
    starterOsc.type = "sawtooth";
    starterOsc.frequency.setValueAtTime(65, t);
    starterOsc.frequency.linearRampToValueAtTime(130, t + 0.35);
    starterOsc.frequency.exponentialRampToValueAtTime(260, t + 0.6);

    starterGain.gain.setValueAtTime(0.2, t);
    starterGain.gain.linearRampToValueAtTime(0.28, t + 0.35);
    starterGain.gain.exponentialRampToValueAtTime(0.01, t + 0.65);

    starterOsc.connect(starterGain);
    starterGain.connect(this.ctx.destination);
    starterOsc.start(t);
    starterOsc.stop(t + 0.65);

    // 2. Engine V8 idle & heavy rumble (0.35s - 2.5s)
    const v8Osc = this.ctx.createOscillator();
    const v8Gain = this.ctx.createGain();
    v8Osc.type = "sawtooth";
    v8Osc.frequency.setValueAtTime(65, t + 0.35);
    v8Osc.frequency.linearRampToValueAtTime(95, t + 0.8);
    v8Osc.frequency.exponentialRampToValueAtTime(220, t + 1.4);
    v8Osc.frequency.exponentialRampToValueAtTime(460, t + 2.0);

    v8Gain.gain.setValueAtTime(0.0, t + 0.35);
    v8Gain.gain.linearRampToValueAtTime(0.35, t + 0.55);
    v8Gain.gain.setValueAtTime(0.35, t + 1.5);
    v8Gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

    v8Osc.connect(v8Gain);
    v8Gain.connect(this.ctx.destination);
    v8Osc.start(t + 0.35);
    v8Osc.stop(t + 2.5);

    // 3. Tire Burnout Screech / Friction Squeal (0.7s - 1.7s)
    const screechOsc = this.ctx.createOscillator();
    const screechGain = this.ctx.createGain();
    screechOsc.type = "triangle";
    screechOsc.frequency.setValueAtTime(1800, t + 0.7);
    screechOsc.frequency.linearRampToValueAtTime(2300, t + 1.0);
    screechOsc.frequency.linearRampToValueAtTime(1600, t + 1.35);
    screechOsc.frequency.linearRampToValueAtTime(2600, t + 1.7);

    screechGain.gain.setValueAtTime(0.0, t + 0.7);
    screechGain.gain.linearRampToValueAtTime(0.22, t + 0.85);
    screechGain.gain.linearRampToValueAtTime(0.28, t + 1.3);
    screechGain.gain.exponentialRampToValueAtTime(0.001, t + 1.75);

    screechOsc.connect(screechGain);
    screechGain.connect(this.ctx.destination);
    screechOsc.start(t + 0.7);
    screechOsc.stop(t + 1.75);

    // 4. White Noise for tire smoke & exhaust hiss (0.65s - 2.2s)
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 2.2);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, t + 0.65);
      filter.frequency.linearRampToValueAtTime(2800, t + 1.3);
      filter.frequency.exponentialRampToValueAtTime(500, t + 2.2);
      filter.Q.setValueAtTime(2.5, t + 0.65);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0, t + 0.65);
      noiseGain.gain.linearRampToValueAtTime(0.25, t + 0.95);
      noiseGain.gain.setValueAtTime(0.28, t + 1.4);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(t + 0.65);
      noise.stop(t + 2.2);
    } catch {
      // Noise buffer fallback
    }

    // 5. Nitro Boost & Speed Zoom Launch Whoosh (1.65s - 2.5s)
    const nitroOsc = this.ctx.createOscillator();
    const nitroGain = this.ctx.createGain();
    nitroOsc.type = "sine";
    nitroOsc.frequency.setValueAtTime(320, t + 1.65);
    nitroOsc.frequency.exponentialRampToValueAtTime(1400, t + 2.0);
    nitroOsc.frequency.exponentialRampToValueAtTime(90, t + 2.5);

    nitroGain.gain.setValueAtTime(0.0, t + 1.65);
    nitroGain.gain.linearRampToValueAtTime(0.35, t + 1.9);
    nitroGain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

    nitroOsc.connect(nitroGain);
    nitroGain.connect(this.ctx.destination);
    nitroOsc.start(t + 1.65);
    nitroOsc.stop(t + 2.5);
  }
}

export const sounds = new SoundEngine();
