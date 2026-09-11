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
    this.isMuted = false; // Always force audio active for high-octane intro
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.85, t);
    master.connect(this.ctx.destination);

    // Stage 1: Engine Starter Cranking (0.6s - 1.4s)
    const starterOsc = this.ctx.createOscillator();
    const starterGain = this.ctx.createGain();
    starterOsc.type = "sawtooth";
    starterOsc.frequency.setValueAtTime(60, t + 0.6);
    starterOsc.frequency.linearRampToValueAtTime(140, t + 1.0);
    starterOsc.frequency.exponentialRampToValueAtTime(320, t + 1.4);

    starterGain.gain.setValueAtTime(0.0, t + 0.6);
    starterGain.gain.linearRampToValueAtTime(0.35, t + 0.8);
    starterGain.gain.exponentialRampToValueAtTime(0.01, t + 1.45);

    starterOsc.connect(starterGain);
    starterGain.connect(master);
    starterOsc.start(t + 0.6);
    starterOsc.stop(t + 1.45);

    // Stage 2: Deep V8 Throttle & Aggressive Revving (1.4s - 2.3s)
    const v8Osc = this.ctx.createOscillator();
    const v8Gain = this.ctx.createGain();
    v8Osc.type = "sawtooth";
    v8Osc.frequency.setValueAtTime(75, t + 1.2);
    v8Osc.frequency.linearRampToValueAtTime(180, t + 1.6);
    v8Osc.frequency.exponentialRampToValueAtTime(420, t + 2.1);
    v8Osc.frequency.linearRampToValueAtTime(260, t + 2.3);

    v8Gain.gain.setValueAtTime(0.0, t + 1.2);
    v8Gain.gain.linearRampToValueAtTime(0.45, t + 1.4);
    v8Gain.gain.setValueAtTime(0.45, t + 2.2);
    v8Gain.gain.exponentialRampToValueAtTime(0.01, t + 2.35);

    v8Osc.connect(v8Gain);
    v8Gain.connect(master);
    v8Osc.start(t + 1.2);
    v8Osc.stop(t + 2.35);

    // Stage 3: Tire Burnout Squeal & Friction Screech (2.3s - 3.8s)
    const screechOsc = this.ctx.createOscillator();
    const screechGain = this.ctx.createGain();
    screechOsc.type = "triangle";
    screechOsc.frequency.setValueAtTime(1900, t + 2.3);
    screechOsc.frequency.linearRampToValueAtTime(2500, t + 2.8);
    screechOsc.frequency.linearRampToValueAtTime(1800, t + 3.2);
    screechOsc.frequency.linearRampToValueAtTime(2800, t + 3.8);

    screechGain.gain.setValueAtTime(0.0, t + 2.3);
    screechGain.gain.linearRampToValueAtTime(0.38, t + 2.5);
    screechGain.gain.setValueAtTime(0.4, t + 3.5);
    screechGain.gain.exponentialRampToValueAtTime(0.001, t + 3.85);

    screechOsc.connect(screechGain);
    screechGain.connect(master);
    screechOsc.start(t + 2.3);
    screechOsc.stop(t + 3.85);

    // Stage 3: White Noise for tire smoke & exhaust hiss (2.3s - 4.0s)
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 2.0);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, t + 2.3);
      filter.frequency.linearRampToValueAtTime(3200, t + 3.0);
      filter.frequency.exponentialRampToValueAtTime(600, t + 3.9);
      filter.Q.setValueAtTime(3.0, t + 2.3);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0, t + 2.3);
      noiseGain.gain.linearRampToValueAtTime(0.38, t + 2.5);
      noiseGain.gain.setValueAtTime(0.38, t + 3.5);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 4.0);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(master);

      noise.start(t + 2.3);
      noise.stop(t + 4.0);
    } catch {}

    // Stage 4: Nitro Rocket Blast & Fast Speed Acceleration Whoosh (3.8s - 4.6s)
    const nitroOsc = this.ctx.createOscillator();
    const nitroGain = this.ctx.createGain();
    nitroOsc.type = "sawtooth";
    nitroOsc.frequency.setValueAtTime(380, t + 3.8);
    nitroOsc.frequency.exponentialRampToValueAtTime(1600, t + 4.2);
    nitroOsc.frequency.exponentialRampToValueAtTime(80, t + 4.6);

    nitroGain.gain.setValueAtTime(0.0, t + 3.8);
    nitroGain.gain.linearRampToValueAtTime(0.48, t + 4.0);
    nitroGain.gain.exponentialRampToValueAtTime(0.001, t + 4.6);

    nitroOsc.connect(nitroGain);
    nitroGain.connect(master);
    nitroOsc.start(t + 3.8);
    nitroOsc.stop(t + 4.6);
  }
}

export const sounds = new SoundEngine();
