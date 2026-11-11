import fs from 'fs';
import path from 'path';

/**
 * Procedural Audio Synthesizer for Claude-Grade Light-Mode Launch Video (15.00s @ 48kHz Stereo)
 * Warm Rhodes Piano, Lo-Fi Tech Groove, Mechanical Haptics, and Crystal Chime Finish
 */
class LightAudioEngine {
  constructor(durationSeconds = 15.0, sampleRate = 48000) {
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

  // 1. Warm Acoustic Rhodes / Felt Piano Chord (Frequencies in Hz)
  addRhodesChord(startTime, rootFreq = 138.59, duration = 2.4, gain = 0.75) {
    // Db Maj9 voicing: Db3 (138.59), F3 (174.61), Ab3 (207.65), C4 (261.63), Eb4 (311.13)
    const chord = [rootFreq, rootFreq * 1.2599, rootFreq * 1.4983, rootFreq * 1.8877, rootFreq * 2.245];
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);

    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 2.8) * gain;
      let s = 0;
      for (let c = 0; c < chord.length; c++) {
        const f = chord[c];
        // Bell tines + warm fundamental
        const fundamental = Math.sin(2 * Math.PI * f * t);
        const overtone = Math.sin(2 * Math.PI * (f * 2) * t) * 0.35 * Math.exp(-t * 5.0);
        const tine = Math.sin(2 * Math.PI * (f * 4.5) * t) * 0.15 * Math.exp(-t * 12.0);
        s += (fundamental + overtone + tine) * (1 / (c + 1.2));
      }
      // Warm tube saturation
      const warm = Math.tanh(s * 1.2) * env;
      this.addSample(startIdx + i, warm * 0.9, warm * 0.9);
    }
  }

  // 2. Punchy Lo-Fi Analog Kick Drum
  addAnalogKick(startTime, startFreq = 110, endFreq = 42, duration = 0.32, gain = 0.85) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const freq = (startFreq - endFreq) * Math.exp(-t * 18) + endFreq;
      const env = Math.exp(-t * 8.5) * gain;
      const raw = Math.sin(2 * Math.PI * freq * t);
      const s = Math.tanh(raw * 1.8) * env;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 3. Acoustic Wood Rimshot / Snare
  addWoodRimshot(startTime, gain = 0.6) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.12 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 90);
      const tone = Math.sin(2 * Math.PI * 480 * t) * Math.exp(-t * 60);
      const snap = Math.sin(2 * Math.PI * 1850 * t) * Math.exp(-t * 180);
      const s = (noise * 0.4 + tone * 0.45 + snap * 0.5) * gain;
      this.addSample(startIdx + i, s * 0.95, s * 1.05);
    }
  }

  // 4. Lubed Mechanical Switch Keystroke (Gateron Oil King profile)
  addKeystroke(startTime, pitch = 2600, gain = 0.45, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.028 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 320);
      const thud = Math.sin(2 * Math.PI * 340 * t) * Math.exp(-t * 120);
      const click = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 220);
      const s = (noise * 0.35 + thud * 0.5 + click * 0.6) * gain;
      this.addSample(startIdx + i, s * (1 - pan * 0.5), s * (1 + pan * 0.5));
    }
  }

  // 5. Paper Whip / Shutter Whoosh
  addPaperWhoosh(startTime, duration = 0.32, gain = 0.55, dir = 1) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const env = Math.sin(p * Math.PI);
      const noise = (Math.random() * 2 - 1);
      const center = 600 + Math.pow(p, 1.8) * 1400;
      const s = noise * Math.pow(env, 2.0) * gain;
      const pan = (p * 2 - 1) * dir;
      this.addSample(startIdx + i, s * (0.6 - pan * 0.4), s * (0.6 + pan * 0.4));
    }
  }

  // 6. Tactile Wooden Marimba / Pop Tap
  addMarimbaPop(startTime, noteFreq = 523.25, gain = 0.55, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.18 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const fund = Math.sin(2 * Math.PI * noteFreq * t);
      const overtone = Math.sin(2 * Math.PI * (noteFreq * 2.756) * t) * 0.25;
      const env = Math.exp(-t * 24.0) * gain;
      const s = (fund + overtone) * env;
      this.addSample(startIdx + i, s * (1 - pan * 0.4), s * (1 + pan * 0.4));
    }
  }

  // 7. Ascending Harp / Glissando Sweep (52x Benchmark Rocket)
  addGlissando(startTime, duration = 1.6, gain = 0.5) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const t = i / this.sampleRate;
      const freq = 220 * Math.pow(6.5, p); // 220Hz to ~1430Hz
      const env = Math.pow(p, 1.6) * Math.exp(-(1 - p) * 0.5) * gain;
      const s = Math.sin(2 * Math.PI * freq * t) * env;
      this.addSample(startIdx + i, s * 0.85, s * 0.85);
    }
  }

  // 8. 140 BPM Driving Lo-Fi Tech Beat & Rounded Electric Bass
  addDrivingGroove(startTime, endTime, bpm = 140) {
    const beatInterval = 60 / bpm; // ~0.42857s
    let t = startTime;
    let step = 0;

    // Bassline notes: Db2 (69.3), F2 (87.3), Ab2 (103.8), Bb2 (116.5)
    const bassline = [69.3, 87.3, 103.8, 116.5, 69.3, 103.8, 87.3, 116.5];

    while (t < endTime) {
      // Kick on 1 and 3
      if (step % 2 === 0) {
        this.addAnalogKick(t, 115, 38, 0.28, 0.72);
      } else {
        this.addAnalogKick(t, 90, 36, 0.20, 0.48);
      }

      // Wood Rimshot on 2 and 4
      if (step % 2 === 1) {
        this.addWoodRimshot(t, 0.55);
      }

      // Hi-Hats on 8th / 16th notes
      for (let sub = 0; sub < 4; sub++) {
        const hatTime = t + sub * (beatInterval / 4);
        if (hatTime < endTime) {
          const hatGain = (sub % 2 === 0) ? 0.22 : 0.12;
          const pan = (sub % 2 === 0) ? -0.2 : 0.2;
          this.addKeystroke(hatTime, 6800, hatGain, pan);
        }
      }

      // Warm Electric Bass
      const bassFreq = bassline[step % bassline.length];
      const startIdx = Math.floor(t * this.sampleRate);
      const noteCount = Math.floor(beatInterval * 0.88 * this.sampleRate);
      for (let i = 0; i < noteCount; i++) {
        const sTime = i / this.sampleRate;
        const fund = Math.sin(2 * Math.PI * bassFreq * sTime);
        const second = Math.sin(2 * Math.PI * (bassFreq * 2) * sTime) * 0.35;
        const env = Math.exp(-sTime * 4.5) * 0.42;
        const s = (fund + second) * env;
        this.addSample(startIdx + i, s, s);
      }

      t += beatInterval;
      step++;
    }
  }

  // 9. Pure Crystal Bell Chime Outro
  addCrystalChime(startTime, freq = 880, duration = 2.4, gain = 0.75) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 2.2) * gain;
      const s = Math.sin(2 * Math.PI * freq * t) +
                Math.sin(2 * Math.PI * (freq * 2.01) * t) * 0.45 +
                Math.sin(2 * Math.PI * (freq * 3.02) * t) * 0.25;
      this.addSample(startIdx + i, s * env * 0.7, s * env * 0.7);
    }
  }

  // Master Normalization & WAV Export
  exportWav(outputPath) {
    let peak = 0;
    for (let i = 0; i < this.totalSamples; i++) {
      if (Math.abs(this.left[i]) > peak) peak = Math.abs(this.left[i]);
      if (Math.abs(this.right[i]) > peak) peak = Math.abs(this.right[i]);
    }

    const norm = peak > 0.95 ? (0.95 / peak) : 1.0;
    console.log(`[LightAudio] Peak: ${peak.toFixed(3)}, Normalization factor: ${norm.toFixed(3)}`);

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

      // Fade out last 40ms to prevent click
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
    console.log(`[LightAudio] Rendered master WAV -> ${outputPath}`);
  }
}

