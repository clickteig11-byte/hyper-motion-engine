import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Procedural Audio Synthesizer for "Build with Caleb: Hyper-Motion Engine"
 * Full 30.00s Launch Reel @ 48kHz 16-Bit Stereo PCM WAV
 * 144 BPM Driving Tech Breakbeat, Analog Punch Kicks on Word Hits, Tactile Clicks, and Fluid Camera Whooshes
 */
class CalebAudioEngine {
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

  // 1. Punchy Analog Kick Drum (130Hz -> 42Hz)
  addKick(startTime, startFreq = 130, endFreq = 42, duration = 0.25, gain = 0.95) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const freq = (startFreq - endFreq) * Math.exp(-t * 26) + endFreq;
      const env = Math.exp(-t * 12.0) * gain;
      const s = Math.tanh(Math.sin(2 * Math.PI * freq * t) * 2.2) * env;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 2. Crisp Wooden Rimshot / Snare
  addRimshot(startTime, gain = 0.7) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.12 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 130);
      const wood = Math.sin(2 * Math.PI * 560 * t) * Math.exp(-t * 80);
      const snap = Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-t * 220);
      const s = (noise * 0.45 + wood * 0.4 + snap * 0.55) * gain;
      this.addSample(startIdx + i, s * 0.95, s * 1.05);
    }
  }

  // 3. Tactile Mechanical Click (Word Pop)
  addWordPop(startTime, pitch = 2400, gain = 0.65, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.04 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 300);
      const tone = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 180);
      const sub = Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 50) * 0.4;
      const s = (noise * 0.35 + tone * 0.5 + sub) * gain;
      this.addSample(startIdx + i, s * (1 - pan * 0.4), s * (1 + pan * 0.4));
    }
  }

  // 4. Fluid Camera Whip / Tape Whoosh
  addWhipWhoosh(startTime, duration = 0.28, gain = 0.7, dir = 1) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const env = Math.sin(p * Math.PI);
      const noise = (Math.random() * 2 - 1);
      const center = 600 + Math.pow(p, 2.0) * 2200;
      const osc = Math.sin(2 * Math.PI * center * (i / this.sampleRate));
      const s = (noise * 0.65 + osc * 0.35) * Math.pow(env, 1.6) * gain;
      const pan = (p * 2 - 1) * dir;
      this.addSample(startIdx + i, s * (0.6 - pan * 0.4), s * (0.6 + pan * 0.4));
    }
  }

  // 5. Ascending Benchmark Rocket Sweep
  addRocketSweep(startTime, duration = 1.6, gain = 0.75) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const t = i / this.sampleRate;
      const freq = 160 * Math.pow(9.0, p); // 160Hz to ~1440Hz
      const env = Math.pow(p, 1.5) * Math.exp(-(1 - p) * 0.3) * gain;
      const s = Math.sin(2 * Math.PI * freq * t) * env;
      this.addSample(startIdx + i, s * 0.9, s * 0.9);
    }
  }

  // 6. Warm Rhodes Chord (F Minor)
  addWarmChord(startTime, root = 174.61, duration = 2.0, gain = 0.8) {
    const freqs = [root, root * 1.1892, root * 1.4983, root * 1.7818, root * 2.0];
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);

    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 2.5) * gain;
      let s = 0;
      for (let f = 0; f < freqs.length; f++) {
        const tone = Math.sin(2 * Math.PI * freqs[f] * t);
        const chime = Math.sin(2 * Math.PI * (freqs[f] * 2.5) * t) * 0.25 * Math.exp(-t * 9.0);
        s += (tone + chime) * (1 / (f + 1));
      }
      const warm = Math.tanh(s * 1.5) * env;
      this.addSample(startIdx + i, warm, warm);
    }
  }

  // 7. 144 BPM Driving Groove with Rounded Electric Bass
  addDrivingGroove(startTime, endTime, bpm = 144) {
    const beatInterval = 60 / bpm; // ~0.41667s
    let t = startTime;
    let step = 0;

    const bassline = [87.3, 87.3, 103.8, 116.5, 87.3, 103.8, 130.8, 116.5];

    while (t < endTime) {
      // Kick on 1 and 3
      if (step % 2 === 0) {
        this.addKick(t, 130, 42, 0.24, 0.88);
      } else {
        this.addKick(t, 105, 38, 0.18, 0.55);
      }

      // Snare Rimshot on 2 and 4
      if (step % 2 === 1) {
        this.addRimshot(t, 0.68);
      }

      // Shakers & Hi-Hats on 16th subdivisions
      for (let sub = 0; sub < 4; sub++) {
        const hatTime = t + sub * (beatInterval / 4);
        if (hatTime < endTime) {
          const hatGain = (sub % 2 === 0) ? 0.24 : 0.14;
          const pan = (sub % 2 === 0) ? -0.25 : 0.25;
          const startIdx = Math.floor(hatTime * this.sampleRate);
          const count = Math.floor(0.02 * this.sampleRate);
          for (let k = 0; k < count; k++) {
            const hT = k / this.sampleRate;
            const noise = (Math.random() * 2 - 1) * Math.exp(-hT * 400);
            const tone = Math.sin(2 * Math.PI * 7500 * hT) * Math.exp(-hT * 300);
            const s = (noise * 0.5 + tone * 0.5) * hatGain;
            this.addSample(startIdx + k, s * (1 - pan * 0.4), s * (1 + pan * 0.4));
          }
        }
      }

      // Rounded Electric Bass
      const bassFreq = bassline[step % bassline.length];
      const startIdx = Math.floor(t * this.sampleRate);
      const noteCount = Math.floor(beatInterval * 0.88 * this.sampleRate);
      for (let i = 0; i < noteCount; i++) {
        const sTime = i / this.sampleRate;
        const fund = Math.sin(2 * Math.PI * bassFreq * sTime);
        const second = Math.sin(2 * Math.PI * (bassFreq * 2) * sTime) * 0.35;
        const env = Math.exp(-sTime * 4.6) * 0.48;
        const s = Math.tanh((fund + second) * 1.6) * env;
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
    console.log(`[CalebAudio] Peak: ${peak.toFixed(3)}, Normalization factor: ${norm.toFixed(3)}`);

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

      // Fade out last 30ms to prevent click
      if (i > this.totalSamples - Math.floor(0.03 * this.sampleRate)) {
        const fade = (this.totalSamples - i) / (0.03 * this.sampleRate);
        sL *= fade;
        sR *= fade;
      }

      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sL * 0x7FFF))), offset);
      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sR * 0x7FFF))), offset + 2);
      offset += 4;
    }

    fs.writeFileSync(outputPath, Buffer.concat([header, pcmData]));
    console.log(`[CalebAudio] Rendered master WAV -> ${outputPath}`);
  }
}

