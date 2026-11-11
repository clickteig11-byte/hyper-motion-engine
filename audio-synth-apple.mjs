import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Procedural Audio Synthesizer for "Apple Intelligence Launch Video"
 * 30.00s @ 48kHz 16-Bit Stereo PCM WAV
 * 136 BPM Elegant Hybrid:
 * - Tactile acoustic glass clicks & haptic pops
 * - Warm acoustic rimshots & wooden snare taps
 * - Pristine metallic chimes & celesta overtone bells
 * - Deep sub swells & Cupertino punch kicks
 * - Fluid spatial stereo whooshes
 */
export class AppleAudioEngine {
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

  // 1. Tactile Acoustic Glass Click (Apple UI Haptic)
  addGlassClick(startTime, pitch = 3600, gain = 0.7, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.06 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      // High glass transient + inharmonic metallic modes
      const transient = (Math.random() * 2 - 1) * Math.exp(-t * 400) * 0.4;
      const f1 = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 180);
      const f2 = Math.sin(2 * Math.PI * (pitch * 1.58) * t) * Math.exp(-t * 240) * 0.5;
      const f3 = Math.sin(2 * Math.PI * (pitch * 2.71) * t) * Math.exp(-t * 320) * 0.25;
      const woodBody = Math.sin(2 * Math.PI * 480 * t) * Math.exp(-t * 120) * 0.3;
      const s = (transient + f1 + f2 + f3 + woodBody) * gain;
      this.addSample(startIdx + i, s * (1 - pan * 0.4), s * (1 + pan * 0.4));
    }
  }

  // 2. Warm Acoustic Rimshot / Wood Snare
  addAcousticRimshot(startTime, gain = 0.75, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.14 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const stickSnap = (Math.random() * 2 - 1) * Math.exp(-t * 120);
      const rimTone = Math.sin(2 * Math.PI * 460 * t) * Math.exp(-t * 70);
      const shellResonance = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-t * 45);
      const highPing = Math.sin(2 * Math.PI * 2850 * t) * Math.exp(-t * 220) * 0.6;
      const s = (stickSnap * 0.4 + rimTone * 0.45 + shellResonance * 0.25 + highPing * 0.35) * gain;
      this.addSample(startIdx + i, s * (1 - pan * 0.35), s * (1 + pan * 0.35));
    }
  }

  // 3. Pristine Metallic Chime & Bell (Apple Notification Elegance)
  addMetallicChime(startTime, rootFreq = 523.25, duration = 2.4, gain = 0.7, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    // Metallic chime bar overtones (inharmonic acoustic ratios)
    const partials = [
      { fRatio: 1.00, gain: 0.8, decay: 2.2 },
      { fRatio: 2.76, gain: 0.4, decay: 3.5 },
      { fRatio: 5.40, gain: 0.2, decay: 5.0 },
      { fRatio: 8.90, gain: 0.1, decay: 7.5 }
    ];

    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      let s = 0;
      for (const p of partials) {
        const freq = rootFreq * p.fRatio;
        const env = Math.exp(-t * p.decay) * p.gain;
        s += Math.sin(2 * Math.PI * freq * t) * env;
      }
      const warm = Math.tanh(s * 1.1) * gain;
      this.addSample(startIdx + i, warm * (1 - pan * 0.4), warm * (1 + pan * 0.4));
    }
  }

  // 4. Low Sub Swell (Deep Cinematic Weight)
  addSubSwell(startTime, duration = 2.2, startFreq = 42, endFreq = 62, gain = 0.8) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const p = i / count;
      // Smooth attack-decay swell envelope
      const env = Math.sin(p * Math.PI) * Math.sin(Math.min(1, p * 4) * Math.PI * 0.5);
      const freq = startFreq + (endFreq - startFreq) * Math.sin(p * Math.PI * 0.5);
      const s = Math.sin(2 * Math.PI * freq * t) * env * gain;
      this.addSample(startIdx + i, s * 0.95, s * 0.95);
    }
  }

  // 5. Fluid Spatial Stereo Whoosh
  addFluidSpatialWhoosh(startTime, duration = 0.42, gain = 0.7, dir = 1) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const env = Math.sin(p * Math.PI);
      const noise = (Math.random() * 2 - 1);
      const centerFreq = 500 + Math.pow(p, 2.2) * 2400;
      const osc = Math.sin(2 * Math.PI * centerFreq * (i / this.sampleRate));
      const s = (noise * 0.6 + osc * 0.4) * Math.pow(env, 1.5) * gain;
      const pan = (p * 2 - 1) * dir;
      this.addSample(startIdx + i, s * (0.6 - pan * 0.4), s * (0.6 + pan * 0.4));
    }
  }

  // 6. Cupertino Punch Kick (120Hz -> 42Hz)
  addCupertinoKick(startTime, gain = 0.85) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.24 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const freq = 78 * Math.exp(-t * 22) + 42;
      const env = Math.exp(-t * 11.0) * gain;
      const click = Math.sin(2 * Math.PI * 1800 * t) * Math.exp(-t * 260) * 0.25;
      const sub = Math.sin(2 * Math.PI * freq * t);
      const s = Math.tanh((sub + click) * 1.8) * env;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 7. Warm Rhodes / Felt Chime Chord (E Maj9 Voicing)
  addAcousticChord(startTime, rootFreq = 164.81, duration = 3.2, gain = 0.8) {
    // E Maj9 voicing: E3, G#3, B3, D#4, F#4
    const freqs = [
      rootFreq,             // E3 (164.81)
      rootFreq * 1.2599,    // G#3 (207.65)
      rootFreq * 1.4983,    // B3 (246.94)
      rootFreq * 1.8877,    // D#4 (311.13)
      rootFreq * 2.2450     // F#4 (369.99)
    ];
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 1.8) * gain;
      let s = 0;
      freqs.forEach((f, idx) => {
        const fundamental = Math.sin(2 * Math.PI * f * t);
        const octave = Math.sin(2 * Math.PI * (f * 2) * t) * 0.3 * Math.exp(-t * 3.5);
        const chime = Math.sin(2 * Math.PI * (f * 4.2) * t) * 0.12 * Math.exp(-t * 9.0);
        s += (fundamental + octave + chime) * (1 / (idx + 1.2));
      });
      const warm = Math.tanh(s * 1.1) * env;
      this.addSample(startIdx + i, warm * 0.9, warm * 0.9);
    }
  }

  // 8. Titanium Vector Padlock Click (Double Mechanical Contact)
  addPadlockClick(startTime, gain = 0.85) {
    // Tap 1: Guide engagement
    this.addGlassClick(startTime, 2800, gain * 0.6, -0.2);
    // Tap 2: Solid titanium bolt lock latch (42ms later)
    const latchTime = startTime + 0.042;
    const startIdx = Math.floor(latchTime * this.sampleRate);
    const count = Math.floor(0.18 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const latchTone = Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 35);
      const metallicBite = Math.sin(2 * Math.PI * 3400 * t) * Math.exp(-t * 180) * 0.7;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 90) * 0.3;
      const s = (latchTone * 0.6 + metallicBite * 0.4 + noise) * gain;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 9. Neural Engine Harmonic Shimmer / Ascending Pulse
  addNeuralPulse(startTime, duration = 1.6, gain = 0.75) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const t = i / this.sampleRate;
      // Exponential frequency rise
      const freq = 220 * Math.pow(6.5, p);
      const env = Math.pow(p, 1.4) * Math.exp(-(1 - p) * 0.25) * gain;
      const s = Math.sin(2 * Math.PI * freq * t) * env;
      const pan = Math.sin(p * Math.PI * 4);
      this.addSample(startIdx + i, s * (0.5 - pan * 0.3), s * (0.5 + pan * 0.3));
    }
  }

  // Export 16-Bit Stereo PCM WAV
  exportWav(outputPath) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Normalization scan to prevent any digital clipping
    let peak = 0;
    for (let i = 0; i < this.totalSamples; i++) {
      const absL = Math.abs(this.left[i]);
      const absR = Math.abs(this.right[i]);
      if (absL > peak) peak = absL;
      if (absR > peak) peak = absR;
    }

    const targetPeak = 0.94;
    const norm = peak > targetPeak ? targetPeak / peak : 1.0;

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
    const fadeCount = Math.floor(0.04 * this.sampleRate);

    for (let i = 0; i < this.totalSamples; i++) {
      let sL = Math.tanh(this.left[i] * norm);
      let sR = Math.tanh(this.right[i] * norm);

      // Smooth fade-out in final 40ms to eliminate pop
      if (i > this.totalSamples - fadeCount) {
        const fade = (this.totalSamples - i) / fadeCount;
        sL *= fade;
        sR *= fade;
      }

      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sL * 0x7FFF))), offset);
      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sR * 0x7FFF))), offset + 2);
      offset += 4;
    }

    fs.writeFileSync(outputPath, Buffer.concat([header, pcmData]));
    console.log(`[AppleAudio] Master 48kHz Stereo WAV -> ${outputPath}`);
  }
}