// Master Audio Composer
export function generateClaudeLightAudio(outputPath = './hyper-motion-studio/dist/soundtrack-light.wav') {
  const engine = new LightAudioEngine(15.0, 48000);

  // 0.00s: Opening Warm Rhodes Chord + Camera Shutter Snap
  engine.addRhodesChord(0.00, 138.59, 2.2, 0.85); // Db Maj9
  engine.addKeystroke(0.00, 3200, 0.75);

  // 0.60s: Fast Paper Whip on "STOP EDITING TIMELINES" Strike-Through
  engine.addPaperWhoosh(0.55, 0.35, 0.65, 1);
  engine.addKeystroke(0.60, 2400, 0.7, -0.2);

  // 1.80s: Rapid Mechanical Keyboard Typing Cascade (Code stream starts)
  for (let k = 0; k < 8; k++) {
    engine.addKeystroke(1.75 + k * 0.055, 3100 + (k % 4) * 220, 0.45, (k % 2 === 0 ? -0.25 : 0.25));
  }

  // 2.40s - 12.00s: 140 BPM Driving Lo-Fi Tech Beat & Rounded Electric Bass
  engine.addDrivingGroove(2.40, 12.00, 140);

  // 4.20s: 4 Marimba Pop Taps for the 4 Bento Cards
  const marimbaNotes = [523.25, 587.33, 659.25, 783.99]; // C5, D5, E5, G5
  marimbaNotes.forEach((n, idx) => {
    engine.addMarimbaPop(4.20 + idx * 0.16, n, 0.6, (idx - 1.5) * 0.3);
  });

  // 7.20s: Ascending Harp / Glissando Sweep (52x Benchmark Rocket)
  engine.addGlissando(7.20, 1.80, 0.7);

  // 9.80s, 10.40s, 11.00s: Camera Aperture Snaps on Responsive Form-Factor Morphs
  engine.addKeystroke(9.80, 2900, 0.65, -0.2);
  engine.addKeystroke(10.40, 3100, 0.65, 0.0);
  engine.addKeystroke(11.00, 3400, 0.75, 0.2);

  // 12.00s - 13.50s: Triple Strobe Impacts: "CODE" -> "COMPILE" -> "SHIP"
  engine.addAnalogKick(12.00, 130, 40, 0.35, 0.9);
  engine.addWoodRimshot(12.00, 0.7);

  engine.addAnalogKick(12.50, 130, 40, 0.35, 0.9);
  engine.addWoodRimshot(12.50, 0.7);

  engine.addAnalogKick(13.00, 140, 34, 0.55, 1.0);
  engine.addWoodRimshot(13.00, 0.85);
  engine.addPaperWhoosh(12.95, 0.45, 0.75, 1);

  // 13.80s: The Sovereign Lockup: Db Maj9 Rhodes Piano + Crystal Chime Resonance
  engine.addRhodesChord(13.80, 138.59, 1.8, 0.9);
  engine.addCrystalChime(13.80, 1046.5, 2.2, 0.75); // C6 crystal chime

  engine.exportWav(outputPath);
}

if (process.argv[1]?.endsWith('audio-synth-light.mjs')) {
  generateClaudeLightAudio();
}
