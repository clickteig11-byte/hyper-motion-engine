import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Procedural Audio Synthesizer for "Google Gemini 2.0: Flash to Frontier"
 * 30.00s Launch Video @ 48kHz 16-Bit Stereo PCM WAV
 * 144 BPM Luminous Breakbeat, Crystal Chime Arpeggios, Resonant Synth Pads, Dynamic Stereo Whooshes
 */
export class GeminiAudioEngine {
  constructor(durationSeconds = 30.0, sampleRate = 48000) {
    this.duration = durationSeconds;
    this.sampleRate = sampleRate;
    this.totalSamples = Math.floor(durationSeconds * sampleRate);
    this.left = new Float32Array(this.totalSamples);
    this.right = new Float32Array(this.totalSamples);
  }

  addSample(idx, lVal, rVal = lVal) {
    if (idx >= 0 && idx < this.totalSamples) {
      this.left[idx] += lVal;
      this.right[idx] += rVal;
    }
  }

  // 1. Deep Analog Sub Kick Drum (140Hz -> 38Hz)
  addKick(startTime, startFreq = 140, endFreq = 38, duration = 0.28, gain = 0.95) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const freq = (startFreq - endFreq) * Math.exp(-t * 28) + endFreq;
      const env = Math.exp(-t * 11.0) * gain;
      const click = Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 160) * 0.35;
      const s = (Math.tanh(Math.sin(2 * Math.PI * freq * t) * 2.4) + click) * env;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 2. Crisp Metallic / Carbon Rimshot
  addRimshot(startTime, gain = 0.72) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.14 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 140);
      const tone1 = Math.sin(2 * Math.PI * 480 * t) * Math.exp(-t * 90);
      const tone2 = Math.sin(2 * Math.PI * 1850 * t) * Math.exp(-t * 190);
      const snap = Math.sin(2 * Math.PI * 3400 * t) * Math.exp(-t * 260);
      const s = (noise * 0.45 + tone1 * 0.35 + tone2 * 0.3 + snap * 0.5) * gain;
      this.addSample(startIdx + i, s * 0.92, s * 1.08);
    }
  }

  // 3. Tactile Kinetic Word Pop (Google Iridescent Accent)
  addWordPop(startTime, pitch = 2800, gain = 0.7, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.045 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 350);
      const tone = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 190);
      const sparkle = Math.sin(2 * Math.PI * (pitch * 2.25) * t) * Math.exp(-t * 280) * 0.45;
      const sub = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-t * 60) * 0.35;
      const s = (noise * 0.25 + tone * 0.55 + sparkle + sub) * gain;
      this.addSample(startIdx + i, s * (1 - pan * 0.5), s * (1 + pan * 0.5));
    }
  }

  // 4. Crystal Chime Note (Bell / Celestial Sparkle)
  addCrystalChime(startTime, freq = 1760, duration = 1.4, gain = 0.45, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 3.8) * gain;
      const f1 = Math.sin(2 * Math.PI * freq * t);
      const f2 = Math.sin(2 * Math.PI * (freq * 2.01) * t) * 0.45;
      const f3 = Math.sin(2 * Math.PI * (freq * 3.76) * t) * 0.25;
      const f4 = Math.sin(2 * Math.PI * (freq * 5.42) * t) * 0.15;
      const s = (f1 + f2 + f3 + f4) * env;
      this.addSample(startIdx + i, s * (1 - pan * 0.6), s * (1 + pan * 0.6));
    }
  }

  // 5. Crystal Chime Arpeggio (Upward Celestial Cascade)
  addChimeArpeggio(startTime, freqs = [587.33, 739.99, 880, 1174.66, 1479.98, 1760], interval = 0.09, gain = 0.35) {
    freqs.forEach((f, idx) => {
      const pan = -0.6 + (1.2 * idx) / (freqs.length - 1);
      this.addCrystalChime(startTime + idx * interval, f, 1.2, gain * (0.8 + idx * 0.05), pan);
    });
  }

  // 6. Resonant Iridescent Synth Pad (Gemini Chord Progression)
  addResonantPad(startTime, chordFreqs = [220, 277.18, 329.63, 440], duration = 4.0, gain = 0.55) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      // Smooth attack and release envelope
      const attack = Math.min(1.0, t / 0.5);
      const release = Math.max(0.0, (duration - t) / 0.8);
      const env = Math.sin(attack * Math.PI * 0.5) * Math.sin(Math.min(1.0, release) * Math.PI * 0.5) * gain;

      let sL = 0;
      let sR = 0;
      for (let j = 0; j < chordFreqs.length; j++) {
        const baseF = chordFreqs[j];
        // Slight detune for lush chorus / iridescent shimmer
        const detuneL = baseF * 0.997;
        const detuneR = baseF * 1.003;
        const sub = Math.sin(2 * Math.PI * baseF * 0.5 * t) * 0.3;
        const oL = Math.sin(2 * Math.PI * detuneL * t) + sub;
        const oR = Math.sin(2 * Math.PI * detuneR * t) + sub;
        const shimmer = Math.sin(2 * Math.PI * (baseF * 3.0) * t) * 0.08 * (1 + 0.3 * Math.sin(2 * Math.PI * 4 * t));
        sL += (oL + shimmer) * (1 / (j + 1.2));
        sR += (oR + shimmer) * (1 / (j + 1.2));
      }
      this.addSample(startIdx + i, Math.tanh(sL * 1.4) * env, Math.tanh(sR * 1.4) * env);
    }
  }

  // 7. Dynamic Stereo Whoosh / Tape Whip
  addWhipWhoosh(startTime, duration = 0.35, gain = 0.75, dir = 1) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const env = Math.sin(p * Math.PI);
      const noise = (Math.random() * 2 - 1);
      const center = 450 + Math.pow(p, 2.2) * 2600;
      const osc = Math.sin(2 * Math.PI * center * (i / this.sampleRate));
      const s = (noise * 0.65 + osc * 0.35) * Math.pow(env, 1.5) * gain;
      const pan = (p * 2 - 1) * dir;
      this.addSample(startIdx + i, s * (0.65 - pan * 0.45), s * (0.65 + pan * 0.45));
    }
  }

  // 8. Low-Frequency Sub-Bass Drop / Riser
  addSubDrop(startTime, startFreq = 160, endFreq = 35, duration = 1.2, gain = 0.8) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const p = i / count;
      const freq = (startFreq - endFreq) * Math.exp(-t * 4.2) + endFreq;
      const env = Math.sin(p * Math.PI) * gain;
      const s = Math.sin(2 * Math.PI * freq * t) * env;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 9. 144 BPM Driving Luminous Breakbeat
  addLuminousBreakbeat(startTime, endTime, bpm = 144) {
    const beatInterval = 60 / bpm; // ~0.41667s
    let t = startTime;
    let step = 0;

    // Bassline notes: D, F, G, A, C (Gemini D Minor Pentatonic groove)
    const bassline = [73.42, 73.42, 87.31, 98.00, 73.42, 87.31, 110.00, 130.81];

    while (t < endTime) {
      const beatInMeasure = step % 4;

      // Kick Pattern: Heavy on 1 and 3, syncopated ghost kick on 2.5
      if (beatInMeasure === 0) {
        this.addKick(t, 140, 38, 0.26, 0.95);
      } else if (beatInMeasure === 2) {
        this.addKick(t, 130, 40, 0.22, 0.88);
      } else if (step % 8 === 5) {
        // Syncopated ghost kick
        this.addKick(t, 110, 44, 0.16, 0.65);
      }

      // Snare / Rimshot on 2 and 4
      if (beatInMeasure === 1 || beatInMeasure === 3) {
        this.addRimshot(t, 0.75);
      }

      // 16th Note Hi-Hats & Shimmers
      for (let sub = 0; sub < 4; sub++) {
        const hatTime = t + sub * (beatInterval / 4);
        if (hatTime < endTime) {
          const isAccent = (sub === 2);
          const hatGain = isAccent ? 0.26 : (sub % 2 === 0 ? 0.18 : 0.11);
          const pan = (sub % 2 === 0) ? -0.28 : 0.28;
          const startIdx = Math.floor(hatTime * this.sampleRate);
          const count = Math.floor(0.022 * this.sampleRate);
          for (let k = 0; k < count; k++) {
            const hT = k / this.sampleRate;
            const noise = (Math.random() * 2 - 1) * Math.exp(-hT * 450);
            const metallic = Math.sin(2 * Math.PI * 9200 * hT) * Math.exp(-hT * 320);
            const s = (noise * 0.55 + metallic * 0.45) * hatGain;
            this.addSample(startIdx + k, s * (1 - pan * 0.4), s * (1 + pan * 0.4));
          }
        }
      }

      // Luminous Synth Sub-Bass
      const bassFreq = bassline[step % bassline.length];
      const startIdx = Math.floor(t * this.sampleRate);
      const noteCount = Math.floor(beatInterval * 0.86 * this.sampleRate);
      for (let i = 0; i < noteCount; i++) {
        const sTime = i / this.sampleRate;
        const fund = Math.sin(2 * Math.PI * bassFreq * sTime);
        const oct = Math.sin(2 * Math.PI * (bassFreq * 2) * sTime) * 0.38;
        const fifth = Math.sin(2 * Math.PI * (bassFreq * 3) * sTime) * 0.18;
        const env = Math.exp(-sTime * 4.2) * 0.45;
        const s = Math.tanh((fund + oct + fifth) * 1.5) * env;
        this.addSample(startIdx + i, s, s);
      }

      t += beatInterval;
      step++;
    }
  }

  // Master Normalization & Export
  exportWav(outputPath) {
    let peak = 0;
    for (let i = 0; i < this.totalSamples; i++) {
      if (Math.abs(this.left[i]) > peak) peak = Math.abs(this.left[i]);
      if (Math.abs(this.right[i]) > peak) peak = Math.abs(this.right[i]);
    }

    const norm = peak > 0.95 ? (0.95 / peak) : 1.0;
    console.log(`[GeminiAudio] Peak: ${peak.toFixed(3)}, Normalization factor: ${norm.toFixed(3)}`);

    const numChannels = 2;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = this.totalSamples * blockAlign;
    const header = Buffer.alloc(44);

    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataSize, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(this.sampleRate, 24);
    header.writeUInt32LE(this.sampleRate * blockAlign, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bytesPerSample * 8, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataSize, 40);

    const pcmData = Buffer.alloc(dataSize);
    let offset = 0;
    for (let i = 0; i < this.totalSamples; i++) {
      let sL = Math.tanh(this.left[i] * norm);
      let sR = Math.tanh(this.right[i] * norm);

      // Fade out last 40ms to eliminate clicks
      if (i > this.totalSamples - Math.floor(0.04 * this.sampleRate)) {
        const fade = (this.totalSamples - i) / (0.04 * this.sampleRate);
        sL *= fade;
        sR *= fade;
      }

      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sL * 0x7FFF))), offset);
      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sR * 0x7FFF))), offset + 2);
      offset += 4;
    }

    fs.writeFileSync(outputPath, Buffer.concat([header, pcmData]));
    console.log(`[GeminiAudio] Rendered master WAV -> ${outputPath}`);
  }
}

