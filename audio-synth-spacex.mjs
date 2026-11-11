import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Procedural Aerospace Audio Synthesizer for SpaceX xAI India Launch Video
 * Full 30.00s Launch Reel @ 48kHz 16-Bit Stereo PCM WAV
 * 148 BPM High-Energy Aerospace Breakbeat:
 * - Starship Rocket Engine LOX Rumble Sub-Bass (Raptor 3 turbopump & flame resonance)
 * - Rapid Metallic Mechanical Servo Clicks & Gimbal Actuators
 * - Precision Radar Telemetry Pings & Grok 3 Neural Chirps
 * - Driving Acoustic Aerospace Snare & 16th Hi-Hats
 */
export class SpaceXAudioEngine {
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

  // 1. Starship LOX Combustion & Turbopump Sub-Bass Rumble
  addLoxRumble(startTime, duration = 4.0, gain = 0.65, lowFreq = 34) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    let lastNoiseL = 0;
    let lastNoiseR = 0;

    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const progress = i / count;
      // Smooth attack and release envelope
      const env = Math.sin(progress * Math.PI) * gain;

      // Filtered brownian noise for exhaust turbulence
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      lastNoiseL = (lastNoiseL + (0.025 * whiteL)) / 1.025;
      lastNoiseR = (lastNoiseR + (0.025 * whiteR)) / 1.025;

      // Deep combustion sine fundamentals (32Hz, 48Hz, 64Hz)
      const sub1 = Math.sin(2 * Math.PI * lowFreq * t);
      const sub2 = Math.sin(2 * Math.PI * (lowFreq * 1.5) * t) * 0.45;
      const hum = Math.sin(2 * Math.PI * 120 * t + Math.sin(2 * Math.PI * 6 * t) * 1.5) * 0.15;

      const sigL = (lastNoiseL * 3.5 + sub1 + sub2 + hum) * env;
      const sigR = (lastNoiseR * 3.5 + sub1 * 0.95 + sub2 * 1.05 + hum) * env;

