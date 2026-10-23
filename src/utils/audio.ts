/**
 * Audio synthesis using Web Audio API and Web Speech API.
 * 100% self-contained: no external audio dependencies, no CORS/404 issues,
 * runs instantly in any modern browser.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private melodyIndex = 0;
  private isMuted = false;
  private volume = 0.5;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.isMuted ? 0 : this.volume * 0.25;
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.isMuted ? 0 : this.volume;
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && !this.isMuted) {
      this.bgmGain.gain.value = this.volume * 0.25;
    }
    if (this.sfxGain && !this.isMuted) {
      this.sfxGain.gain.value = this.volume;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : this.volume * 0.25;
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cheerful pentatonic music-box / marimba melody for young kids
  public startBGM() {
    this.initCtx();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.playMelodyLoop();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public isMusicOn(): boolean {
    return this.isBgmPlaying;
  }

  private playMelodyLoop() {
    if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

    // Happy Nursery Pentatonic scale: C4, D4, E4, G4, A4, C5, D5, E5
    const notes: number[] = [
      261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 392.00, 329.63,
      293.66, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 261.63,
      329.63, 392.00, 523.25, 587.33, 523.25, 440.00, 392.00, 329.63,
      392.00, 440.00, 523.25, 659.25, 523.25, 392.00, 329.63, 261.63
    ];

    const freq = notes[this.melodyIndex % notes.length];
    this.melodyIndex++;

    this.playMusicBoxNote(freq, 0.45);

    // Also gentle bass pulse on beat
    if (this.melodyIndex % 4 === 1) {
      const bassFreq = freq * 0.5;
      this.playBassNote(bassFreq, 0.7);
    }

    const stepMs = 380; // Relaxing, cheerful tempo ~ 158 bpm eighth notes
    this.bgmTimer = window.setTimeout(() => {
      this.playMelodyLoop();
    }, stepMs);
  }

  private playMusicBoxNote(freq: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  private playBassNote(freq: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Cute pop sound for cake click
  public playPop() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Water splash sound when cake is in the lake
  public playSplash() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // Multi-tone water bubble effect
    [650, 850, 1100].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + idx * 0.04 + 0.08);

      gain.gain.setValueAtTime(0.22, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.12);
    });
  }

  // Grass leaf rustle / sparkle when cake is in the field
  public playGrassChime() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.03);

      gain.gain.setValueAtTime(0.18, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.03);
      osc.stop(now + idx * 0.03 + 0.18);
    });
  }

  // Star fanfare on round win or milestone
  public playFanfare() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.25, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  }
}

export const soundManager = new SoundController();

/**
 * Speech synthesis helper for clear, friendly English pronunciation
 */
export function speakWord(text: string, rate: number = 0.9) {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel(); // cancel previous unfinished speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate; // slightly slower for young learners
  utterance.pitch = 1.15; // slightly higher friendly cheerful pitch

  // Pick high-quality English voice if available
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => 
    (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))) ||
    v.lang === 'en-US'
  ) || voices.find(v => v.lang.startsWith('en'));

  if (enVoice) {
    utterance.voice = enVoice;
  }

  window.speechSynthesis.speak(utterance);
}