// Master Audio Composer for Build with Caleb Hyper-Motion Launch (30.00s Duration)
export function generateCalebLaunchAudio(outputPath = './hyper-motion-studio/dist/soundtrack-caleb.wav') {
  const engine = new CalebAudioEngine(30.0, 48000);

  // 0.00s: Opening Hit
  engine.addWarmChord(0.00, 174.61, 2.0, 0.85);
  engine.addWordPop(0.00, 2600, 0.8);

  // Act 1 Word Hits (0.0s - 4.5s)
  engine.addKick(0.30, 140, 42, 0.22, 0.95);  // "STOP"
  engine.addWordPop(0.30, 3200, 0.8, -0.2);

  engine.addRimshot(0.90, 0.85);              // "KEYFRAMING."
  engine.addWordPop(0.90, 2800, 0.8, 0.2);

  engine.addKick(1.80, 130, 40, 0.22, 0.85);  // "NO MORE"
  engine.addWordPop(1.80, 2600, 0.75, -0.2);

  engine.addRimshot(2.40, 0.8);               // "TEDIOUS EDITS."
  engine.addWordPop(2.40, 2900, 0.8, 0.2);

  engine.addKick(3.20, 145, 38, 0.35, 1.0);   // "JUST CODE."
  engine.addWordPop(3.20, 3400, 0.9, 0.0);
  engine.addWhipWhoosh(4.20, 0.35, 0.75, 1);

  // 3.80s - 26.50s: Continuous 144 BPM Driving Groove
  engine.addDrivingGroove(3.80, 26.50, 144);

  // Act 2 Word Hits: Introducing Caleb (4.5s - 9.5s)
  engine.addKick(4.80, 135, 40, 0.24, 0.9);   // "HI,"
  engine.addWordPop(4.80, 2500, 0.75, -0.2);

  engine.addRimshot(5.30, 0.85);              // "I'M CALEB." + Photo entrance
  engine.addWordPop(5.30, 3200, 0.9, 0.2);
  engine.addWhipWhoosh(5.25, 0.28, 0.7, -1);

  engine.addKick(6.20, 130, 42, 0.22, 0.85);  // "I TURN IDEAS"
  engine.addWordPop(6.20, 2700, 0.75, -0.1);

  engine.addRimshot(7.00, 0.8);               // "INTO REAL WEBSITES."
  engine.addWordPop(7.00, 3000, 0.8, 0.1);

  engine.addKick(7.80, 135, 40, 0.22, 0.85);  // "AND APPS."
  engine.addWordPop(7.80, 3100, 0.8, 0.0);

  engine.addRimshot(8.60, 0.85);              // "HERE'S HOW."
  engine.addWordPop(8.60, 3400, 0.85, 0.2);
  engine.addWhipWhoosh(9.30, 0.35, 0.75, 1);

  // Act 3 Word Hits: Zero AI Slop (9.5s - 14.5s)
  engine.addKick(9.80, 140, 42, 0.25, 0.95);  // "ZERO"
  engine.addWordPop(9.80, 3200, 0.85, -0.2);

  engine.addRimshot(10.40, 0.9);              // "AI SLOP."
  engine.addWordPop(10.40, 3500, 0.9, 0.2);

  engine.addKick(11.20, 130, 40, 0.22, 0.85); // "NO FAKE DEMOS."
  engine.addWordPop(11.20, 2700, 0.75, -0.1);

  engine.addRimshot(12.00, 0.8);              // "NO FILLER JARGON."
  engine.addWordPop(12.00, 2900, 0.8, 0.1);

  engine.addKick(13.00, 140, 38, 0.25, 0.9);  // "REAL CODE."
  engine.addWordPop(13.00, 3200, 0.85, 0.0);

  engine.addRimshot(13.70, 0.85);             // "REAL BUILDS."
  engine.addWordPop(13.70, 3500, 0.85, 0.2);
  engine.addWhipWhoosh(14.40, 0.35, 0.75, 1);

  // Act 4: 3-Step Pipeline (14.5s - 19.5s)
  engine.addKick(15.00, 135, 40, 0.25, 0.9);  // "01 / IDEA"
  engine.addWordPop(15.00, 2800, 0.8, -0.3);

  engine.addKick(16.20, 135, 40, 0.25, 0.9);  // "02 / CODE"
  engine.addWordPop(16.20, 3100, 0.8, 0.0);

  engine.addKick(17.40, 135, 40, 0.25, 0.9);  // "03 / FILM"
  engine.addWordPop(17.40, 3400, 0.8, 0.3);

  engine.addRimshot(18.50, 0.95);             // "BUILT IN PUBLIC."
  engine.addWordPop(18.50, 3600, 0.9, 0.0);
  engine.addWhipWhoosh(19.30, 0.35, 0.75, 1);

  // Act 5: 52X Velocity Benchmark (19.5s - 24.5s)
  engine.addRocketSweep(19.60, 2.0, 0.8);
  engine.addKick(19.80, 150, 40, 0.35, 1.0);  // "52X"
  engine.addWordPop(19.80, 3800, 0.95, 0.0);

  engine.addWordPop(20.60, 3000, 0.8, -0.1);  // "FASTER THAN"
  engine.addRimshot(21.30, 0.85);             // "AFTER EFFECTS."
  engine.addWordPop(21.30, 3400, 0.85, 0.1);

  engine.addKick(22.80, 140, 38, 0.25, 0.95); // "60 FPS"
  engine.addWordPop(22.80, 3300, 0.85, -0.1);

  engine.addRimshot(23.40, 0.9);              // "PURE CODE."
  engine.addWordPop(23.40, 3600, 0.9, 0.1);
  engine.addWhipWhoosh(24.30, 0.35, 0.8, 1);

  // Act 6: Climax & Master Lockup (24.5s - 30.0s)
  engine.addKick(24.80, 140, 40, 0.3, 0.95);  // "CODE."
  engine.addRimshot(24.80, 0.8);
  engine.addWordPop(24.80, 3000, 0.85);

  engine.addKick(25.40, 140, 40, 0.3, 0.95);  // "BUILD."
  engine.addRimshot(25.40, 0.8);
  engine.addWordPop(25.40, 3300, 0.85);

  engine.addKick(26.00, 150, 35, 0.45, 1.05); // "REPEAT."
  engine.addRimshot(26.00, 0.95);
  engine.addWordPop(26.00, 3800, 1.0);
  engine.addWhipWhoosh(26.50, 0.4, 0.8, 1);

  // 26.80s - 30.00s: Sovereign Lockup & Warm Rhodes Chime
  engine.addWarmChord(26.80, 174.61, 2.8, 0.9);
  engine.addWordPop(26.80, 3600, 0.85);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  engine.exportWav(outputPath);
  return outputPath;
}

export const generateAudio = generateCalebLaunchAudio;

if (process.argv[1]?.endsWith('audio-synth.mjs') || process.argv[1]?.endsWith('audio-synth-caleb.mjs')) {
  const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
  const targetWav = path.join(distDir, 'soundtrack.wav');
  console.log(`Synthesizing 144 BPM procedural launch soundtrack to ${targetWav}...`);
  generateCalebLaunchAudio(targetWav);
  console.log('✅ Soundtrack generated successfully.');
}
