#!/usr/bin/env node

/**
 * HistTUI Demo GIF Generator
 * 
 * Creates animated GIFs from the complete demo by automating browser interactions
 * with Playwright.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DEMO_FILE = path.join(__dirname, '..', 'demo-complete.html');
const OUTPUT_DIR = path.join(__dirname, '..', 'gifs');
const FRAME_RATE = 10; // frames per second
const QUALITY = 90;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureScreenSequence(page, name, actions) {
  const frames = [];
  let frameCount = 0;
  
  for (const action of actions) {
    if (action.type === 'wait') {
      // Capture frames during wait
      const numFrames = Math.floor((action.duration / 1000) * FRAME_RATE);
      for (let i = 0; i < numFrames; i++) {
        const screenshot = await page.screenshot({ type: 'png' });
        frames.push(screenshot);
        frameCount++;
        await page.waitForTimeout(1000 / FRAME_RATE);
      }
    } else if (action.type === 'key') {
      await page.keyboard.press(action.key);
      // Capture frames for animation
      for (let i = 0; i < 5; i++) {
        const screenshot = await page.screenshot({ type: 'png' });
        frames.push(screenshot);
        frameCount++;
        await page.waitForTimeout(1000 / FRAME_RATE);
      }
    } else if (action.type === 'click') {
      await page.click(action.selector);
      for (let i = 0; i < 5; i++) {
        const screenshot = await page.screenshot({ type: 'png' });
        frames.push(screenshot);
        frameCount++;
        await page.waitForTimeout(1000 / FRAME_RATE);
      }
    }
  }
  
  return frames;
}

async function saveFramesAsGif(frames, outputPath, name) {
  // Save frames as PNG files
  const tempDir = path.join(OUTPUT_DIR, `.temp-${name}`);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  for (let i = 0; i < frames.length; i++) {
    const framePath = path.join(tempDir, `frame_${String(i).padStart(5, '0')}.png`);
    fs.writeFileSync(framePath, frames[i]);
  }
  
  console.log(`Saved ${frames.length} frames to ${tempDir}`);
  
  // Convert to GIF immediately
  const { execSync } = require('child_process');
  try {
    execSync(
      `ffmpeg -y -framerate ${FRAME_RATE} -pattern_type glob -i '${tempDir}/frame_*.png' -vf "fps=${FRAME_RATE},scale=1400:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" ${outputPath}`,
      { stdio: 'pipe' }
    );
    console.log(`✅ Created ${path.basename(outputPath)}`);
    
    // Clean up temp frames
    execSync(`rm -rf "${tempDir}"`);
  } catch (error) {
    console.error(`❌ Error creating GIF: ${error.message}`);
  }
  
  return tempDir;
}

async function generateGif(name, actions, viewport = { width: 1400, height: 900 }) {
  console.log(`\n🎬 Generating GIF: ${name}`);
  console.log(`   Actions: ${actions.length}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  
  // Load demo
  await page.goto(`file://${DEMO_FILE}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
  
  // Capture sequence
  const frames = await captureScreenSequence(page, name, actions);
  
  // Save as GIF
  const outputPath = path.join(OUTPUT_DIR, `${name}.gif`);
  await saveFramesAsGif(frames, outputPath, name);
  
  console.log(`✅ ${name}: ${frames.length} frames`);
  
  await browser.close();
  
  return { name, frames: frames.length, outputPath };
}

async function main() {
  console.log('🚀 HistTUI Demo GIF Generator\n');
  console.log(`Demo: ${DEMO_FILE}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log(`Frame rate: ${FRAME_RATE} fps\n`);
  
  const scenarios = [
    {
      name: '01-overview-screens',
      actions: [
        { type: 'wait', duration: 1000 },
        { type: 'key', key: '1' },
        { type: 'wait', duration: 1500 },
        { type: 'key', key: '2' },
        { type: 'wait', duration: 1500 },
        { type: 'key', key: '3' },
        { type: 'wait', duration: 1500 },
        { type: 'key', key: '4' },
        { type: 'wait', duration: 1500 },
        { type: 'key', key: '5' },
        { type: 'wait', duration: 1500 },
        { type: 'key', key: '6' },
        { type: 'wait', duration: 1500 },
      ]
    },
    {
      name: '02-timeline-navigation',
      actions: [
        { type: 'key', key: '1' },
        { type: 'wait', duration: 1000 },
        { type: 'key', key: 'j' },
        { type: 'wait', duration: 300 },
        { type: 'key', key: 'j' },
        { type: 'wait', duration: 300 },
        { type: 'key', key: 'j' },
        { type: 'wait', duration: 300 },
        { type: 'key', key: 'k' },
        { type: 'wait', duration: 300 },
        { type: 'key', key: 'g' },
        { type: 'wait', duration: 800 },
        { type: 'key', key: 'G' },
        { type: 'wait', duration: 800 },
        { type: 'key', key: 'Enter' },
        { type: 'wait', duration: 2000 },
      ]
    },
    {
      name: '03-themes-showcase',
      actions: [
        { type: 'key', key: '1' },
        { type: 'wait', duration: 1000 },
        { type: 'click', selector: '#theme-toggle' },
        { type: 'wait', duration: 500 },
        { type: 'click', selector: '[data-theme="calm"]' },
        { type: 'wait', duration: 1500 },
        { type: 'click', selector: '#theme-toggle' },
        { type: 'wait', duration: 500 },
        { type: 'click', selector: '[data-theme="high-contrast"]' },
        { type: 'wait', duration: 1500 },
        { type: 'click', selector: '#theme-toggle' },
        { type: 'wait', duration: 500 },
        { type: 'click', selector: '[data-theme="colorblind"]' },
        { type: 'wait', duration: 1500 },
        { type: 'click', selector: '#theme-toggle' },
        { type: 'wait', duration: 500 },
        { type: 'click', selector: '[data-theme="monochrome"]' },
        { type: 'wait', duration: 1500 },
        { type: 'click', selector: '#theme-toggle' },
        { type: 'wait', duration: 500 },
        { type: 'click', selector: '[data-theme="default"]' },
        { type: 'wait', duration: 1000 },
      ]
    },
    {
      name: '04-dashboard-stats',
      actions: [
        { type: 'key', key: '4' },
        { type: 'wait', duration: 3000 },
      ]
    },
    {
      name: '05-file-tree',
      actions: [
        { type: 'key', key: '3' },
        { type: 'wait', duration: 1000 },
        { type: 'key', key: 'j' },
        { type: 'wait', duration: 300 },
        { type: 'key', key: 'j' },
        { type: 'wait', duration: 300 },
        { type: 'key', key: 'j' },
        { type: 'wait', duration: 300 },
        { type: 'key', key: 'j' },
        { type: 'wait', duration: 1000 },
      ]
    },
    {
      name: '06-code-planner',
      actions: [
        { type: 'key', key: '6' },
        { type: 'wait', duration: 2000 },
        { type: 'key', key: 'j' },
        { type: 'wait', duration: 1500 },
        { type: 'key', key: 'k' },
        { type: 'wait', duration: 1000 },
      ]
    },
    {
      name: '07-help-panel',
      actions: [
        { type: 'key', key: '1' },
        { type: 'wait', duration: 1000 },
        { type: 'key', key: '?' },
        { type: 'wait', duration: 2000 },
        { type: 'key', key: '?' },
        { type: 'wait', duration: 1000 },
      ]
    }
  ];
  
  const results = [];
  
  for (const scenario of scenarios) {
    try {
      const result = await generateGif(scenario.name, scenario.actions);
      results.push(result);
    } catch (error) {
      console.error(`❌ Error generating ${scenario.name}:`, error.message);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log('═══════════════════════════════════════');
  for (const result of results) {
    console.log(`✅ ${result.name}: ${result.frames} frames → ${result.outputPath}`);
  }
  
  console.log('\n✨ All GIFs created successfully!');
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
}

main().catch(console.error);
