import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
import { generateChatGPTAudio } from './audio-synth-chatgpt.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const studioDir = __dirname;
const distDir = path.join(studioDir, 'dist');
const framesDir = path.join(studioDir, 'frames-chatgpt');

fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(framesDir, { recursive: true });

export async function renderChatGptVideo({ fps = 30, duration = 30.0, numWorkers = 4 } = {}) {
  const totalFrames = Math.round(fps * duration);
  console.log(`\n======================================================`);
  console.log(`🚀 [OpenAI // ChatGPT o3] Hyper-Motion Engine Render`);
  console.log(`   Duration: ${duration}s | FPS: ${fps} | Total Frames: ${totalFrames}`);
  console.log(`   Workers: ${numWorkers} parallel Chromium instances`);
  console.log(`======================================================\n`);

  const startTime = Date.now();

  // 1. Generate Synchronized Audio
  const audioPath = path.join(distDir, 'soundtrack-chatgpt.wav');
  console.log(`[1/4] Generating synchronized 140 BPM tech groove & sub bassline...`);
  generateChatGPTAudio(audioPath);

  // 2. Launch Chromium Cluster
  console.log(`[2/4] Launching Playwright Chromium cluster...`);
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

  const stageHtmlUri = 'file://' + path.join(studioDir, 'stage-chatgpt.html');
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
          const b64 = dataUrls[i].split(',')[1];
          const buf = Buffer.from(b64, 'base64');
          const framePath = path.join(framesDir, `frame-${String(frameNum).padStart(4, '0')}.jpg`);
          fs.writeFileSync(framePath, buf);

          if (frameNum === 0) {
            const posterPath = path.join(distDir, 'poster-chatgpt.jpg');
            fs.writeFileSync(posterPath, buf);
            console.log(`   📸 [Frame 0] Saved poster thumbnail -> ${posterPath}`);
          }
        }
      }
      await page.close();
    })
  );

  await browser.close();
  const rasterTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`   ✅ Rasterized ${totalFrames} frames in ${rasterTime}s (${(totalFrames / rasterTime).toFixed(1)} fps)`);

  // 3. Mux Video + Audio
  const finalMp4Path = path.join(distDir, 'chatgpt-launch.mp4');
  console.log(`[4/4] Encoding broadcast-grade MP4 with FFmpeg...`);

  const ffmpegCmd = [
    `ffmpeg -y`,
    `-framerate ${fps}`,
    `-i "${framesDir}/frame-%04d.jpg"`,
    `-i "${audioPath}"`,
    `-c:v libx264 -preset fast -crf 17`,
    `-pix_fmt yuv420p`,
    `-colorspace bt709 -color_primaries bt709 -color_trc bt709`,
    `-c:a aac -b:a 320k`,
    `-shortest`,
    `-movflags +faststart`,
    `"${finalMp4Path}"`
  ].join(' ');

  execSync(ffmpegCmd, { stdio: 'inherit' });
  fs.rmSync(framesDir, { recursive: true, force: true });

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const stats = fs.statSync(finalMp4Path);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`\n======================================================`);
  console.log(`🎉 [OpenAI // ChatGPT o3] Master Render Complete!`);
  console.log(`   Output: ${finalMp4Path}`);
  console.log(`   Poster: ${path.join(distDir, 'poster-chatgpt.jpg')}`);
  console.log(`   File Size: ${sizeMB} MB`);
  console.log(`   Total Render Time: ${totalTime}s`);
  console.log(`======================================================\n`);

  return { mp4Path: finalMp4Path, posterPath: path.join(distDir, 'poster-chatgpt.jpg'), sizeMB, totalTime };
}

if (process.argv[1]?.endsWith('render-chatgpt.mjs')) {
  const fpsArg = process.argv.includes('--60fps') ? 60 : 30;
  renderChatGptVideo({ fps: fpsArg, duration: 30.0, numWorkers: 4 }).catch((err) => {
    console.error('Render failed:', err);
    process.exit(1);
  });
}