      this.addSample(startIdx + i, Math.tanh(sigL * 1.2), Math.tanh(sigR * 1.2));
    }
  }

  // 2. Heavy Aerospace Kick Drum (148Hz -> 36Hz)
  addKick(startTime, startFreq = 148, endFreq = 36, duration = 0.28, gain = 1.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const freq = (startFreq - endFreq) * Math.exp(-t * 30) + endFreq;
      const env = Math.exp(-t * 11.5) * gain;
      const punch = Math.sin(2 * Math.PI * freq * t);
      const click = (i < 96) ? (Math.random() * 2 - 1) * 0.4 : 0;
      const s = Math.tanh((punch + click) * 2.4) * env;
      this.addSample(startIdx + i, s, s);
    }
  }

  // 3. Crisp Driving Aerospace Snare / Rimshot
  addAcousticSnare(startTime, gain = 0.85) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.18 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const tone = Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 35);
      const tone2 = Math.sin(2 * Math.PI * 330 * t) * Math.exp(-t * 45) * 0.3;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 22);
      const crack = Math.sin(2 * Math.PI * 1950 * t) * Math.exp(-t * 120) * 0.4;
      const s = (tone * 0.4 + tone2 + noise * 0.7 + crack) * gain;
      this.addSample(startIdx + i, s * 0.95, s * 1.05);
    }
  }

  // 4. Rapid Metallic Mechanical Servo Gimbal Click
  addMechanicalServo(startTime, duration = 0.12, gain = 0.65, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const progress = i / count;
      // High-speed stepper whir
      const whirFreq = 800 + Math.sin(progress * Math.PI * 8) * 450;
      const tone = Math.sin(2 * Math.PI * whirFreq * t);
      const metallic = Math.sin(2 * Math.PI * 4800 * t) * 0.4;
      const clicks = (Math.random() > 0.85 ? 1 : 0) * (Math.random() * 2 - 1) * 0.7;
      const env = Math.exp(-progress * 4.0) * Math.sin(progress * Math.PI) * gain;
      const s = (tone * 0.5 + metallic + clicks) * env;
      this.addSample(startIdx + i, s * (1 - pan * 0.5), s * (1 + pan * 0.5));
    }
  }

  // 5. Radar Telemetry Beep / Trajectory Lock Ping
  addTelemetryBeep(startTime, freq = 2800, duration = 0.06, gain = 0.55, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 45) * gain;
      const tone = Math.sin(2 * Math.PI * freq * t);
      const harmonic = Math.sin(2 * Math.PI * (freq * 2) * t) * 0.25;
      const s = (tone + harmonic) * env;
      this.addSample(startIdx + i, s * (1 - pan * 0.4), s * (1 + pan * 0.4));
    }
  }

  // 6. Neural Radar Sweep Ping with Echo (Grok Guidance)
  addRadarSweepPing(startTime, freq = 2100, echoDelay = 0.09, gain = 0.6) {
    this.addTelemetryBeep(startTime, freq, 0.08, gain, -0.2);
    this.addTelemetryBeep(startTime + echoDelay, freq * 1.25, 0.06, gain * 0.45, 0.3);
    this.addTelemetryBeep(startTime + echoDelay * 2, freq * 1.5, 0.04, gain * 0.22, -0.1);
  }

  // 7. Tactile Typography Pop (Word Hits)
  addWordPop(startTime, pitch = 3200, gain = 0.65, pan = 0.0) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(0.04 * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 320);
      const tone = Math.sin(2 * Math.PI * pitch * t) * Math.exp(-t * 200);
      const sub = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-t * 60) * 0.5;
      const s = (noise * 0.35 + tone * 0.55 + sub) * gain;
      this.addSample(startIdx + i, s * (1 - pan * 0.35), s * (1 + pan * 0.35));
    }
  }

  // 8. Rocket Ascending Riser / Supersonic Sweep
  addRocketSweep(startTime, duration = 1.8, gain = 0.75) {
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);
    for (let i = 0; i < count; i++) {
      const p = i / count;
      const t = i / this.sampleRate;
      const freq = 120 * Math.pow(12.0, p); // 120Hz to ~1440Hz
      const env = Math.pow(p, 1.8) * Math.exp(-(1 - p) * 0.2) * gain;
      const noise = (Math.random() * 2 - 1) * 0.3 * p;
      const s = (Math.sin(2 * Math.PI * freq * t) + noise) * env;
      this.addSample(startIdx + i, s * 0.92, s * 0.98);
    }
  }

  // 9. Sovereign Aerospace Titanium Chord (D minor / F / A / C aerospace harmonics)
  addAerospaceChord(startTime, root = 146.83, duration = 3.2, gain = 0.85) {
    const freqs = [root, root * 1.2, root * 1.498, root * 1.782, root * 2.245];
    const startIdx = Math.floor(startTime * this.sampleRate);
    const count = Math.floor(duration * this.sampleRate);

    for (let i = 0; i < count; i++) {
      const t = i / this.sampleRate;
      const env = Math.exp(-t * 1.6) * gain;
      let s = 0;
      for (let f = 0; f < freqs.length; f++) {
        const tone = Math.sin(2 * Math.PI * freqs[f] * t);
        const shimmer = Math.sin(2 * Math.PI * (freqs[f] * 2.01) * t) * 0.25;
        s += (tone + shimmer) * (1 / (f + 1));
      }
      const warm = Math.tanh(s * 1.4) * env;
      this.addSample(startIdx + i, warm * 0.95, warm * 1.05);
    }
  }

  // 10. 148 BPM High-Energy Breakbeat & Synth Bass Sequence
  addBreakbeatGroove(startTime, endTime, bpm = 148) {
    const beatInterval = 60 / bpm; // ~0.4054s
    let t = startTime;
    let step = 0;

    // Aerospace synth bass notes (D2, D2, F2, G2, A2, F2, C3, D2)
    const bassline = [73.42, 73.42, 87.31, 98.00, 110.0, 87.31, 130.81, 73.42];

    while (t < endTime) {
      const barStep = step % 8;

      // Heavy Kick Pattern (Aerospace Breakbeat Syncopation)
      if (barStep === 0 || barStep === 3 || barStep === 6) {
        this.addKick(t, 148, 36, 0.26, 0.95);
      } else if (barStep === 4) {
        this.addKick(t, 110, 40, 0.16, 0.6);
      }

      // Snare on 2 and 6 (every half-measure)
      if (barStep === 2 || barStep === 6) {
        this.addAcousticSnare(t, 0.85);
      } else if (barStep === 7) {
        // Ghost snare roll
        this.addAcousticSnare(t, 0.45);
      }

      // 16th Hi-Hats & Telemetry Ticks
      for (let sub = 0; sub < 4; sub++) {
        const hatTime = t + sub * (beatInterval / 4);
        if (hatTime < endTime) {
          const isAccent = (sub === 0 || sub === 2);
          const hatGain = isAccent ? 0.26 : 0.15;
          const pan = (sub % 2 === 0) ? -0.3 : 0.3;
          const startIdx = Math.floor(hatTime * this.sampleRate);
          const count = Math.floor(0.022 * this.sampleRate);
          for (let k = 0; k < count; k++) {
            const hT = k / this.sampleRate;
            const noise = (Math.random() * 2 - 1) * Math.exp(-hT * 420);
            const metallic = Math.sin(2 * Math.PI * 8200 * hT) * Math.exp(-hT * 350);
            const s = (noise * 0.45 + metallic * 0.55) * hatGain;
            this.addSample(startIdx + k, s * (1 - pan * 0.4), s * (1 + pan * 0.4));
          }
        }
      }

      // Aerospace Synth Bassline (Aggressive Pumping Sawtooth)
      const bassFreq = bassline[step % bassline.length];
      const startIdx = Math.floor(t * this.sampleRate);
      const noteCount = Math.floor(beatInterval * 0.82 * this.sampleRate);
      for (let i = 0; i < noteCount; i++) {
        const sTime = i / this.sampleRate;
        const fund = Math.sin(2 * Math.PI * bassFreq * sTime);
        const second = Math.sin(2 * Math.PI * (bassFreq * 2) * sTime) * 0.4;
        const sub = Math.sin(2 * Math.PI * (bassFreq * 0.5) * sTime) * 0.5;
        const env = Math.exp(-sTime * 5.2) * 0.46;
        const s = Math.tanh((fund + second + sub) * 1.8) * env;
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
    console.log(`[SpaceXAudioEngine] Peak: ${peak.toFixed(3)}, Normalization factor: ${norm.toFixed(3)}`);

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

      // Fade out last 35ms to prevent pops/clicks
      if (i > this.totalSamples - Math.floor(0.035 * this.sampleRate)) {
        const fade = (this.totalSamples - i) / (0.035 * this.sampleRate);
        sL *= fade;
        sR *= fade;
      }

      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sL * 0x7FFF))), offset);
      pcmData.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sR * 0x7FFF))), offset + 2);
      offset += 4;
    }

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const fullBuffer = Buffer.concat([header, pcmData]);
    fs.writeFileSync(outputPath, fullBuffer);
    console.log(`[SpaceXAudioEngine] Saved 30.00s 48kHz WAV -> ${outputPath} (${(fullBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);
  }
}

export function generateSpaceXLaunchAudio(outputPath) {
  if (!outputPath) {
    outputPath = path.join(__dirname, 'dist', 'soundtrack-spacex.wav');
  }

  const engine = new SpaceXAudioEngine(30.0, 48000);

  // Background LOX Engine Turbopump Rumble throughout the entire 30s
  engine.addLoxRumble(0.0, 30.0, 0.45, 32);
  engine.addLoxRumble(4.8, 25.2, 0.55, 42); // Raptor 3 full throttle engagement

  // 148 BPM High-Energy Breakbeat Groove from 0.0s to 27.0s
  engine.addBreakbeatGroove(0.0, 27.2, 148);

  // ========================================================
  // ACT 1: 0.0s - 5.0s ("STARSHIP x GROK." -> "ORBITAL AUTONOMY.")
  // ========================================================
  engine.addKick(0.05, 160, 32, 0.4, 1.1);
  engine.addTelemetryBeep(0.1, 2400, 0.08, 0.7);

  // Word Pops: STARSHIP (0.5s) x (1.1s) GROK (1.6s)
  engine.addWordPop(0.50, 3400, 0.9, -0.2);
  engine.addMechanicalServo(0.52, 0.08, 0.5);

  engine.addWordPop(1.10, 3000, 0.85, 0.0);
  engine.addTelemetryBeep(1.12, 2800, 0.05, 0.6);

  engine.addWordPop(1.60, 3800, 1.0, 0.2);
  engine.addMechanicalServo(1.62, 0.12, 0.7);
  engine.addAcousticSnare(1.62, 0.9);

  // ORBITAL (2.6s) AUTONOMY (3.3s)
  engine.addWordPop(2.60, 3200, 0.9, -0.15);
  engine.addTelemetryBeep(2.62, 3100, 0.07, 0.65);

  engine.addWordPop(3.30, 3900, 1.0, 0.25);
  engine.addMechanicalServo(3.32, 0.14, 0.75);
  engine.addKick(3.30, 150, 36, 0.35, 1.0);

  // Act 1 to 2 transition sweep
  engine.addRocketSweep(4.2, 0.8, 0.6);

  // ========================================================
  // ACT 2: 5.0s - 10.0s (Starship Vector Engine Gimbal HUD)
  // ========================================================
  engine.addKick(5.00, 155, 34, 0.35, 1.0);
  engine.addTelemetryBeep(5.02, 2600, 0.1, 0.8);

  // Metric 1: Altitude 142.4 km (5.8s)
  engine.addMechanicalServo(5.80, 0.1, 0.7, -0.3);
  engine.addTelemetryBeep(5.82, 3200, 0.05, 0.7);

  // Metric 2: Velocity 7,850 m/s (6.8s)
  engine.addMechanicalServo(6.80, 0.1, 0.75, 0.3);
  engine.addTelemetryBeep(6.82, 3600, 0.05, 0.75);

  // Metric 3: LOX 98.4% (7.8s)
  engine.addMechanicalServo(7.80, 0.1, 0.7, -0.2);
  engine.addTelemetryBeep(7.82, 4000, 0.05, 0.75);

  // Metric 4: Throttle 100% Full Thrust (8.8s)
  engine.addKick(8.80, 160, 32, 0.35, 1.1);
  engine.addAcousticSnare(8.82, 0.95);
  engine.addMechanicalServo(8.82, 0.16, 0.9, 0.0);
  engine.addTelemetryBeep(8.85, 4400, 0.08, 0.85);

  // Transition to Act 3
  engine.addRocketSweep(9.2, 0.8, 0.65);

  // ========================================================
  // ACT 3: 10.0s - 15.0s (Grok 3 Autonomous Neural Guidance)
  // ========================================================
  engine.addKick(10.00, 150, 35, 0.35, 1.0);
  engine.addRadarSweepPing(10.05, 2200, 0.1, 0.8);

  // Radar Vector Grid Locking Sequence (11.0s, 12.0s, 13.0s, 14.0s)
  engine.addRadarSweepPing(11.20, 2400, 0.08, 0.75);
  engine.addMechanicalServo(11.25, 0.09, 0.6);

  engine.addRadarSweepPing(12.40, 2700, 0.08, 0.8);
  engine.addWordPop(12.42, 3600, 0.85, -0.2);

  // Neural trajectory lock achieved (13.6s)
  engine.addKick(13.60, 155, 34, 0.3, 1.0);
  engine.addAcousticSnare(13.62, 0.9);
  engine.addRadarSweepPing(13.65, 3200, 0.07, 0.9);
  engine.addTelemetryBeep(14.00, 4800, 0.1, 0.85);

  // ========================================================
  // ACT 4: 15.0s - 20.0s (Bilingual Aerospace: SPACEX AI INDIA -> अन्तरिक्ष स्वायत्तता)
  // ========================================================
  engine.addKick(15.00, 160, 32, 0.4, 1.1);
  engine.addAerospaceChord(15.05, 146.83, 2.5, 0.7);

  // SPACEX (15.4s) AI (16.0s) INDIA (16.6s)
  engine.addWordPop(15.40, 3300, 0.9, -0.2);
  engine.addMechanicalServo(15.42, 0.1, 0.65);

  engine.addWordPop(16.00, 3600, 0.85, 0.0);
  engine.addTelemetryBeep(16.02, 3400, 0.06, 0.7);

  engine.addWordPop(16.60, 4100, 1.0, 0.2);
  engine.addKick(16.60, 150, 36, 0.3, 0.95);
  engine.addAcousticSnare(16.62, 0.85);

  // Hindi Aerospace Typography: अन्तरिक्ष स्वायत्तता (17.8s)
  engine.addWordPop(17.80, 4400, 1.05, 0.0);
  engine.addRadarSweepPing(17.85, 2900, 0.09, 0.85);
  engine.addMechanicalServo(17.90, 0.15, 0.8);
  engine.addKick(17.80, 165, 30, 0.4, 1.15);

  // ========================================================
  // ACT 5: 20.0s - 25.0s ("PLANETARY COMPUTE." -> "STARLINK REAL-TIME MESH.")
  // ========================================================
  engine.addKick(20.00, 150, 35, 0.35, 1.0);
  engine.addRocketSweep(20.10, 1.2, 0.7);

  // PLANETARY (20.5s) COMPUTE (21.2s)
  engine.addWordPop(20.50, 3200, 0.9, -0.2);
  engine.addWordPop(21.20, 3700, 0.95, 0.2);
  engine.addAcousticSnare(21.22, 0.9);

  // STARLINK (22.2s) REAL-TIME (22.9s) MESH (23.6s)
  engine.addWordPop(22.20, 3400, 0.85, -0.25);
  engine.addTelemetryBeep(22.22, 3800, 0.06, 0.7);

  engine.addWordPop(22.90, 3800, 0.9, 0.0);
  engine.addMechanicalServo(22.92, 0.1, 0.7);

  engine.addWordPop(23.60, 4500, 1.05, 0.25);
  engine.addKick(23.60, 160, 32, 0.35, 1.1);
  engine.addAcousticSnare(23.62, 0.95);

  // High-Energy Climax Build Riser (24.0s - 25.5s)
  engine.addRocketSweep(24.00, 1.5, 0.9);

  // ========================================================
  // ACT 6: 25.0s - 30.0s (Sovereign Climax: SPACEX // GROK 3 INDIA)
  // ========================================================
  // Heavy Climax Drop on 25.5s
  engine.addKick(25.50, 175, 28, 0.6, 1.25);
  engine.addAcousticSnare(25.52, 1.0);
  engine.addMechanicalServo(25.52, 0.2, 0.95);
  engine.addRadarSweepPing(25.55, 3300, 0.12, 0.95);

  // Massive LOX Exhaust Rumble Surge
  engine.addLoxRumble(25.5, 4.5, 0.85, 28);

  // Sovereign Lockup Chord
  engine.addAerospaceChord(25.60, 146.83, 4.0, 0.95);

  // Synchronized Master Lockup Pops
  engine.addWordPop(25.80, 3600, 0.9, -0.3);
  engine.addWordPop(26.40, 4200, 1.0, 0.0);
  engine.addWordPop(27.00, 4800, 1.1, 0.3);
  engine.addTelemetryBeep(27.05, 5200, 0.15, 0.9);

  engine.exportWav(outputPath);
}

if (process.argv[1]?.endsWith('audio-synth-spacex.mjs')) {
  generateSpaceXLaunchAudio();
}
