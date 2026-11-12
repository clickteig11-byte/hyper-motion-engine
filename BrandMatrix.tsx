import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Code2,
  ExternalLink,
  Terminal,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Music,
  Download,
  Sliders,
  Film,
  AlertCircle,
  RotateCw,
  Loader2,
  ArrowUpRight
} from 'lucide-react';

export interface BrandEdition {
  id: string;
  name: string;
  badge: string;
  model: string;
  accentColor: string;
  bgHex: string;
  textHex: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
  bpm: number;
  aesthetic: string;
  signatureVisual: string;
  tagline: string;
  audioProfile: string;
  prompt: string;
  repoUrl: string;
  cliCommand: string;
}

export const BRAND_EDITIONS: BrandEdition[] = [
  {
    id: 'caleb',
    name: 'Build with Caleb',
    badge: 'Creator Flagship',
    model: 'Personal Brand Engine',
    accentColor: '#0052FF',
    bgHex: '#F6F5F1',
    textHex: '#111111',
    videoUrl: '/videos/build-with-caleb-motion.mp4',
    posterUrl: '/images/designs/poster-caleb.jpg',
    duration: '30.00s',
    bpm: 144,
    aesthetic: 'Warm Ivory Paper, Anton Display, Electric Cobalt Period, Zero AI Slop',
    signatureVisual: 'Continuous 3D camera spline, real portrait aspect preservation, 9-slice soft elevation shadow',
    tagline: 'EVERYTHING BEHIND THE BUILDS // CODE / LEARN / BUILD / REPEAT',
    audioProfile: '144 BPM Stereo Breakbeat • Analog Punch Kicks',
    repoUrl: 'https://github.com/clickteig11-byte/hyper-motion-engine',
    cliCommand: 'npx tsx scripts/render.ts --edition=caleb',
    prompt: `Build a deterministic 30-second broadcast motion graphics launch video in pure code based on:
https://github.com/clickteig11-byte/hyper-motion-engine

1. Pull code directly from https://github.com/clickteig11-byte/hyper-motion-engine.git
2. Implement a single continuous 3840x2160 virtual canvas driven by getCamera(t) spline. No slideshow cuts.
3. Use warm ivory paper substrate (#F6F5F1), stark pitch black (#111111), and electric cobalt blue (#0052FF) with trailing blue periods.
4. Render typography word-by-word with explosive spring physics (1.45 -> 1.00 in 0.12s) using stacked non-overlapping lines.
5. Draw user portrait via aspect-preserved drawCoverImage helper (3:4 ratio, zero stretching).
6. Synthesize 144 BPM stereo breakbeat soundtrack with analog punch kicks hitting synchronously on every word pop.
7. Rasterize 900 frames across 4 Playwright Chromium headless workers and encode via FFmpeg (+faststart, yuv420p).`
  },
  {
    id: 'chatgpt',
    name: 'OpenAI // GPT-6.1 Terra',
    badge: 'Frontier Agentic',
    model: 'GPT-6.1 Terra & Astra',
    accentColor: '#10A37F',
    bgHex: '#0D0D0E',
    textHex: '#ECECEC',
    videoUrl: '/videos/chatgpt-launch.mp4',
    posterUrl: '/images/designs/poster-chatgpt.jpg',
    duration: '30.00s',
    bpm: 140,
    aesthetic: 'Dark Obsidian Canvas, Emerald Mint Accents, Minimalist Monospace Grids',
    signatureVisual: 'Live streaming reasoning trace ("Thinking for 14 seconds..."), token probability bursts, vector OpenAI rosette',
    tagline: 'GPT-6.1 TERRA // EXTENDED REASONING // AUTONOMOUS OPERATOR',
    audioProfile: '140 BPM Tech Groove • Deep 808 Sub Drops',
    repoUrl: 'https://github.com/clickteig11-byte/hyper-motion-engine',
    cliCommand: 'npx tsx scripts/render.ts --edition=chatgpt',
    prompt: `Generate a 30-second OpenAI GPT-6.1 Terra frontier reasoning launch video:
- Palette: Dark Obsidian (#0D0D0E) & Off-White (#ECECEC), Emerald Mint (#10A37F).
- Word-by-word kinetic pop: "GPT-6.1 TERRA." -> "EXTENDED REASONING." -> "AUTONOMOUS OPERATOR."
- Visuals: Live collapsible reasoning trace box, token probability wave, animated 2D vector rosette, 1.05M context grid.
- Soundtrack: 140 BPM tech groove with deep 808 sub drops and mechanical switch clatter.
- Rasterize: 900 frames via headless Chromium cluster and encode with FFmpeg (+faststart).`
  },
  {
    id: 'gemini',
    name: 'Google Gemini 4 Carbon',
    badge: 'High Reasoning Depth',
    model: 'Gemini 4 Carbon (C4)',
    accentColor: '#7952DE',
    bgHex: '#040711',
    textHex: '#F8F9FA',
    videoUrl: '/videos/gemini-launch.mp4',
    posterUrl: '/images/designs/poster-gemini.jpg',
    duration: '30.00s',
    bpm: 144,
    aesthetic: 'Deep Space Platinum Navy, Iridescent Gradient Glow, Radiant Star Burst',
    signatureVisual: 'Iconic 4-point Gemini star with particle emission, 32-bar dynamic audio spectrum visualizer, 1M context decode',
    tagline: 'GEMINI 4 CARBON // MULTIMODAL REASONING // 1M CONTINUOUS DECODE',
    audioProfile: '144 BPM Luminous Breakbeat • Iridescent Chimes',
    repoUrl: 'https://github.com/clickteig11-byte/hyper-motion-engine',
    cliCommand: 'npx tsx scripts/render.ts --edition=gemini',
    prompt: `Generate a 30-second Google Gemini 4 Carbon launch reel:
- Palette: Deep Space Navy (#040711), Google iridescent gradient (#4E82EE -> #7952DE -> #C34085).
- Word-by-word kinetic pop: "GEMINI 4 CARBON." -> "REASONING DEPTH." -> "1 MILLION CONTINUOUS DECODE."
- Visuals: 4-point iridescent star bloom, live 32-bar audio spectrum waveform visualizer, glowing particle velocity trails.
- Soundtrack: 144 BPM luminous breakbeat with crystal bell chimes and punchy analog kicks.
- Rasterize: 900 frames via headless Chromium cluster and encode with FFmpeg (+faststart).`
  },
  {
    id: 'claude',
    name: 'Claude Opus 5.5 & Fable 5.2',
    badge: 'Frontier Architecture',
    model: 'Claude Opus 5.5 / Fable 5.2',
    accentColor: '#D97757',
    bgHex: '#FAF8F5',
    textHex: '#141413',
    videoUrl: '/videos/claude-launch.mp4',
    posterUrl: '/images/designs/poster-claude.jpg',
    duration: '30.00s',
    bpm: 138,
    aesthetic: 'Warm Cotton Alabaster, Letterpress Carbon, Anthropic Terracotta 5% Law',
    signatureVisual: 'Live split-screen React Artifacts engine assembly, Computer Use mouse pointer, warm sunburst aperture',
    tagline: 'THOUGHT TO CODE // OPUS 5.5 ARCHITECTURE // FABLE 5.2 SYNTHESIS',
    audioProfile: '138 BPM Rhodes E-Piano • Acoustic Rimshots',
    repoUrl: 'https://github.com/clickteig11-byte/hyper-motion-engine',
    cliCommand: 'npx tsx scripts/render.ts --edition=claude',
    prompt: `Generate a 30-second Claude Opus 5.5 & Fable 5.2 editorial motion graphics teaser:
- Palette: Warm Cotton Alabaster (#FAF8F5), Letterpress Carbon (#141413), Terracotta (#D97757).
- Word-by-word kinetic pop: "THOUGHT TO CODE." -> "OPUS 5.5 & FABLE 5.2." -> "COMPUTER USE."
- Visuals: Live split-screen Artifacts React assembly, autonomous cursor interaction, terracotta sunburst aperture.
- Soundtrack: 138 BPM warm Rhodes electric piano (F minor), subtle vinyl crackle, and acoustic wood rimshots.
- Rasterize: 900 frames via headless Chromium cluster and encode with FFmpeg (+faststart).`
  },
  {
    id: 'apple',
    name: 'Apple Intelligence // Siri AI (Fall 2026)',
    badge: 'Siri AI & M4 Max',
    model: 'Siri AI Foundation Models // Private Cloud',
    accentColor: '#2997FF',
    bgHex: '#F5F5F7',
    textHex: '#1D1D1F',
    videoUrl: '/videos/apple-launch.mp4',
    posterUrl: '/images/designs/poster-apple.jpg',
    duration: '30.00s',
    bpm: 136,
    aesthetic: 'Cupertino Alabaster, Frosted Glass Cards, Pulsing Siri Fluid Aura Rim',
    signatureVisual: 'On-Screen Awareness HUD, Personal Context Engine, Private Cloud Compute lock badge, Siri rainbow fluid border',
    tagline: 'SIRI AI // ON-SCREEN AWARENESS // PERSONAL CONTEXT ENGINE',
    audioProfile: '136 BPM Acoustic-Electronic • Glass Tap Clicks & Siri Chime',
    repoUrl: 'https://github.com/clickteig11-byte/hyper-motion-engine',
    cliCommand: 'npx tsx scripts/render.ts --edition=apple',
    prompt: `Generate a 30-second Apple Intelligence // Siri AI (Fall 2026) launch video:
- Palette: Cupertino Alabaster (#F5F5F7), Stark Slate (#1D1D1F), Rainbow Aura (#2997FF, #FF2D55, #FF9500).
- Word-by-word kinetic pop: "SIRI AI." -> "ON-SCREEN AWARENESS." -> "PERSONAL CONTEXT ENGINE."
- Visuals: Animated Siri fluid glowing rim tracing canvas perimeter, frosted glass depth cards, Private Cloud padlock badge, dedicated conversation threads.
- Soundtrack: 136 BPM acoustic-electronic hybrid with glass tap clicks, crisp rimshots, and pristine metallic chimes.
- Rasterize: 900 frames via headless Chromium cluster and encode with FFmpeg (+faststart).`
  },
  {
    id: 'spacex',
    name: 'SpaceX xAI India // Grok 4.8',
    badge: '2.5T C++ Engine',
    model: 'Grok 4.8 & 4.7 Coding Engine',
    accentColor: '#FF6B00',
    bgHex: '#08090C',
    textHex: '#F0F2F5',
    videoUrl: '/videos/spacex-launch.mp4',
    posterUrl: '/images/designs/poster-spacex.jpg',
    duration: '30.00s',
    bpm: 148,
    aesthetic: 'Carbon Fiber Obsidian, Titanium White, Starship Amber LOX Flame, Saffron & Cyan',
    signatureVisual: 'Starship Super Heavy engine gimbal telemetry HUD, Grok 4.8 2.5T C++ neural engine telemetry, 500k context stream, bilingual English + Hindi script',
    tagline: 'STARSHIP x GROK 4.8 // 2.5T C++ ENGINE // अंतरिक्ष स्वायत्तता',
    audioProfile: '148 BPM Aerospace Breakbeat • LOX Thruster Rumble',
    repoUrl: 'https://github.com/clickteig11-byte/hyper-motion-engine',
    cliCommand: 'npx tsx scripts/render.ts --edition=spacex',
    prompt: `Generate a 30-second SpaceX xAI India // Grok 4.8 orbital guidance launch video:
- Palette: Carbon Obsidian (#08090C), Titanium White (#F0F2F5), Amber Flame (#FF6B00), Saffron (#FF9933).
- Word-by-word kinetic pop: "STARSHIP x GROK 4.8." -> "2.5T C++ ENGINE." -> "अंतरिक्ष स्वायत्तता."
- Visuals: Starship gimbal telemetry HUD (LOX 98.4%, 7850 m/s), Grok 4.8 orbital trajectory crosshairs, 500k context stream, amber plasma thrust particles.
- Soundtrack: 148 BPM thunderous aerospace breakbeat with rocket sub rumble, metallic mechanical clicks, and radar beeps.
- Rasterize: 900 frames via headless Chromium cluster and encode with FFmpeg (+faststart).`
  }
];

