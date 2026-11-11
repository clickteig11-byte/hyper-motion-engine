import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studioDir = __dirname;
const distDir = path.join(studioDir, 'dist');
fs.mkdirSync(distDir, { recursive: true });

export const BRAND_SPECS = {
  caleb: {
    name: 'Build with Caleb',
    stageHtml: 'stage-caleb.html',
    audioScript: 'audio-synth-caleb.mjs',
    audioWav: 'soundtrack-caleb.wav',
    outMp4: 'build-with-caleb-motion.mp4',
    poster: 'poster-caleb.jpg'
  },
  chatgpt: {
    name: 'ChatGPT o3',
    stageHtml: 'stage-chatgpt.html',
    audioScript: 'audio-synth-chatgpt.mjs',
    audioWav: 'soundtrack-chatgpt.wav',
    outMp4: 'chatgpt-launch.mp4',
    poster: 'poster-chatgpt.jpg'
  },
  gemini: {
    name: 'Google Gemini 2.0',
    stageHtml: 'stage-gemini.html',
    audioScript: 'audio-synth-gemini.mjs',
    audioWav: 'soundtrack-gemini.wav',
    outMp4: 'gemini-launch.mp4',
    poster: 'poster-gemini.jpg'
  },
  apple: {
    name: 'Apple Intelligence',
    stageHtml: 'stage-apple.html',
    audioScript: 'audio-synth-apple.mjs',
    audioWav: 'soundtrack-apple.wav',
    outMp4: 'apple-launch.mp4',
    poster: 'poster-apple.jpg'
  },
  spacex: {
    name: 'SpaceX xAI India',
    stageHtml: 'stage-spacex.html',
    audioScript: 'audio-synth-spacex.mjs',
    audioWav: 'soundtrack-spacex.wav',
    outMp4: 'spacex-launch.mp4',
    poster: 'poster-spacex.jpg'
  },
  claude: {
    name: 'Claude 3.7 Sonnet',
    stageHtml: 'stage-claude.html',
    audioScript: 'audio-synth-claude.mjs',
    audioWav: 'soundtrack-claude.wav',
    outMp4: 'claude-launch.mp4',
    poster: 'poster-claude.jpg'
  }
};

