import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Procedural Audio Synthesizer for Claude 3.7 Launch Video (30.00s @ 48kHz Stereo)
 * 138 BPM Warm Lo-Fi Tech Groove:
 * - Organic Warm Rhodes Chords (F minor progression: Fm9 -> DbMaj9 -> Bbm9 -> Eb9/C7alt)
 * - Gentle Vinyl Crackle & Analog Surface Dust
 * - Crisp Wood Rimshots (Beats 2 and 4)
 * - Typewriter / Mechanical Keystrokes for kinetic text pops & code stream
 * - Resonant Rounded Analog Sub Bass
 * - Sunburst Chime & Sovereign Aperture Outro
 */
export class ClaudeAudioEngine {
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

  // 1. Vinyl Crackle & Ambient Room Dust
  addVinylCrackle(gain = 0.045) {
    let rumblePhase = 0;
    for (let i = 0; i < this.totalSamples; i++) {
      const t = i / this.sampleRate;
      rumblePhase += 0.003;
      const lowRumble = Math.sin(rumblePhase * 37) * 0.25 + Math.sin(rumblePhase * 53) * 0.15;
      
      let pop = 0;
      // Random pops and ticks
      if (Math.random() < 0.0018) {
        pop = (Math.random() * 2 - 1) * Math.pow(Math.random(), 3.5) * 4.2;
      }
      
      const hiss = (Math.random() * 2 - 1) * 0.22;
      const sample = (lowRumble * 0.15 + pop + hiss) * gain;
      this.addSample(i, sample * 0.95, sample * 1.05);
    }
  }