// Master Audio Composer for Google Gemini 2.0 Launch Video (30.00s Duration)
export function generateGeminiLaunchAudio(outputPath = path.join(__dirname, 'dist', 'soundtrack-gemini.wav')) {
  const engine = new GeminiAudioEngine(30.0, 48000);

  // 0.00s: Opening Hit & Celestial Chord
  engine.addResonantPad(0.00, [146.83, 220.0, 293.66, 369.99, 440.0], 4.5, 0.75); // D maj / sus chord
  engine.addChimeArpeggio(0.05, [739.99, 880, 1108.73, 1479.98, 1760], 0.08, 0.4);
  engine.addWordPop(0.00, 3200, 0.85);

  // ==========================================
  // ACT 1 (0.0s - 5.0s): "GEMINI 2.0." -> "FLASH TO FRONTIER."
  // ==========================================
  engine.addKick(0.35, 145, 38, 0.26, 0.95);   // "GEMINI"
  engine.addWordPop(0.35, 3400, 0.85, -0.2);

  engine.addRimshot(0.95, 0.85);               // "2.0."
  engine.addWordPop(0.95, 3600, 0.9, 0.2);

  engine.addKick(1.90, 135, 40, 0.24, 0.88);   // "FLASH"
  engine.addWordPop(1.90, 2800, 0.8, -0.2);

  engine.addRimshot(2.55, 0.82);               // "TO"
  engine.addWordPop(2.55, 3100, 0.8, 0.0);

  engine.addKick(3.30, 145, 36, 0.32, 1.0);    // "FRONTIER."
  engine.addWordPop(3.30, 3800, 0.95, 0.2);
  engine.addCrystalChime(3.30, 1760, 2.0, 0.5, 0.1);
  engine.addWhipWhoosh(4.30, 0.38, 0.8, 1);

  // ==========================================
  // 4.0s - 26.5s: Continuous 144 BPM Breakbeat
  // ==========================================
  engine.addLuminousBreakbeat(4.0, 26.5, 144);

  // ==========================================
  // ACT 2 (5.0s - 10.0s): Gemini 4-Point Star Bloom
  // ==========================================
  engine.addResonantPad(5.00, [196.0, 246.94, 293.66, 392.0, 493.88], 4.8, 0.7); // G Maj9
  engine.addKick(5.20, 140, 40, 0.26, 0.92);
  engine.addChimeArpeggio(5.20, [880, 1174.66, 1318.51, 1760, 2093.0], 0.08, 0.45);
  engine.addWordPop(5.20, 3600, 0.85, -0.3);

  engine.addRimshot(6.60, 0.82);
  engine.addWordPop(6.60, 3200, 0.8, 0.2);

  engine.addKick(7.80, 135, 42, 0.24, 0.88);
  engine.addChimeArpeggio(7.80, [1046.5, 1318.51, 1567.98, 2093.0], 0.07, 0.42);

  engine.addRimshot(8.80, 0.85);
  engine.addWordPop(8.80, 3500, 0.85, -0.2);
  engine.addWhipWhoosh(9.35, 0.38, 0.78, 1);

  // ==========================================
  // ACT 3 (10.0s - 15.0s): Multimodal Audio & Vision Waveform
  // ==========================================
  engine.addResonantPad(10.00, [164.81, 220.0, 261.63, 329.63, 392.0], 4.8, 0.72); // E minor7
  engine.addKick(10.20, 145, 38, 0.28, 0.95);  // Spectrum ignition
  engine.addWordPop(10.20, 3800, 0.9, 0.0);
  engine.addSubDrop(10.20, 180, 42, 1.4, 0.75);

  engine.addChimeArpeggio(11.40, [659.25, 880, 987.77, 1318.51, 1567.98, 1975.53], 0.08, 0.45);
  engine.addRimshot(11.80, 0.85);

  engine.addKick(12.90, 140, 40, 0.24, 0.9);
  engine.addWordPop(12.90, 3400, 0.85, -0.2);

  engine.addRimshot(13.80, 0.88);
  engine.addChimeArpeggio(13.80, [987.77, 1318.51, 1567.98, 1975.53], 0.07, 0.4);
  engine.addWhipWhoosh(14.35, 0.38, 0.82, -1);

  // ==========================================
  // ACT 4 (15.0s - 20.0s): "2 MILLION TOKENS." -> "DEEP RESEARCH."
  // ==========================================
  engine.addResonantPad(15.00, [174.61, 220.0, 261.63, 349.23, 440.0], 4.8, 0.75); // F Maj7
  engine.addKick(15.30, 150, 38, 0.30, 1.0);   // "2"
  engine.addWordPop(15.30, 3200, 0.85, -0.3);

  engine.addKick(15.90, 140, 40, 0.24, 0.9);   // "MILLION"
  engine.addWordPop(15.90, 3500, 0.88, 0.0);

  engine.addRimshot(16.50, 0.92);              // "TOKENS."
  engine.addWordPop(16.50, 3900, 0.95, 0.3);
  engine.addCrystalChime(16.50, 1975.53, 1.8, 0.48, 0.2);

  engine.addKick(17.70, 145, 38, 0.26, 0.92);  // "DEEP"
  engine.addWordPop(17.70, 3100, 0.85, -0.2);

  engine.addRimshot(18.40, 0.95);              // "RESEARCH."
  engine.addWordPop(18.40, 3700, 0.95, 0.2);
  engine.addChimeArpeggio(18.40, [880, 1108.73, 1318.51, 1760, 2217.46], 0.07, 0.45);
  engine.addWhipWhoosh(19.35, 0.38, 0.82, 1);

  // ==========================================
  // ACT 5 (20.0s - 25.0s): "REAL-TIME MULTIMODAL." -> "SUB-100MS LATENCY."
  // ==========================================
  engine.addResonantPad(20.00, [196.0, 246.94, 293.66, 369.99, 440.0], 4.8, 0.75); // G Maj7/sus
  engine.addKick(20.30, 150, 36, 0.30, 1.0);   // "REAL-TIME"
  engine.addWordPop(20.30, 3400, 0.9, -0.2);

  engine.addRimshot(21.10, 0.92);              // "MULTIMODAL."
  engine.addWordPop(21.10, 3800, 0.95, 0.2);
  engine.addChimeArpeggio(21.10, [1174.66, 1479.98, 1760, 2349.32], 0.06, 0.42);

  engine.addKick(22.30, 145, 38, 0.26, 0.92);  // "SUB-100MS"
  engine.addWordPop(22.30, 3600, 0.9, -0.2);

  engine.addRimshot(23.10, 0.95);              // "LATENCY."
  engine.addWordPop(23.10, 4000, 0.95, 0.2);
  engine.addCrystalChime(23.10, 2349.32, 2.0, 0.5, 0.1);
  engine.addWhipWhoosh(24.35, 0.4, 0.85, -1);

  // ==========================================
  // ACT 6 (25.0s - 30.0s): Climax & Sovereign Master Lockup
  // ==========================================
  // Dynamic 3-beat hit sequence into master lockup
  engine.addKick(24.80, 145, 40, 0.28, 0.95);
  engine.addRimshot(24.80, 0.82);
  engine.addWordPop(24.80, 3200, 0.85, -0.3);

  engine.addKick(25.35, 145, 40, 0.28, 0.95);
  engine.addRimshot(25.35, 0.85);
  engine.addWordPop(25.35, 3500, 0.88, 0.0);

  // 26.00s: Massive Frontier Impact Climax
  engine.addKick(26.00, 160, 32, 0.50, 1.1);   // "GOOGLE GEMINI 2.0."
  engine.addRimshot(26.00, 1.0);
  engine.addWordPop(26.00, 4200, 1.0, 0.0);
  engine.addSubDrop(26.00, 180, 32, 2.2, 0.9);
  engine.addChimeArpeggio(26.05, [587.33, 880, 1174.66, 1479.98, 1760, 2349.32, 2959.96], 0.06, 0.55);

  // Expanding halo & resolution pad
  engine.addResonantPad(26.20, [146.83, 220.0, 293.66, 369.99, 440.0, 587.33], 3.8, 0.85); // D Maj
  engine.addCrystalChime(27.00, 2959.96, 2.8, 0.45, 0.2);
  engine.addCrystalChime(27.80, 2349.32, 2.4, 0.4, -0.2);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  engine.exportWav(outputPath);
}

if (process.argv[1]?.endsWith('audio-synth-gemini.mjs')) {
  generateGeminiLaunchAudio();
}