export const BrandMatrix: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<BrandEdition>(BRAND_EDITIONS[0]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [posterSrc, setPosterSrc] = useState(BRAND_EDITIONS[0].posterUrl);
  const [videoError, setVideoError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleSelectAndPlay = (brand: BrandEdition) => {
    setSelectedBrand(brand);
    setIsPlaying(true);
    setVideoError(false);
    if (stageRef.current) {
      stageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 200);
  };

  // When switching brands, pause video and reset states
  useEffect(() => {
    setIsPlaying(false);
    setVideoError(false);
    setIsBuffering(false);
    setPosterSrc(selectedBrand.posterUrl);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.load();
    }
  }, [selectedBrand.id]);

  const handlePosterError = () => {
    // If brand poster fails to load, gracefully fall back to default flagship poster
    if (posterSrc !== '/images/designs/hyper-motion-poster.jpg') {
      setPosterSrc('/images/designs/hyper-motion-poster.jpg');
    }
  };

  const handleRetryVideo = () => {
    setVideoError(false);
    setIsBuffering(true);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(() => {
          setIsBuffering(false);
        });
    }
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(selectedBrand.prompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2400);
    } catch {
      // Fallback handled silently
    }
  };

  const handleCopyCli = async () => {
    try {
      await navigator.clipboard.writeText(selectedBrand.cliCommand);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2400);
    } catch {
      // Fallback handled silently
    }
  };

  const handleCopyColor = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 1800);
    } catch {
      // Fallback handled silently
    }
  };

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % BRAND_EDITIONS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + BRAND_EDITIONS.length) % BRAND_EDITIONS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = BRAND_EDITIONS.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    setSelectedBrand(BRAND_EDITIONS[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  };

  const currentIndex = BRAND_EDITIONS.findIndex((b) => b.id === selectedBrand.id);

  return (
    <section
      className="page-width brand-matrix-section"
      id="brand-matrix"
      aria-labelledby="matrix-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2.5">
            <span className="eyebrow" style={{ color: 'var(--blue)', marginBottom: 0 }}>
              02 / FRONTIER MOTION STUDIO
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#0754ff]/10 text-[#0754ff] border border-[#0754ff]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0754ff] animate-ping" />
              6 EDITIONS LIVE
            </span>
          </div>
          <h2
            id="matrix-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#111111] uppercase font-display leading-[1.02]"
          >
            Frontier Brand Matrix<span className="blue-period">.</span>
          </h2>
        </div>
        <div className="max-w-md">
          <p className="text-sm sm:text-base text-[#555861] leading-relaxed">
            High-movement 30-second launch reels engineered entirely in pure code. Zero After Effects. Zero manual keyframing. Deterministic 60&nbsp;FPS rasterization tested across top frontier models.
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono text-[#555861]">
            <Film size={13} className="text-[#0754ff]" />
            <span>Click any bracket or use <kbd className="px-1.5 py-0.5 bg-white border border-[#b9b9b4] rounded text-[10px] font-bold text-[#111111] shadow-2xs">←</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-[#b9b9b4] rounded text-[10px] font-bold text-[#111111] shadow-2xs">→</kbd> keys to cycle</span>
          </div>
        </div>
      </div>

      {/* Brand Bracket Selector Tabs */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-8 sm:mb-10"
        role="tablist"
        aria-label="Brand launch video brackets"
      >
        {BRAND_EDITIONS.map((b, idx) => {
          const isSelected = selectedBrand.id === b.id;
          return (
            <button
              key={b.id}
              ref={(el) => { tabRefs.current[idx] = el; }}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${b.id}`}
              id={`tab-${b.id}`}
              tabIndex={isSelected ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onClick={() => setSelectedBrand(b)}
              style={
                isSelected
                  ? {
                      borderColor: b.accentColor,
                      boxShadow: `0 14px 28px -6px ${b.accentColor}28, 0 4px 10px -2px ${b.accentColor}14`,
                      outline: `2px solid ${b.accentColor}`
                    }
                  : undefined
              }
              className={`group p-3 sm:p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between min-h-[96px] sm:min-h-[108px] ${
                isSelected
                  ? 'bg-white -translate-y-1 z-10'
                  : 'border-[#b9b9b4] bg-[#F6F5F1] hover:bg-white hover:border-[#111111] hover:-translate-y-0.5'
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-opacity duration-200 ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                }`}
                style={{ backgroundColor: b.accentColor }}
                aria-hidden="true"
              />

              {/* Header: Pulsing Brand Dot & BPM Equalizer */}
              <div className="flex items-center justify-between gap-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <span
                      className="w-3 h-3 rounded-full transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: b.accentColor }}
                      aria-hidden="true"
                    />
                    {isSelected && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-60"
                        style={{ backgroundColor: b.accentColor }}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  {isSelected && (
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-sm"
                      style={{
                        backgroundColor: `${b.accentColor}18`,
                        color: b.accentColor
                      }}
                    >
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Animated BPM Rhythm Equalizer */}
                <div
                  className="flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] font-bold"
                  style={{ color: isSelected ? b.accentColor : '#555861' }}
                  title={`${b.bpm} Beats Per Minute Soundtrack`}
                >
                  {isSelected ? (
                    <div className="flex items-end gap-0.5 h-3" aria-hidden="true">
                      <div className="brand-eq-bar brand-eq-bar-1" />
                      <div className="brand-eq-bar brand-eq-bar-2" />
                      <div className="brand-eq-bar brand-eq-bar-3" />
                    </div>
                  ) : (
                    <Music size={11} className="text-[#555861] opacity-70" aria-hidden="true" />
                  )}
                  <span>{b.bpm}&nbsp;BPM</span>
                </div>
              </div>

              {/* Brand Label Lockup */}
              <div>
                <h3 className="text-sm font-bold text-[#111111] leading-snug mb-0.5 font-display tracking-tight">
                  {b.name}
                </h3>
                <p className="text-[11px] text-[#555861] font-mono leading-tight truncate">
                  {b.model}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Brand Interactive Stage & Player */}
      <div
        ref={stageRef}
        id={`panel-${selectedBrand.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${selectedBrand.id}`}
        className="rounded-2xl border border-[#b9b9b4] bg-white overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 transition-all duration-300"
      >
        {/* Left: 16:9 Video Canvas Player */}
        <div className="lg:col-span-7 bg-[#0A0A0C] flex flex-col justify-center relative aspect-video w-full min-h-[280px] sm:min-h-[420px] lg:min-h-[560px] overflow-hidden group">
          {/* Subtle Ambient Back-Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 blur-3xl transition-colors duration-500"
            style={{
              background: `radial-gradient(circle at center, ${selectedBrand.accentColor} 0%, transparent 70%)`
            }}
            aria-hidden="true"
          />

          {!videoError ? (
            <video
              ref={videoRef}
              key={selectedBrand.videoUrl}
              poster={posterSrc}
              controls
              playsInline
              preload="metadata"
              controlsList="nodownload noplaybackrate"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => {
                setIsBuffering(false);
                setIsPlaying(true);
              }}
              onCanPlay={() => setIsBuffering(false)}
              onError={() => {
                setVideoError(true);
                setIsBuffering(false);
                setIsPlaying(false);
              }}
              className="w-full h-full object-contain relative z-10"
              aria-label={`${selectedBrand.name} 30-second motion graphics launch video`}
            >
              <source src={selectedBrand.videoUrl} type="video/mp4" />
              <p className="p-4 text-xs font-mono text-white/80">
                Your browser does not support inline video playback.{' '}
                <a href={selectedBrand.videoUrl} download className="underline text-[#0754ff]">
                  Download {selectedBrand.name} MP4
                </a>.
              </p>
            </video>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center z-10">
              <img
                src={posterSrc}
                alt={`${selectedBrand.name} preview poster`}
                onError={handlePosterError}
                className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-xs"
              />
              <div className="relative z-10 max-w-sm bg-black/85 backdrop-blur-md p-5 rounded-xl border border-white/15 text-white shadow-2xl flex flex-col items-center gap-3">
                <AlertCircle size={30} className="text-[#FFBD2E]" />
                <div>
                  <h4 className="font-display uppercase text-sm font-bold tracking-wider mb-1">
                    Direct Stream Unavailable
                  </h4>
                  <p className="font-mono text-[11px] text-white/70 leading-relaxed">
                    Browser playback could not initialize stream. You can retry directly or download the full 1080p broadcast MP4 master.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={handleRetryVideo}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-white/20 transition-colors"
                  >
                    <RotateCw size={12} />
                    <span>Retry Playback</span>
                  </button>
                  <a
                    href={selectedBrand.videoUrl}
                    download
                    className="px-3 py-1.5 rounded-lg bg-[#0754ff] hover:bg-[#003cd0] text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download size={12} />
                    <span>Download MP4</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Buffering Indicator */}
          {isBuffering && !videoError && (
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white z-20 pointer-events-none">
              <Loader2 size={24} className="text-[#0754ff] animate-spin" />
            </div>
          )}

          {/* Top HUD Telemetry Bar */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between pointer-events-none z-20 gap-2">
            <span
              className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 shadow-md inline-flex items-center gap-1.5"
              style={{ backgroundColor: `${selectedBrand.accentColor}E6` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {selectedBrand.badge} • 60 FPS
            </span>

            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono text-white/80 bg-black/60 backdrop-blur-md border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10A37F]" />
              4K CANVAS // 1080P MASTER
            </span>
          </div>

          {/* Center Play Overlay Trigger (Visible when paused & healthy) */}
          {!isPlaying && !videoError && !isBuffering && (
            <button
              type="button"
              onClick={toggleVideoPlayback}
              aria-label={`Play ${selectedBrand.name} launch video`}
              className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 z-20 group-hover:opacity-100 opacity-90 shadow-2xl"
            >
              <Play size={28} className="translate-x-0.5 fill-white text-white" aria-hidden="true" />
            </button>
          )}

          {/* Bottom Telemetry Ticker Bar */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between text-white/70 text-[10px] sm:text-[11px] font-mono pointer-events-none z-20">
            <span className="bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
              {selectedBrand.audioProfile}
            </span>
            <span className="bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
              900 FRAMES @ 30s
            </span>
          </div>
        </div>

        {/* Right: Technical Blueprint & Model Specs */}
        <div className="lg:col-span-5 p-5 sm:p-7 lg:p-8 flex flex-col justify-between bg-[#F6F5F1] border-t lg:border-t-0 lg:border-l border-[#b9b9b4]">
          <div>
            {/* Header Specs Bar */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#b9b9b4]/70">
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#0754ff] flex items-center gap-1.5">
                <Sliders size={13} />
                // {selectedBrand.duration} BROADCAST MASTER
              </span>
              <span className="font-mono text-xs text-[#555861] font-semibold">
                3840×2160 • 60 FPS
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="mb-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] font-display uppercase tracking-tight leading-none mb-1.5">
                {selectedBrand.name}
              </h3>
              <p
                className="font-mono text-xs font-bold uppercase tracking-wider leading-relaxed"
                style={{ color: selectedBrand.accentColor }}
              >
                {selectedBrand.tagline}
              </p>
            </div>

            {/* Interactive Design Tokens & Swatches */}
            <div className="mb-5 p-3 rounded-xl bg-white border border-[#b9b9b4]/80 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#555861]">
                  Design Tokens &amp; Materiality
                </span>
                {copiedColor && (
                  <span className="font-mono text-[10px] font-bold text-[#10A37F] animate-fade-in flex items-center gap-1">
                    <Check size={11} /> Copied {copiedColor}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleCopyColor(selectedBrand.accentColor)}
                  title="Click to copy Accent Hex"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#F6F5F1] hover:bg-white border border-[#b9b9b4] transition-all hover:scale-105 active:scale-95"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: selectedBrand.accentColor }}
                  />
                  <span>Accent: {selectedBrand.accentColor}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyColor(selectedBrand.bgHex)}
                  title="Click to copy Background Hex"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#F6F5F1] hover:bg-white border border-[#b9b9b4] transition-all hover:scale-105 active:scale-95"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: selectedBrand.bgHex }}
                  />
                  <span>Substrate: {selectedBrand.bgHex}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyColor(selectedBrand.textHex)}
                  title="Click to copy Text Hex"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#F6F5F1] hover:bg-white border border-[#b9b9b4] transition-all hover:scale-105 active:scale-95"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: selectedBrand.textHex }}
                  />
                  <span>Ink: {selectedBrand.textHex}</span>
                </button>
              </div>
            </div>

            {/* Technical Architecture Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-white border border-[#b9b9b4]/80 shadow-2xs">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#555861] mb-1">
                  Art Direction &amp; Substrate
                </p>
                <p className="text-xs text-[#111111] leading-relaxed">
                  {selectedBrand.aesthetic}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#b9b9b4]/80 shadow-2xs">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#555861] mb-1">
                  Procedural Shader Engine
                </p>
                <p className="text-xs text-[#111111] leading-relaxed">
                  {selectedBrand.signatureVisual}
                </p>
              </div>
            </div>
          </div>

          <div>
            {/* Terminal Prompt Constitution Container */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-bold uppercase text-[#111111] flex items-center gap-1.5">
                  <Terminal size={13} className="text-[#0754ff]" />
                  AI Agent Prompt Constitution
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-[#555861] hover:text-[#111111] transition-colors"
                    aria-label={isPromptExpanded ? 'Compact prompt view' : 'Expand full prompt view'}
                  >
                    {isPromptExpanded ? (
                      <>
                        <ChevronUp size={13} /> Compact
                      </>
                    ) : (
                      <>
                        <ChevronDown size={13} /> Expand All
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0754ff] hover:text-[#003cd0] transition-colors ml-1 px-2 py-0.5 rounded bg-[#0754ff]/10 hover:bg-[#0754ff]/15 active:scale-95"
                    aria-label="Copy prompt constitution"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check size={12} className="text-[#10A37F]" />
                        <span className="text-[#10A37F]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                  <span className="sr-only" role="status">
                    {copiedPrompt ? 'Prompt copied to clipboard' : ''}
                  </span>
                </div>
              </div>

              {/* Terminal Window Header & Content */}
              <div className="rounded-xl overflow-hidden border border-[#111111] bg-[#0D0D0E] shadow-lg">
                <div className="px-3 py-1.5 bg-[#171719] border-b border-white/10 flex items-center justify-between text-white/50 font-mono text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block" />
                    <span className="ml-2 text-white/70">constitution-{selectedBrand.id}.prompt</span>
                  </div>
                  <span className="text-[10px] text-white/40">markdown • UTF-8</span>
                </div>

                <div
                  className={`p-3 font-mono text-[11px] sm:text-xs leading-relaxed text-white/90 overflow-x-auto brand-terminal-scroll transition-all duration-300 ${
                    isPromptExpanded ? 'max-h-[380px]' : 'max-h-[156px]'
                  }`}
                >
                  <div className="flex">
                    <div className="select-none text-white/30 text-right pr-3 pl-1 font-mono text-[11px] sm:text-xs leading-relaxed border-r border-white/10 shrink-0">
                      {selectedBrand.prompt.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <pre className="pl-3 whitespace-pre-wrap font-mono text-[11px] sm:text-xs leading-relaxed text-white/90 selection:bg-[#0754ff] flex-1">
                      {selectedBrand.prompt}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Terminal CLI Runner One-Liner */}
            <div className="mb-4 p-2.5 rounded-lg bg-white border border-[#b9b9b4] flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-mono font-bold text-[#0754ff] select-none">$</span>
                <code className="text-[11px] font-mono text-[#111111] truncate">
                  {selectedBrand.cliCommand}
                </code>
              </div>
              <button
                type="button"
                onClick={handleCopyCli}
                title="Copy CLI command"
                className="shrink-0 p-1 rounded text-[#555861] hover:text-[#0754ff] hover:bg-[#F6F5F1] transition-colors"
                aria-label="Copy CLI command"
              >
                {copiedCli ? <Check size={14} className="text-[#10A37F]" /> : <Copy size={14} />}
              </button>
              <span className="sr-only" role="status">
                {copiedCli ? 'CLI command copied to clipboard' : ''}
              </span>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-3 border-t border-[#b9b9b4]/70">
              <a
                href={selectedBrand.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 px-4 rounded-lg bg-[#0754ff] text-white font-mono text-xs font-bold hover:bg-[#003cd0] transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm active:translate-y-0.5"
              >
                <Code2 size={15} />
                <span>View Engine Repo</span>
                <ExternalLink size={13} />
              </a>

              <a
                href={selectedBrand.videoUrl}
                download
                className="py-2.5 px-4 rounded-lg bg-white border border-[#111111] text-[#111111] font-mono text-xs font-bold hover:bg-[#111111] hover:text-white transition-colors inline-flex items-center justify-center gap-1.5 active:translate-y-0.5 shadow-2xs"
                title={`Download ${selectedBrand.name} MP4 Master`}
              >
                <Download size={14} />
                <span>Download MP4</span>
              </a>
            </div>

            {/* Bracket Position Orientation */}
            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#555861]">
              <span>Bracket {currentIndex + 1} of {BRAND_EDITIONS.length}</span>
              <span className="hidden sm:inline">Use Arrow keys [← / →] to cycle</span>
            </div>
          </div>
        </div>
      </div>

      {/* 03 / All 6 Launch Videos in Main Gallery */}
      <div className="mt-14 pt-10 border-t border-[#d8d5cc]" aria-labelledby="all-videos-heading">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#0754ff] animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#555861]">
                All 6 Launch Videos in Main
              </span>
            </div>
            <h3 id="all-videos-heading" className="font-serif text-2xl sm:text-3xl text-[#111111] font-bold">
              Frontier Reel Archive<span className="text-[#0754ff]">.</span>
            </h3>
            <p className="text-sm text-[#555861] mt-1 max-w-xl">
              Every edition is rendered in pure code using deterministic HTML5 Canvas and procedural breakbeat audio. Click any video card to stream immediately in the main stage player above.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#555861]">
            <span className="px-2.5 py-1 bg-white border border-[#b9b9b4] rounded shadow-2xs font-semibold">6 Master MP4s</span>
            <span className="px-2.5 py-1 bg-white border border-[#b9b9b4] rounded shadow-2xs font-semibold">1080p @ 30 FPS</span>
            <span className="px-2.5 py-1 bg-white border border-[#b9b9b4] rounded shadow-2xs font-semibold">Faststart Stream</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BRAND_EDITIONS.map((brand, idx) => {
            const isSelected = selectedBrand.id === brand.id;
            return (
              <div
                key={brand.id}
                onClick={() => handleSelectAndPlay(brand)}
                className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#0754ff] ring-2 ring-[#0754ff]/30 shadow-md -translate-y-0.5'
                    : 'bg-white/85 hover:bg-white border-[#b9b9b4] hover:border-[#111111] hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Thumbnail Wrap with Play Overlay */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-[#111111] mb-3.5 border border-black/10">
                    <img
                      src={brand.posterUrl}
                      alt={`${brand.name} launch video preview`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 ${
                          isSelected ? 'bg-[#0754ff] text-white' : 'bg-white/95 text-[#111111]'
                        }`}
                      >
                        <Play size={18} className="ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[10px] font-mono font-bold text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.accentColor }} />
                      <span>0{idx + 1} // {brand.id.toUpperCase()}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-mono text-white font-medium">
                      30.00s • 1080p
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-sm text-[#111111] group-hover:text-[#0754ff] transition-colors leading-snug">
                      {brand.name}
                    </h4>
                    <span
                      className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border"
                      style={{
                        borderColor: `${brand.accentColor}40`,
                        backgroundColor: `${brand.accentColor}12`,
                        color: brand.accentColor
                      }}
                    >
                      {brand.badge}
                    </span>
                  </div>

                  <p className="text-xs text-[#555861] line-clamp-2 mb-3">
                    {brand.tagline}
                  </p>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-[#b9b9b4]/50 flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] text-[#555861]">
                    {brand.bpm} BPM
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={brand.videoUrl}
                      download
                      onClick={(e) => e.stopPropagation()}
                      title={`Download ${brand.name} MP4`}
                      className="p-1.5 rounded hover:bg-[#F6F5F1] text-[#555861] hover:text-[#111111] transition-colors"
                    >
                      <Download size={14} />
                    </a>
                    <button
                      type="button"
                      className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'bg-[#0754ff] text-white'
                          : 'bg-[#111111] text-white hover:bg-[#0754ff]'
                      }`}
                    >
                      {isSelected && isPlaying ? 'Playing' : 'Play in Main'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Documentation Banner Link */}
        <div className="mt-8 p-5 rounded-xl bg-white border border-[#b9b9b4] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <span className="eyebrow text-[#0754ff]">FULL PROJECT DOCUMENTATION &amp; INSTRUCTIONS</span>
            <h4 className="text-base font-bold text-[#111111] mt-0.5">
              Explore Full Hyper-Motion Project, Setup Guides &amp; Outputs
            </h4>
            <p className="text-xs text-[#555861] mt-0.5">
              Complete operational guides for Google Antigravity, Claude Code, OpenAI Codex, and Cursor, plus style fine-tuning and code constitutions.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="/projects/hyper-motion-engine"
              className="button button-blue text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
            >
              <span>View Project &amp; Guides</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
