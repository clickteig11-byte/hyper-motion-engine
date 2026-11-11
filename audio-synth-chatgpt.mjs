import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Procedural Audio Synthesizer for "ChatGPT o3 Launch Teaser"
 * 30.00s @ 48kHz 16-Bit Stereo PCM WAV
 * 140 BPM Tech Groove with Deep 808 Sub Drops, Tactile Mechanical Keyboard Clicks, Tape Whooshes & Resonant Low Synth Chords
 */
export class ChatGptAudioEngine {
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

  // 1. Deep 808 Sub Drop (Pitch glide 110Hz -> 36Hz with soft saturation)
  add808SubDrop(startTime, duration = 1.2, startFreq = 110, endFreq = 38, gain = 0.95) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const progress = i / count;
      const freq = (startFreq - endFreq) * Math.exp(-progress * 5.0) + endFreq;
      const env = Math.sin(Math.min(1, t * 40) * (Math.PI / 2)) * Math.exp(-t * 2.2) * gain;
      // Slight harmonic saturation
      const osc = Math.sin(2 * Math.PI * freq * t);
      const sub = Math.tanh(osc * 1.8) * env;
      this.addSample(startIdx + i, sub, sub);
    }
  }

  // 2. Punchy Tight Kick (150Hz -> 48Hz)
  addKick(startTime, startFreq = 145, endFreq = 45, duration = 0.22, gain = 0.9) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const freq = (startFreq - endFreq) * Math.exp(-t * 32) + endFreq;
      const env = Math.exp(-t * 14.0) * gain;
      const s = Math.tanh(Math.sin(2 * Math.PI * freq * t) * 2.4) * env;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 3. Crisp Snare / Rimshot
  addSnare(startTime, gain = 0.65) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.14 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 90);
      const body = Math.sin(2 * Math.PI * 320 * t) * Math.exp(-t * 70);
      const crack = Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 180);
      const s = (noise * 0.5 + body * 0.35 + crack * 0.5) * gain;
      this.addSample(startIdx + i, s * 0.95, s * 1.05);
    }
  }

  // 4. Tactile Mechanical Keyboard Click (Token Stream / Word Pop)
  addKeyClick(startTime, pitch = 3200, gain = 0.5, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.035 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const clackNoise = (Math.random() * 2 - 1) * Math.exp(-t * 380);
      const resonantStem = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 220);
      const bottomOut = Math.sin(2 * Math.PI * 240 * t) * Math.exp(-t * 90) * 0.35;
      const s = (clackNoise * 0.4 + resonantStem * 0.45 + bottomOut) * gain;
      this.addSample(startIdx + i, s * (1 - pan * 0.35), s * (1 + pan * 0.35));
    }
  }

  // 5. Token Stream Burst (Rapid cascade of micro mechanical switch clicks)
  addTokenStream(startTime, duration = 1.5, density = 18, basePitch = 2800) {
    const numTokens = Math.floor(duration * density);
    const interval = duration / numTokens;
    for (let i = 0; i < numTokens; i++) {
      const t = startTime + i * interval + (Math.random() - 0.5) * 0.015;
      const pitch = basePitch + (Math.random() - 0.5) * 600;
      const pan = (Math.random() * 2 - 1) * 0.4;
      const gain = 0.22 + Math.random() * 0.15;
      this.addKeyClick(t, pitch, gain, pan);
    }
  }

  // 6. Analog Tape Whoosh / Reverse Swell
  addTapeWhoosh(startTime, duration = 0.35, gain = 0.7, direction = 1) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const env = Math.sin(p * Math.PI);
      const noise = (Math.random() * 2 - 1);
      const sweepFreq = 400 + Math.pow(p, 2.2) * 3600;
      const osc = Math.sin(2 * Math.PI * sweepFreq * (i / this.sampleRate));
      const s = (noise * 0.65 + osc * 0.35) * Math.pow(env, 1.4) * gain;
      const pan = (p * 2 - 1) * direction;
      this.addSample(startIdx + i, s * (0.6 - pan * 0.4), s * (0.6 + pan * 0.4));
    }
  }

  // 7. Resonant Low Synth Chords (D Minor / F Major OpenAI Mood)
  addResonantChord(startTime, rootFreq = 73.42, duration = 3.5, gain = 0.75) {
    // Root D2 (73.42Hz), minor 3rd F2 (87.31Hz), 5th A2 (110Hz), 7th C3 (130.81Hz), 9th E3 (164.81Hz)
    const notes = [rootFreq, rootFreq * 1.1892, rootFreq * 1.4983, rootFreq * 1.7818, rootFreq * 2.245];
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);

    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const attack = Math.min(1, t * 15);
      const release = Math.exp(-t * (1.8 / duration));
      const env = attack * release * gain;

      let sL = 0;
      let sR = 0;
      for (let n = 0; n < notes.length; n++) {
        const f = notes[n];
        const detuneL = 1.001;
        const detuneR = 0.999;
        const oscL = Math.sin(2 * Math.PI * (f * detuneL) * t);
        const oscR = Math.sin(2 * Math.PI * (f * detuneR) * t);
        // Sub-harmonic warmth
        const sub = Math.sin(2 * Math.PI * (f * 0.5) * t) * 0.4;
        const amp = 1 / (n + 1);
        sL += (oscL + sub) * amp;
        sR += (oscR + sub) * amp;
      }

      // Soft warm saturation
      this.addSample(startIdx + i, Math.tanh(sL * 0.9) * env, Math.tanh(sR * 0.9) * env);
    }
  }

  // 8. 140 BPM Driving Groove with Syncopated Percussion & Sub-Bassline
  add140BpmTechGroove(startTime, endTime) {
    const bpm = 140;
    const beatInterval = 60 / bpm; // ~0.42857 seconds per beat
    let t = startTime;
    let step = 0;

    // Deep tech bassline notes: D1 (36.7Hz), F1 (43.65Hz), G1 (49Hz), A1 (55Hz)
    const bassNotes = [36.71, 36.71, 43.65, 36.71, 49.00, 43.65, 55.00, 36.71];

    while (t < endTime) {
      const beatInMeasure = step % 4;

      // Kick pattern: Beat 1 and Beat 3, with ghost kick before beat 4
      if (beatInMeasure === 0) {
        this.addKick(t, 145, 42, 0.22, 0.92);
      } else if (beatInMeasure === 2) {
        this.addKick(t, 135, 40, 0.20, 0.85);
      } else if (beatInMeasure === 3 && step % 8 === 7) {
        this.addKick(t + beatInterval * 0.5, 120, 45, 0.16, 0.65);
      }

      // Snare on Beat 2 and Beat 4
      if (beatInMeasure === 1 || beatInMeasure === 3) {
        this.addSnare(t, 0.65);
      }

      // Hi-Hats / Shakers on 16th notes
      for (let sub = 0; sub < 4; sub++) {
        const hatTime = t + sub * (beatInterval / 4);
        if (hatTime < endTime) {
          const isAccent = (sub === 2);
          const hatGain = isAccent ? 0.22 : 0.12;
          const pan = (sub % 2 === 0) ? -0.2 : 0.2;
          const startIdx = Math.floor(hatTime * this.sampleRate);
          const count = Math.floor(0.02 * this.sampleRate);
          for (let k = 0; k < count; k++) {
            const hT = k / this.sampleRate;
            const noise = (Math.random() * 2 - 1) * Math.exp(-hT * 420);
            const highRing = Math.sin(2 * Math.PI * 8400 * hT) * Math.exp(-hT * 320);
            const s = (noise * 0.6 + highRing * 0.4) * hatGain;
            this.addSample(startIdx + k, s * (1 - pan * 0.4), s * (1 + pan * 0.4));
          }
        }
      }

      // Deep Sub Synth Bassline on each beat
      const bassFreq = bassNotes[step % bassNotes.length];
      const startIdx = Math.floor(t * this.sampleRate);
      const noteCount = Math.floor(beatInterval * 0.85 * this.sampleRate);
      for (let i = 0; i < noteCount; i++) {
        const sTime = i / this.sampleRate;
        const osc = Math.sin(2 * Math.PI * bassFreq * sTime);
        const sat = Math.tanh(osc * 2.0);
        const env = Math.exp(-sTime * 5.0) * 0.55;
        this.addSample(startIdx + i, sat * env, sat * env);
      }

      t += beatInterval;
      step++;
    }
  }

  // Master Normalization & 16-Bit Stereo WAV Export
  exportWav(outputPath) {
    let peak = 0;
    for (let i = 0; i < this.totalSamples; i++) {
      if (Math.abs(this.left[i]) > peak) peak = Math.abs(this.left[i]);
      if (Math.abs(this.right[i]) > peak) peak = Math.abs(this.right[i]);
    }

    const norm = peak > 0.95 ? (0.95 / peak) : 1.0;
    console.log(`[ChatGptAudio] Peak: ${peak.toFixed(3)}, Normalization factor: ${norm.toFixed(3)}`);

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

    const fullBuffer = Buffer.concat([header, pcmData]);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, fullBuffer);
    console.log(`[ChatGptAudio] Rendered master WAV -> ${outputPath} (${(fullBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);
  }
}

/**
 * Master Audio Composer for ChatGPT o3 Launch (30.00s Duration @ 140 BPM)
 */
export function generateChatGPTAudio(outputPath = './hyper-motion-studio/dist/soundtrack-chatgpt.wav') {
  const engine = new ChatGptAudioEngine(30.0, 48000);

  // 0.00s: Opening atmospheric sub drop & resonant pad
  engine.add808SubDrop(0.00, 2.0, 95, 36, 1.0);
  engine.addResonantChord(0.00, 73.42, 3.5, 0.85);

  // ==========================================
  // ACT 1: "THINK DEEPER." -> "GPT-o3 REASONING." (0.0s - 5.0s)
  // ==========================================
  engine.addKeyClick(0.35, 3400, 0.8, -0.25);  // "THINK"
  engine.addKick(0.35, 140, 44, 0.22, 0.95);

  engine.addKeyClick(0.95, 3000, 0.85, 0.25);  // "DEEPER."
  engine.addSnare(0.95, 0.8);

  engine.addKeyClick(2.00, 3600, 0.85, -0.2);  // "GPT-o3"
  engine.addKick(2.00, 135, 42, 0.24, 0.9);

  engine.addKeyClick(2.70, 3200, 0.9, 0.2);   // "REASONING."
  engine.addSnare(2.70, 0.85);

  engine.add808SubDrop(3.50, 1.4, 110, 38, 0.85);
  engine.addTapeWhoosh(4.40, 0.45, 0.75, 1);

  // ==========================================
  // 4.5s - 26.5s: Continuous 140 BPM Tech Groove
  // ==========================================
  engine.add140BpmTechGroove(4.50, 26.50);

  // ==========================================
  // ACT 2: Thinking Trace & Token Streams (5.0s - 10.0s)
  // ==========================================
  engine.addResonantChord(5.00, 87.31, 3.0, 0.8);
  engine.addTokenStream(5.20, 2.0, 22, 3200);   // Thinking trace token emission
  engine.addTokenStream(7.50, 1.8, 24, 3400);   // Syntax highlight streaming tokens
  engine.addTapeWhoosh(9.35, 0.45, 0.75, 1);

  // ==========================================
  // ACT 3: OpenAI Rosette Geometry & Particle Burst (10.0s - 15.0s)
  // ==========================================
  engine.add808SubDrop(10.00, 2.2, 130, 34, 1.0); // Rosette burst impact
  engine.addResonantChord(10.00, 73.42, 4.0, 0.9);
  engine.addTokenStream(11.00, 3.0, 16, 4200);   // High crystalline particle clicks
  engine.addTapeWhoosh(14.35, 0.45, 0.75, 1);

  // ==========================================
  // ACT 4: "AUTONOMOUS OPERATOR." -> "ACTIONS IN BROWSER." (15.0s - 20.0s)
  // ==========================================
  engine.addKeyClick(15.00, 3200, 0.85, -0.3); // "AUTONOMOUS"
  engine.addKick(15.00, 140, 42, 0.25, 0.9);

  engine.addKeyClick(15.80, 3500, 0.85, 0.3);  // "OPERATOR."
  engine.addSnare(15.80, 0.85);

  engine.addKeyClick(17.00, 3300, 0.85, -0.2); // "ACTIONS"
  engine.addKick(17.00, 135, 42, 0.22, 0.85);

  engine.addKeyClick(17.80, 3600, 0.9, 0.2);   // "IN BROWSER."
  engine.addSnare(17.80, 0.85);

  engine.addTokenStream(18.20, 1.2, 20, 3000); // Browser action execution stream
  engine.addTapeWhoosh(19.35, 0.45, 0.8, 1);

  // ==========================================
  // ACT 5: "FRONTIER INTELLIGENCE." -> "ZERO LATENCY." (20.0s - 25.0s)
  // ==========================================
  engine.add808SubDrop(20.00, 2.0, 140, 36, 1.0);
  engine.addKeyClick(20.00, 3400, 0.9, -0.25); // "FRONTIER"
  engine.addKeyClick(20.80, 3700, 0.9, 0.25);  // "INTELLIGENCE."
  engine.addSnare(20.80, 0.9);

  engine.addKeyClick(22.20, 3500, 0.85, -0.2); // "ZERO"
  engine.addKick(22.20, 140, 42, 0.25, 0.9);

  engine.addKeyClick(22.90, 3800, 0.95, 0.2);  // "LATENCY."
  engine.addSnare(22.90, 0.9);

  engine.addTokenStream(23.20, 1.2, 28, 3800); // Benchmark numbers rapid count ticks
  engine.addTapeWhoosh(24.30, 0.5, 0.85, 1);

  // ==========================================
  // ACT 6: Climax & Master Lockup "ChatGPT o3." (25.0s - 30.0s)
  // ==========================================
  engine.add808SubDrop(25.00, 3.2, 120, 32, 1.05);
  engine.addResonantChord(25.00, 73.42, 4.5, 0.95);
  engine.addKeyClick(25.00, 3800, 1.0, 0.0);   // "ChatGPT o3." Lockup Pop

  engine.addKeyClick(26.20, 3200, 0.7, -0.1);  // Subtitle reveal
  engine.addKeyClick(27.00, 3400, 0.7, 0.1);
  engine.addTapeWhoosh(27.80, 0.6, 0.5, -1);

  engine.exportWav(outputPath);
}

if (process.argv[1]?.endsWith('audio-synth-chatgpt.mjs')) {
  const resolvedPath = path.join(__dirname, 'dist', 'soundtrack-chatgpt.wav');
  generateChatGPTAudio(resolvedPath);
}