  // 2. Organic Rhodes Piano Chord in F Minor
  addRhodesChord(startTime, rootFreq = 174.61, chordType = 'm9', duration = 3.2, gain = 0.70) {
    // Chord voicings around F minor
    let chordFreqs = [];
    if (chordType === 'm9') { // Fm9: F3, Ab3, C4, Eb4, G4
      chordFreqs = [rootFreq, rootFreq * 1.1892, rootFreq * 1.4983, rootFreq * 1.7818, rootFreq * 2.245];
    } else if (chordType === 'maj9') { // DbMaj9: Db3, F3, Ab3, C4, Eb4
      chordFreqs = [rootFreq, rootFreq * 1.2599, rootFreq * 1.4983, rootFreq * 1.8877, rootFreq * 2.245];
    } else if (chordType === 'm7') { // Bbm7: Bb2, Db3, F3, Ab3, C4
      chordFreqs = [rootFreq, rootFreq * 1.1892, rootFreq * 1.4983, rootFreq * 1.7818, rootFreq * 2.138];
    } else { // Eb9 or C7alt
      chordFreqs = [rootFreq, rootFreq * 1.2599, rootFreq * 1.4983, rootFreq * 1.7818, rootFreq * 2.245];
    }

    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);

    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 2.2) * gain;
      let s = 0;
      for (let c = 0; c < chordFreqs.length; c++) {
        const f = chordFreqs[c];
        const fund = Math.sin(2 * Math.PI * f * t);
        const second = Math.sin(2 * Math.PI * (f * 2.002) * t) * 0.32 * Math.exp(-t * 4.0);
        const tine = Math.sin(2 * Math.PI * (f * 4.6) * t) * 0.18 * Math.exp(-t * 9.0);
        s += (fund + second + tine) * (1 / (c + 1.15));
      }
      // Tube saturation
      const warm = Math.tanh(s * 1.35) * env;
      this.addSample(startIdx + i, warm * 0.92, warm * 0.98);
    }
  }

  // 3. Crisp Acoustic Wood Rimshot
  addWoodRimshot(startTime, gain = 0.58) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.14 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 95);
      const woodTone = Math.sin(2 * Math.PI * 490 * t) * Math.exp(-t * 65);
      const snap = Math.sin(2 * Math.PI * 1920 * t) * Math.exp(-t * 200);
      const body = Math.sin(2 * Math.PI * 260 * t) * Math.exp(-t * 50);
      const s = (noise * 0.35 + woodTone * 0.45 + snap * 0.5 + body * 0.25) * gain;
      this.addSample(startIdx + i, s * 0.96, s * 1.04);
    }
  }

  // 4. Punchy Analog Lo-Fi Kick
  addAnalogKick(startTime, startFreq = 120, endFreq = 44, duration = 0.30, gain = 0.80) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const freq = (startFreq - endFreq) * Math.exp(-t * 22) + endFreq;
      const env = Math.exp(-t * 9.5) * gain;
      const raw = Math.sin(2 * Math.PI * freq * t);
      const click = (Math.random() * 2 - 1) * Math.exp(-t * 260) * 0.25;
      const s = Math.tanh((raw + click) * 1.6) * env;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 5. Typewriter / Lubed Mechanical Keystroke
  addKeystroke(startTime, pitch = 2800, gain = 0.42, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.035 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 360);
      const thud = Math.sin(2 * Math.PI * 320 * t) * Math.exp(-t * 130);
      const click = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 240);
      const metal = Math.sin(2 * Math.PI * (pitch * 1.8) * t) * Math.exp(-t * 300) * 0.3;
      const s = (noise * 0.3 + thud * 0.45 + click * 0.6 + metal) * gain;
      this.addSample(startIdx + i, s * (1 - pan * 0.5), s * (1 + pan * 0.5));
    }
  }

  // 6. Computer Mouse Click Simulation (tactile Omron microswitch)
  addMouseClick(startTime, gain = 0.5) {
    this.addKeystroke(startTime, 3600, gain * 0.85, 0.15);
    // Slight release click 45ms later
    this.addKeystroke(startTime + 0.045, 3900, gain * 0.45, 0.15);
  }

  // 7. Paper Whoosh / Whip Transition
  addPaperWhoosh(startTime, duration = 0.38, gain = 0.55, dir = 1) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const env = Math.sin(p * Math.PI);
      const noise = (Math.random() * 2 - 1);
      const s = noise * Math.pow(env, 2.2) * gain;
      const pan = (p * 2 - 1) * dir;
      this.addSample(startIdx + i, s * (0.6 - pan * 0.4), s * (0.6 + pan * 0.4));
    }
  }

  // 8. Resonant Analog Sub Bass Note
  addSubBassNote(startTime, freq = 43.65, duration = 0.40, gain = 0.65) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const fund = Math.sin(2 * Math.PI * freq * t);
      const warm2nd = Math.sin(2 * Math.PI * (freq * 2) * t) * 0.38;
      const env = Math.exp(-t * 3.5) * gain;
      const s = Math.tanh((fund + warm2nd) * 1.3) * env;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 9. Sunburst Chime / Crystalline Resonance
  addSunburstChime(startTime, rootFreq = 880, duration = 3.5, gain = 0.70) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    const harmonics = [1, 2.01, 3.02, 4.05, 5.08];
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 1.8) * gain;
      let s = 0;
      for (let h = 0; h < harmonics.length; h++) {
        const f = rootFreq * harmonics[h];
        s += Math.sin(2 * Math.PI * f * t) * (1 / (h + 1.2));
      }
      this.addSample(startIdx + i, s * env * 0.75, s * env * 0.85);
    }
  }

  // 10. Master Groove Generator (138 BPM)
  addLoFiGroove(startTime, endTime, bpm = 138) {
    const beatInterval = 60 / bpm; // ~0.43478s
    let t = startTime;
    let step = 0;

    // F minor progression roots for bass & chords:
    // 0-4 beats: F2 (87.31) / Fm
    // 4-8 beats: Db2 (69.30) / DbMaj
    // 8-12 beats: Bb1 (58.27) / Bbm
    // 12-16 beats: Eb2 (77.78) or C2 (65.41) / C7
    const basslinePattern = [
      87.31, 87.31, 87.31, 103.83, // F -> Ab
      69.30, 69.30, 69.30, 87.31,  // Db -> F
      58.27, 58.27, 58.27, 69.30,  // Bb -> Db
      77.78, 77.78, 65.41, 73.42   // Eb -> C -> D
    ];

    while (t < endTime) {
      const beatInBar = step % 4;

      // Kick Drum on 1 and 3 (with subtle ghost on 3.5)
      if (beatInBar === 0) {
        this.addAnalogKick(t, 125, 42, 0.28, 0.78);
      } else if (beatInBar === 2) {
        this.addAnalogKick(t, 115, 40, 0.24, 0.72);
      }

      // Crisp Wood Rimshot on 2 and 4
      if (beatInBar === 1 || beatInBar === 3) {
        this.addWoodRimshot(t, 0.58);
      }

      // 16th-note Keystroke Hi-Hats / Shaker
      for (let sub = 0; sub < 4; sub++) {
        const hatTime = t + sub * (beatInterval / 4);
        if (hatTime < endTime) {
          const isAccent = (sub === 0 || sub === 2);
          const hatGain = isAccent ? 0.20 : 0.11;
          const pan = (sub % 2 === 0) ? -0.22 : 0.22;
          this.addKeystroke(hatTime, 6400 + (sub * 300), hatGain, pan);
        }
      }

      // Sub Bass
      const bassFreq = basslinePattern[step % basslinePattern.length];
      this.addSubBassNote(t, bassFreq, beatInterval * 0.85, 0.55);

      t += beatInterval;
      step++;
    }
  }

  // Master Normalization & WAV Export
  exportWav(outputPath) {
    let peak = 0;
    for (let i = 0; i < this.totalSamples; i++) {
      if (Math.abs(this.left[i]) > peak) peak = Math.abs(this.left[i]);
      if (Math.abs(this.right[i]) > peak) peak = Math.abs(this.right[i]);
    }

    const norm = peak > 0.94 ? (0.94 / peak) : 1.0;
    console.log(`[ClaudeAudio] Peak: ${peak.toFixed(3)}, Normalization factor: ${norm.toFixed(3)}`);

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

      // Fade out last 60ms to prevent click
      if (i > this.totalSamples - Math.floor(0.06 * this.sampleRate)) {
        const fade = (this.totalSamples - i) / (0.06 * this.sampleRate);
        sL *= fade;
        sR *= fade;
      }

      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sL * 0x7FFF))), offset);
      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sR * 0x7FFF))), offset + 2);
      offset += 4;
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, Buffer.concat([header, pcmData]));
    console.log(`[ClaudeAudio] Rendered master WAV (30.00s @ 48kHz Stereo) -> ${outputPath}`);
  }
}