export async function renderBrand(brandKey, { fps = 30, duration = 30.0, numWorkers = 4 } = {}) {
  const spec = BRAND_SPECS[brandKey];
  if (!spec) throw new Error(`Unknown brand: ${brandKey}`);

  console.log(`\n======================================================`);
  console.log(`🚀 Rendering [${spec.name}] 30s Launch Video`);
  console.log(`   HTML: ${spec.stageHtml} | Audio: ${spec.audioWav}`);
  console.log(`======================================================\n`);

  const startTime = Date.now();
  const totalFrames = Math.round(fps * duration);
  const framesDir = path.join(studioDir, `frames-${brandKey}`);
  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  // 1. Synthesize Audio
  const audioPath = path.join(distDir, spec.audioWav);
  if (!fs.existsSync(audioPath) || fs.statSync(audioPath).size < 1000) {
    console.log(`[1/4] Synthesizing procedural audio via ${spec.audioScript}...`);
    execSync(`node "${path.join(studioDir, spec.audioScript)}"`, { stdio: 'inherit' });
  } else {
    console.log(`[1/4] Found verified audio: ${spec.audioWav}`);
  }

  // 2. Launch Chromium Cluster
  console.log(`[2/4] Launching Playwright cluster (${numWorkers} workers)...`);
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: [
      '--disable-gpu-vsync',
      '--disable-background-timer-throttling',
      '--force-color-profile=srgb',
      '--disable-extensions',
      '--allow-file-access-from-files',
      '--disable-web-security'
    ]
  });

  const stageHtmlUri = 'file://' + path.join(studioDir, spec.stageHtml);
  const framesPerWorker = Math.ceil(totalFrames / numWorkers);

  console.log(`[3/4] Rasterizing ${totalFrames} frames across ${numWorkers} workers...`);

  await Promise.all(
    Array.from({ length: numWorkers }, async (_, wIdx) => {
      const page = await browser.newPage({
        viewport: { width: 1920, height: 1080, deviceScaleFactor: 1 }
      });
      await page.goto(stageHtmlUri, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);

      const startFrame = wIdx * framesPerWorker;
      const endFrame = Math.min(totalFrames, (wIdx + 1) * framesPerWorker);
      const batchSize = 30;

      for (let s = startFrame; s < endFrame; s += batchSize) {
        const e = Math.min(endFrame, s + batchSize);
        const dataUrls = await page.evaluate(
          ({ start, end, fpsVal }) => {
            const results = [];
            const canvas = document.getElementById('motion-stage');
            for (let f = start; f < end; f++) {
              const t = f / fpsVal;
              window.__renderFrameAt(t);
              results.push(canvas.toDataURL('image/jpeg', 0.94));
            }
            return results;
          },
          { start: s, end: e, fpsVal: fps }
        );

        for (let i = 0; i < dataUrls.length; i++) {
          const frameNum = s + i;
          const base64Data = dataUrls[i].replace(/^data:image\/jpeg;base64,/, '');
          const framePath = path.join(
            framesDir,
            `frame-${String(frameNum).padStart(4, '0')}.jpg`
          );
          fs.writeFileSync(framePath, Buffer.from(base64Data, 'base64'));

          if (frameNum === 0 && wIdx === 0) {
            const posterPath = path.join(distDir, spec.poster);
            fs.copyFileSync(framePath, posterPath);
            console.log(`   📸 [Frame 0] Saved poster thumbnail -> ${posterPath}`);
          }
        }
      }
      await page.close();
    })
  );

  await browser.close();
  const rasterTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   ✅ Rasterized ${totalFrames} frames in ${rasterTime}s`);

  // 3. Encode Broadcast-Grade MP4 with FFmpeg
  console.log(`[4/4] Encoding broadcast-grade MP4 with FFmpeg...`);
  const finalMp4Path = path.join(distDir, spec.outMp4);

  const ffmpegCmd = [
    'ffmpeg -y',
    `-framerate ${fps}`,
    `-i "${path.join(framesDir, 'frame-%04d.jpg')}"`,
    `-i "${audioPath}"`,
    '-c:v libx264',
    '-preset medium',
    '-crf 17',
    '-pix_fmt yuv420p',
    '-c:a aac',
    '-b:a 320k',
    '-shortest',
    '-movflags +faststart',
    `"${finalMp4Path}"`
  ].join(' ');

  execSync(ffmpegCmd, { stdio: 'inherit' });
  fs.rmSync(framesDir, { recursive: true, force: true });

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const stats = fs.statSync(finalMp4Path);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`🎉 [${spec.name}] Render Complete! Size: ${sizeMB} MB, Time: ${totalTime}s`);

  // Also copy to public/videos and public/images/designs for live site serving
  const publicVideoDir = path.join(studioDir, '../public/videos');
  const publicImgDir = path.join(studioDir, '../public/images/designs');
  fs.mkdirSync(publicVideoDir, { recursive: true });
  fs.mkdirSync(publicImgDir, { recursive: true });
  fs.copyFileSync(finalMp4Path, path.join(publicVideoDir, spec.outMp4));
  fs.copyFileSync(path.join(distDir, spec.poster), path.join(publicImgDir, spec.poster));

  return { finalMp4Path, sizeMB, totalTime };
}

if (process.argv[1]?.endsWith('render-all-brands.mjs')) {
  const target = process.argv[2];
  if (target && BRAND_SPECS[target]) {
    renderBrand(target);
  } else {
    console.log('Available brands to render:', Object.keys(BRAND_SPECS).join(', '));
  }
}
