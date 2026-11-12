---
name: hyper-motion-engine
description: Engineer high-movement, cinema-grade motion graphics launch videos and product teasers entirely in pure code using deterministic HTML5 Canvas/GSAP, procedural stereo sound synthesis, and parallelized Playwright/FFmpeg headless export. Supports both Claude-grade warm editorial light-mode, Cupertino fluid glass, frontier cyber-editorial, and aerospace HUD styles across top AI models (GPT-6.1 Terra, Gemini 4 Carbon, Claude Opus 5.5, Apple Siri AI Fall 2026, SpaceX Grok 4.8, and Build with Caleb).
---

# The Hyper-Motion Engine & Multi-Brand Launch Video Studio

## Overview
`hyper-motion-engine` turns software architectures, frontier AI models, developer tools, and creator brands into high-energy, 30.00-second (and 60.00-second) broadcast-grade motion graphics launch reels with zero manual video editing tools (no After Effects, Premiere, or Final Cut).

Every video is a purely deterministic mathematical function of time:
$$\mathbf{Frame}(t) = \mathcal{R}(\mathcal{S}(t)), \quad t \in [0, T]$$

---

## The Frontier AI Model Launch Brackets

| Brand / Model | Theme & Substrate | Typography & Accents | Signature Motion & Mechanics | Audio Profile | Master MP4 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Build with Caleb** | Warm Ivory Paper (`#F6F5F1`) | Anton Display, Electric Cobalt (`#0052FF`) | Continuous 3D camera spline, real portrait aspect preservation, 9-slice drop shadow | 144 BPM driving tech breakbeat, punchy analog kicks | `build-with-caleb-motion.mp4` |
| **OpenAI // GPT-6.1 Terra** | Dark Obsidian (`#0D0D0E`) | JetBrains Mono, Emerald Mint (`#10A37F`) | Live streaming reasoning trace ("Thinking for 14s..."), vector chiral rosette, 1.05M context | 140 BPM tech groove + deep 808 sub drops | `chatgpt-launch.mp4` |
| **Google Gemini 4 Carbon** | Deep Space Navy (`#040711`) | Inter Variable, Iridescent Gradient (`#4E82EE` $\to$ `#C34085`) | 4-point iridescent star bloom, 32-bar audio spectrum visualizer, 1M continuous decode | 144 BPM luminous breakbeat, crystal chime arpeggios | `gemini-launch.mp4` |
| **Claude Opus 5.5 & Fable 5.2** | Warm Cotton (`#FAF8F5`) | Instrument Serif, Terracotta (`#D97757`) 5% Law | Live split-screen React Artifacts engine, Computer Use simulated pointer, aperture | 138 BPM lo-fi tech groove, warm Rhodes (Fm9), vinyl | `claude-launch.mp4` |
| **Apple Intelligence // Siri AI** | Cupertino Alabaster (`#F5F5F7`) | SF Pro / Inter, Siri Rainbow Fluid Aura | On-Screen Awareness HUD, Personal Context Engine, Private Cloud padlock, M4 die | 136 BPM acoustic hybrid, glass clicks, rimshots, chimes | `apple-launch.mp4` |
| **SpaceX xAI India // Grok 4.8** | Carbon Fiber (`#08090C`) | Inter / Devanagari, LOX Amber (`#FF6B00`) | Starship Raptor 3 gimbal HUD, Grok 4.8 2.5T C++ telemetry, bilingual Hindi/English | 148 BPM aerospace breakbeat, Raptor LOX sub rumble | `spacex-launch.mp4` |

---

## 3-Loop QA Review & Verification Cycle

Every launch video undergoes a mandatory 3-loop automated inspection before release:

```
[Loop 1: Stream & Specs] ──> [Loop 2: 6-Keyframe Timeline Audit] ──> [Loop 3: Web Streaming & Bitrate]
  • 30.000s exact duration     • Extract t = 2s, 7s, 12s, 17s, 22s, 27.5s  • +faststart moov atom at head
  • 1920x1080 @ 30fps H.264    • Zero text overlap & collisions           • File budget < 15MB
  • 48kHz Stereo AAC audio     • Image aspect ratio preservation          • HTML5 video tag stream test
```

### Running the Automated 3-Loop Audit
```bash
node hyper-motion-studio/review-loop.mjs
```

---

## Architectural Rules

### 1. Organic Warmth & Earthy Restraint (Zero AI Slop)
- Avoid generic high-contrast fluorescent purple gradients on flat black backgrounds unless specifically simulating cyber telemetry.
- Ground compositions on deliberate substrates: Warm Ivory (`#F6F5F1`), Cotton Alabaster (`#FAF8F5`), Cupertino Alabaster (`#F5F5F7`), or Carbon Obsidian (`#08090C`).
- Limit high-saturation brand accents to strictly under 5% of active screen surface area.