/**
 * Compose 30.00s Soundtrack for Apple Intelligence Launch
 * Synchronized with 136 BPM rhythm across Acts 1 to 6
 */
export function generateAppleLaunchAudio(outputPath = path.join(__dirname, 'dist', 'soundtrack-apple.wav')) {
  const engine = new AppleAudioEngine(30.0, 48000);

  // 136 BPM timing grid: beat = ~0.441s
  const beat = 60 / 136;

  // ==========================================
  // ACT 1 (0.00s - 5.00s): THE PROCLAMATION
  // "APPLE INTELLIGENCE." -> "AI FOR THE REST OF US."
  // ==========================================
  engine.addAcousticChord(0.00, 164.81, 3.2, 0.9); // E Maj9 opening glow
  engine.addGlassClick(0.00, 3600, 0.75, 0.0);
  engine.addSubSwell(0.00, 2.6, 38, 62, 0.85);

  // Word Pops: "APPLE" (0.80s) -> "INTELLIGENCE." (1.40s)
  engine.addCupertinoKick(0.80, 0.9);
  engine.addGlassClick(0.80, 3400, 0.8, -0.2);

  engine.addAcousticRimshot(1.40, 0.85, 0.2);
  engine.addMetallicChime(1.40, 659.25, 2.0, 0.75); // E5

  // Line 2: "AI" (2.60s) "FOR" (3.00s) "THE" (3.35s) "REST" (3.70s) "OF US." (4.20s)
  engine.addCupertinoKick(2.60, 0.85);
  engine.addGlassClick(2.60, 3800, 0.8, -0.3);

  engine.addGlassClick(3.00, 3200, 0.7, -0.1);
  engine.addGlassClick(3.35, 3400, 0.7, 0.1);
  engine.addGlassClick(3.70, 3600, 0.75, 0.2);

  engine.addAcousticRimshot(4.20, 0.9, 0.0);
  engine.addMetallicChime(4.20, 783.99, 2.2, 0.8); // G5 chime
  engine.addFluidSpatialWhoosh(4.65, 0.4, 0.75, 1);

  // ==========================================
  // ACT 2 (5.00s - 10.00s): SIRI GLOWING PERIMETER RIM
  // Harmonic boundary wave pulsing around the canvas
  // ==========================================
  engine.addSubSwell(5.00, 3.8, 36, 70, 0.9);
  engine.addMetallicChime(5.00, 523.25, 3.0, 0.8, -0.3);
  engine.addMetallicChime(5.20, 783.99, 2.8, 0.7, 0.3);

  // Rhythmic pulse matching perimeter wave expansion
  for (let b = 0; b < 10; b++) {
    const t = 5.20 + b * beat;
    if (t < 9.5) {
      if (b % 2 === 0) {
        engine.addCupertinoKick(t, 0.75);
        engine.addGlassClick(t, 2900 + b * 80, 0.6, (b % 4 - 1.5) * 0.4);
      } else {
        engine.addAcousticRimshot(t, 0.65, -(b % 4 - 1.5) * 0.4);
      }
    }
  }
  engine.addFluidSpatialWhoosh(9.60, 0.42, 0.8, -1);

  // ==========================================
  // ACT 3 (10.00s - 15.00s): FROSTED GLASS UI SUITE
  // Writing Tools, Image Wand, Clean Up
  // ==========================================
  engine.addAcousticChord(10.00, 174.61, 3.5, 0.85); // F3 Maj9
  engine.addGlassClick(10.00, 4200, 0.8, 0.0);
  engine.addSubSwell(10.00, 2.5, 42, 58, 0.75);

  // Feature 1: Writing Tools (11.00s)
  engine.addCupertinoKick(11.00, 0.85);
  engine.addGlassClick(11.00, 3600, 0.8, -0.25);
  engine.addMetallicChime(11.00, 659.25, 1.8, 0.65);

  // Feature 2: Image Wand (12.20s)
  engine.addGlassClick(12.20, 4400, 0.85, 0.0);
  engine.addMetallicChime(12.20, 880.00, 2.0, 0.7);

  // Feature 3: Clean Up (13.40s)
  engine.addAcousticRimshot(13.40, 0.85, 0.25);
  engine.addGlassClick(13.40, 4800, 0.8, 0.25);

  // Haptic confirmation
  engine.addCupertinoKick(14.20, 0.9);
  engine.addMetallicChime(14.20, 1046.50, 2.0, 0.75);
  engine.addFluidSpatialWhoosh(14.60, 0.42, 0.75, 1);

  // ==========================================
  // ACT 4 (15.00s - 20.00s): PRIVATE CLOUD COMPUTE
  // Titanium security padlock & cryptographic privacy
  // ==========================================
  engine.addSubSwell(15.00, 3.0, 36, 52, 0.95);
  engine.addGlassClick(15.00, 3200, 0.7, 0.0);

  // Word Pops: "PRIVATE CLOUD COMPUTE." (15.60s - 16.80s)
  engine.addCupertinoKick(15.60, 0.85);
  engine.addGlassClick(15.60, 3400, 0.75, -0.2);

  engine.addGlassClick(16.20, 3600, 0.75, 0.0);
  engine.addAcousticRimshot(16.80, 0.85, 0.2);

  // Titanium Padlock Snap (17.50s)
  engine.addPadlockClick(17.50, 1.0);
  engine.addCupertinoKick(17.55, 0.95);

  // "YOUR DATA NEVER LEAVES." (18.30s)
  engine.addMetallicChime(18.30, 587.33, 2.4, 0.8); // D5
  engine.addGlassClick(18.30, 4000, 0.8, 0.0);
  engine.addFluidSpatialWhoosh(19.55, 0.45, 0.8, -1);

  // ==========================================
  // ACT 5 (20.00s - 25.00s): M4 NEURAL ENGINE
  // On-Device Silicon Velocity
  // ==========================================
  engine.addNeuralPulse(20.00, 1.8, 0.85);
  engine.addCupertinoKick(20.00, 0.9);

  // "M4" (20.80s)
  engine.addGlassClick(20.80, 3800, 0.85, -0.2);
  engine.addCupertinoKick(20.80, 0.95);

  // "NEURAL" (21.40s)
  engine.addGlassClick(21.40, 4200, 0.85, 0.0);

  // "ENGINE." (22.00s)
  engine.addAcousticRimshot(22.00, 0.9, 0.2);
  engine.addMetallicChime(22.00, 880.00, 2.0, 0.75);

  // "ON-DEVICE VELOCITY." (23.20s)
  engine.addCupertinoKick(23.20, 1.0);
  engine.addMetallicChime(23.20, 1174.66, 2.2, 0.85); // D6
  engine.addGlassClick(23.20, 4600, 0.9, 0.0);
  engine.addFluidSpatialWhoosh(24.50, 0.48, 0.85, 1);

  // ==========================================
  // ACT 6 (25.00s - 30.00s): SOVEREIGN MASTER LOCKUP
  // Grand Apple Intelligence Aura & Harmonious Finish
  // ==========================================
  engine.addAcousticChord(25.00, 164.81, 4.8, 1.0); // Majestic E Maj9
  engine.addSubSwell(25.00, 4.0, 36, 55, 0.95);
  engine.addCupertinoKick(25.00, 0.95);
  engine.addGlassClick(25.00, 4400, 0.85, 0.0);

  // "APPLE" (25.60s)
  engine.addMetallicChime(25.60, 659.25, 3.2, 0.85, -0.2);
  engine.addGlassClick(25.60, 3800, 0.8, -0.2);

  // "INTELLIGENCE." (26.30s)
  engine.addCupertinoKick(26.30, 0.9);
  engine.addAcousticRimshot(26.30, 0.85, 0.2);
  engine.addMetallicChime(26.30, 987.77, 3.6, 0.9, 0.2); // B5 overtone

  // Final shimmering celesta ping
  engine.addMetallicChime(27.40, 1318.51, 2.6, 0.75, 0.0); // E6

  // Export to disk
  engine.exportWav(outputPath);
  return outputPath;
}

if (process.argv[1]?.endsWith('audio-synth-apple.mjs')) {
  generateAppleLaunchAudio();
}