// Master Audio Composer for Claude 30s Launch Video
export function generateClaudeSoundtrack(outputPath = path.join(__dirname, 'dist/soundtrack-claude.wav')) {
  console.log(`[ClaudeAudio] Composing 30.00-second 138 BPM Claude Launch Soundtrack...`);
  const engine = new ClaudeAudioEngine(30.0, 48000);

  // Background Vinyl Atmosphere
  engine.addVinylCrackle(0.038);

  // --- ACT 1 (0.00s - 5.00s): THOUGHT TO CODE -> CLAUDE 3.7 SONNET ---
  // 0.00s: Opening Warm Rhodes Chords (Fm9)
  engine.addRhodesChord(0.00, 174.61, 'm9', 3.0, 0.75); // Fm9
  engine.addKeystroke(0.00, 2900, 0.75);

  // Word-by-word kinetic hits: "THOUGHT" (0.5s), "TO" (1.2s), "CODE." (1.8s)
  engine.addKeystroke(0.50, 3100, 0.65, -0.2);
  engine.addKeystroke(1.20, 3300, 0.65, 0.0);
  engine.addKeystroke(1.80, 2600, 0.85, 0.2);
  engine.addPaperWhoosh(1.75, 0.35, 0.60, 1);

  // 2.60s: Model Reveal "CLAUDE 3.7 SONNET"
  engine.addRhodesChord(2.60, 138.59, 'maj9', 2.8, 0.78); // DbMaj9
  engine.addAnalogKick(2.60, 120, 42, 0.32, 0.82);
  engine.addKeystroke(2.60, 3400, 0.75);

  // --- ACT 2 (5.00s - 10.00s): INTERACTIVE LIVE ARTIFACTS ENGINE ---
  // Driving groove kicks in at 5.00s
  engine.addLoFiGroove(5.00, 25.00, 138);

  // 5.20s: Split Screen Whoosh & Code Assembly Stream
  engine.addPaperWhoosh(5.00, 0.40, 0.65, -1);
  engine.addRhodesChord(5.20, 116.54, 'm7', 2.8, 0.70); // Bbm7

  // Rapid typewriter / mechanical keyboard cascade for live code typing (5.4s - 7.5s)
  for (let k = 0; k < 18; k++) {
    const tapTime = 5.40 + k * 0.11;
    const pitch = 2800 + (k % 6) * 180;
    const pan = ((k % 4) - 1.5) * 0.25;
    engine.addKeystroke(tapTime, pitch, 0.35, pan);
  }

  // 7.80s: Live Artifact Window Snaps Active
  engine.addRhodesChord(7.80, 155.56, 'dom9', 2.8, 0.72); // Eb9
  engine.addMouseClick(7.80, 0.75);
  engine.addWoodRimshot(7.82, 0.65);

  // --- ACT 3 (10.00s - 15.00s): COMPUTER USE & AUTONOMOUS AGENTS ---
  // 10.20s: Chords transition back to Fm9
  engine.addRhodesChord(10.20, 174.61, 'm9', 2.8, 0.72);
  engine.addPaperWhoosh(10.10, 0.35, 0.60, 1);

  // Mouse cursor moves and clicks:
  engine.addMouseClick(11.40, 0.70);
  engine.addMouseClick(12.70, 0.75);
  engine.addMouseClick(13.90, 0.80);

  // Quick keystroke bash command simulation at 14.1s
  for (let k = 0; k < 8; k++) {
    engine.addKeystroke(14.05 + k * 0.08, 3000 + (k % 3) * 250, 0.38, 0.1);
  }

  // --- ACT 4 (15.00s - 20.00s): HYBRID REASONING & EXTENDED THINKING ---
  // 15.20s: DbMaj9 Chord
  engine.addRhodesChord(15.20, 138.59, 'maj9', 3.0, 0.76);
  engine.addPaperWhoosh(15.00, 0.40, 0.62, -1);

  // Extended thinking token acceleration clicks (smoothly accelerating tempo)
  const tokenTimes = [15.6, 16.1, 16.5, 16.85, 17.15, 17.4, 17.62, 17.82, 18.0, 18.15, 18.28, 18.4, 18.5, 18.6];
  tokenTimes.forEach((tk, idx) => {
    const pitch = 2400 + idx * 120;
    engine.addKeystroke(tk, pitch, 0.30 + idx * 0.015, (idx % 2 === 0 ? -0.15 : 0.15));
  });

  // 18.80s: Thinking resolved - resonant sub bloom & chime
  engine.addRhodesChord(18.80, 116.54, 'm7', 2.8, 0.75); // Bbm7
  engine.addSunburstChime(18.80, 784.0, 2.0, 0.55); // G5 chime

  // --- ACT 5 (20.00s - 25.00s): WARM EDITORIAL CRAFT -> ZERO SLOP ---
  // 20.20s: Eb9 / C7alt chord transition
  engine.addRhodesChord(20.20, 155.56, 'dom9', 2.6, 0.75);
  engine.addPaperWhoosh(20.00, 0.42, 0.70, 1);

  // Triple tactile hits for "WARM" -> "EDITORIAL" -> "CRAFT"
  engine.addKeystroke(20.50, 2900, 0.65, -0.2);
  engine.addKeystroke(21.20, 3100, 0.65, 0.0);
  engine.addKeystroke(21.90, 3400, 0.75, 0.2);

  // 22.80s: "ZERO SLOP" Strobe Impact
  engine.addAnalogKick(22.80, 135, 38, 0.38, 0.88);
  engine.addWoodRimshot(22.80, 0.75);
  engine.addKeystroke(22.80, 2200, 0.80);

  // --- ACT 6 (25.00s - 30.00s): SOVEREIGN MASTER LOCKUP "ANTHROPIC // CLAUDE" ---
  // Final resolution into deep Fm9 chord + sunburst chime + resonant sub bass
  engine.addAnalogKick(25.00, 140, 34, 0.55, 0.95);
  engine.addWoodRimshot(25.00, 0.80);
  engine.addPaperWhoosh(24.95, 0.50, 0.75, 1);

  engine.addRhodesChord(25.10, 174.61, 'm9', 4.5, 0.90); // Fm9 sustained
  engine.addSubBassNote(25.10, 43.65, 4.0, 0.75); // Low F1 fundamental
  engine.addSunburstChime(25.15, 1046.5, 4.2, 0.85); // High C6 sunburst chime
  engine.addSunburstChime(25.40, 1318.5, 3.8, 0.65); // E6 sparkle

  // Terminal prompt keystrokes at 27.2s ($ claude ...)
  for (let k = 0; k < 6; k++) {
    engine.addKeystroke(27.20 + k * 0.09, 3200 + (k % 4) * 200, 0.35, 0.0);
  }

  engine.exportWav(outputPath);
  return outputPath;
}

if (process.argv[1]?.endsWith('audio-synth-claude.mjs')) {
  generateClaudeSoundtrack();
}