### 2. The 80/20 Velocity Rule (Asymmetric Speed Ramping)
- 80% of visual travel occurs in the first 20% of movement duration.
- The remaining 20% of distance glides smoothly across 80% of duration to resolve into retinal clarity.
- Mathematical easing: `easeOutExpo` or `cubic-bezier(0.16, 1, 0.3, 1)`.

### 3. Aspect-Preserved Cover Image Rendering
Never stretch or distort human portraits or technical assets:
```javascript
function drawCoverImage(ctx, img, dx, dy, dw, dh, radius = 0) {
  if (!img || !img.complete) return;
  const nw = img.naturalWidth || img.width;
  const nh = img.naturalHeight || img.height;
  const srcRatio = nw / nh;
  const dstRatio = dw / dh;
  let sx, sy, sw, sh;
  if (srcRatio > dstRatio) {
    sh = nh; sw = nh * dstRatio;
    sx = (nw - sw) / 2; sy = 0;
  } else {
    sw = nw; sh = nw / dstRatio;
    sx = 0;
    sy = Math.max(0, (nh - sh) * 0.16); // Face-centering bias
  }
  ctx.save();
  if (radius > 0) { ctx.beginPath(); ctx.roundRect(dx, dy, dw, dh, radius); ctx.clip(); }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.restore();
}
```

### 4. Zero Text Collisions & Typographic Rhythm
- Render stacked headline lines with independent baselines and calculated vertical spacing:
$$\Delta y = \text{fontSize} \times 1.08 + 12\text{px}$$
- Animate words with fast spring overshoot ($1.45 \to 1.00$ in $\sim0.10\text{s}$) so subsequent lines never occlude earlier text.

### 5. Deterministic Headless Playwright Clustering
- Use strictly local `@font-face` fonts (`AntonLocal`, `InterLocal`) and system font fallbacks (`ui-monospace`, `-apple-system`) to guarantee instant sub-second `domcontentloaded` times with zero external network requests.
- Distribute frames evenly across $N$ workers (e.g., 4 workers $\times$ 225 frames = 900 frames) and mux synchronously via FFmpeg with `-movflags +faststart`.

---

## Directory Structure
```
hyper-motion-studio/
├── stage-caleb.html        # Build with Caleb signature warm ivory & Anton fluid motion stage
├── stage-chatgpt.html      # OpenAI ChatGPT o3 reasoning stage
├── stage-gemini.html       # Google Gemini 2.0 multimodal iridescent stage
├── stage-claude.html       # Anthropic Claude 3.7 live artifacts stage
├── stage-apple.html        # Apple Intelligence Cupertino glass & Siri aura stage
├── stage-spacex.html       # SpaceX xAI India orbital guidance & Starship HUD stage
├── audio-synth-caleb.mjs   # Procedural 144 BPM breakbeat & punch kicks
├── audio-synth-chatgpt.mjs # Procedural 140 BPM tech groove & 808 sub bass
├── audio-synth-gemini.mjs  # Procedural 144 BPM luminous breakbeat & chimes
├── audio-synth-claude.mjs  # Procedural 138 BPM Rhodes lo-fi groove & vinyl
├── audio-synth-apple.mjs   # Procedural 136 BPM acoustic glass clicks & chimes
├── audio-synth-spacex.mjs  # Procedural 148 BPM Raptor LOX sub-bass breakbeat
├── render-all-brands.mjs   # Master multi-brand cluster rasterizer & muxer
├── review-loop.mjs         # Automated 3-Loop QA inspector & keyframe extractor
└── dist/
    ├── build-with-caleb-motion.mp4 # (6.9 MB, 30.00s)
    ├── chatgpt-launch.mp4          # (7.3 MB, 30.00s)
    ├── gemini-launch.mp4           # (9.1 MB, 30.00s)
    ├── claude-launch.mp4           # (2.5 MB, 30.00s)
    ├── apple-launch.mp4            # (6.9 MB, 30.00s)
    └── spacex-launch.mp4           # (7.2 MB, 30.00s)
```

---

## Render Commands

```bash
# Render all 6 frontier launch suites sequentially
node hyper-motion-studio/render-all-brands.mjs all

# Render a single brand launch suite
node hyper-motion-studio/render-all-brands.mjs chatgpt
node hyper-motion-studio/render-all-brands.mjs gemini
node hyper-motion-studio/render-all-brands.mjs claude
node hyper-motion-studio/render-all-brands.mjs apple
node hyper-motion-studio/render-all-brands.mjs spacex

# Run the 3-loop QA review/critique audit
node hyper-motion-studio/review-loop.mjs
```
