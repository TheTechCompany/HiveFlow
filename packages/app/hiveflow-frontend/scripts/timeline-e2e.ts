// ── Timeline E2E Test Harness ──────────────────────────────────────
// Usage: cd packages/app/hiveflow-frontend && npx ts-node --transpile-only scripts/timeline-e2e.ts
// Or:    npx tsx scripts/timeline-e2e.ts

import puppeteer from 'puppeteer';

const BASE = 'http://localhost:8503';
const DEMO_PATH = '/dashboard/hive-flow/timeline-demo';

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  // Collect console logs from the page
  const consoleLogs: string[] = [];
  page.on('console', (msg) => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    console.log(`  BROWSER ${msg.type()}: ${msg.text()}`);
  });

  // Collect page errors
  page.on('pageerror', (err) => {
    console.log(`  PAGE ERROR: ${err.message}`);
  });

  try {
    console.log(`Navigating to ${BASE}${DEMO_PATH}...`);
    await page.goto(`${BASE}${DEMO_PATH}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(3000);

    // Dump page HTML for debugging
    const bodyHTML = await page.evaluate(() => document.body.innerHTML.substring(0, 2000));
    console.log('\n  Page HTML (first 2000 chars):');
    console.log(bodyHTML);
    console.log('');

    console.log('\n=== TEST 1: Check page loaded ===');
    const hasTimeline = await page.$('[data-timeline]');
    console.log(`  Timeline rendered: ${!!hasTimeline}`);

    const hasHeader = await page.$('[data-timeline-header]');
    console.log(`  Header rendered: ${!!hasHeader}`);

    const barCount = await page.$$eval('[data-timeline-item]', (els) => els.length);
    console.log(`  Bar count: ${barCount}`);

    // Find the timeline container and body
    const containerBox = await page.$eval('[data-timeline]', (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    console.log(`  Container: x=${containerBox.x} y=${containerBox.y} w=${containerBox.width} h=${containerBox.height}`);

    const bodyBox = await page.evaluate(() => {
      const el = document.querySelector('[data-timeline] div[style*="overflow: auto"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height, scrollLeft: el.scrollLeft, scrollWidth: el.scrollWidth };
    });
    console.log(`  Scrollable body: ${bodyBox ? `x=${bodyBox.x} w=${bodyBox.width} scrollLeft=${bodyBox.scrollLeft} scrollWidth=${bodyBox.scrollWidth}` : 'NOT FOUND'}`);

    if (!bodyBox) {
      console.log('\n  ❌ Scrollable body not found — cannot proceed with tests');
      await browser.close();
      return;
    }

    // Helper: simulate a drag on the timeline
    async function simulateDrag(startX: number, startY: number, endX: number, endY: number, shiftKey = false) {
      const midY = bodyBox!.y + bodyBox!.height / 2;
      const sx = bodyBox!.x + startX;
      const sy = midY + startY;
      const ex = bodyBox!.x + endX;
      const ey = midY + endY;

      await page.mouse.move(sx, sy);
      await page.mouse.down({ button: 'left' });
      // Send shift key if needed
      if (shiftKey) {
        await page.keyboard.down('Shift');
      }
      await sleep(50);

      // Move in steps for realism
      const steps = 5;
      for (let i = 1; i <= steps; i++) {
        const tx = sx + (ex - sx) * (i / steps);
        const ty = sy + (ey - sy) * (i / steps);
        await page.mouse.move(tx, ty);
        await sleep(30);
      }

      if (shiftKey) {
        await page.keyboard.up('Shift');
      }
      await page.mouse.up({ button: 'left' });
      await sleep(200);
    }

    // Helper: read current state
    async function readState() {
      return page.evaluate(() => {
        const el = document.querySelector('[data-timeline] div[style*="overflow: auto"]');
        const ghost = document.querySelector('[data-ghost-wrapper]');
        const ghostChild = ghost ? ghost.querySelector('div') : null;
        return {
          scrollLeft: el ? (el as HTMLElement).scrollLeft : -1,
          scrollWidth: el ? (el as HTMLElement).scrollWidth : -1,
          clientWidth: el ? (el as HTMLElement).clientWidth : -1,
          ghostWrapperExists: !!ghost,
          ghostChildStyle: ghostChild ? (ghostChild as HTMLElement).style.cssText : null,
        };
      });
    }

    // ── TEST 2: Pan by dragging on empty space ─────────────────────
    console.log('\n=== TEST 1.5: Verify handlePointerDown fires with native event ===');
    await page.evaluate(() => {
      const el = document.querySelector('[data-timeline]');
      if (el) {
        el.dispatchEvent(new PointerEvent('pointerdown', {
          bubbles: true, cancelable: true,
          clientX: 500, clientY: 300, pointerId: 99, shiftKey: false,
        }));
      }
    });
    await sleep(300);
    const hasAttr = await page.evaluate(() => {
      const el = document.querySelector('[data-timeline]');
      return el ? el.getAttribute('data-last-down') : null;
    });
    console.log(`  handlePointerDown data attr: ${hasAttr ? '✅ FIRED' : '❌ DID NOT FIRE'}`);

    // ── TEST 2: Pan by dragging empty space ─────────────────────
    console.log('\n=== TEST 2: Pan by dragging empty space ===');
    const beforePan = await readState();
    console.log(`  Before: scrollLeft=${beforePan.scrollLeft} scrollWidth=${beforePan.scrollWidth}`);

    // First verify handlePointerDown fires with native event dispatch
    await page.evaluate(() => {
      const el = document.querySelector('[data-timeline]');
      if (el) {
        el.dispatchEvent(new PointerEvent('pointerdown', {
          bubbles: true, cancelable: true,
          clientX: 500, clientY: 300, pointerId: 99, shiftKey: false,
        }));
      }
    });
    await sleep(100);
    
    // Now dispatch pointermove to pan  
    await page.evaluate(() => {
      document.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, cancelable: true,
        clientX: 300, clientY: 300, pointerId: 99, shiftKey: false,
      }));
    });
    await sleep(50);
    
    // And pointerup to end
    await page.evaluate(() => {
      document.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, cancelable: true,
        clientX: 300, clientY: 300, pointerId: 99, shiftKey: false,
      }));
    });
    await sleep(300);

    const afterPan = await readState();
    console.log(`  After:  scrollLeft=${afterPan.scrollLeft} scrollWidth=${afterPan.scrollWidth}`);
    console.log(`  Pan ${afterPan.scrollLeft > beforePan.scrollLeft ? '✅ WORKED' : afterPan.scrollLeft < beforePan.scrollLeft ? '⚠️  scrolled opposite direction' : `❌ DID NOT SCROLL (same width=${beforePan.scrollWidth})`}`);

    // ── TEST 3: Shift+drag to create ───────────────────────────────
    console.log('\n=== TEST 3: Shift+drag to create ===');
    const beforeCreate = await readState();
    console.log(`  Before: ghostWrapper=${beforeCreate.ghostWrapperExists}`);

    await simulateDrag(500, 200, 650, 200, true);

    const afterCreate = await readState();
    console.log(`  After:  ghostWrapper=${afterCreate.ghostWrapperExists}`);
    const barCountAfter = await page.$$eval('[data-timeline-item]', (els) => els.length);
    console.log(`  Bar count before=${barCount} after=${barCountAfter}`);
    console.log(`  Create ${barCountAfter > barCount ? '✅ NEW BAR CREATED' : afterCreate.ghostWrapperExists ? '⚠️  ghost showed but no bar created' : '❌ NO GHOST, NO BAR'}`);

    // ── TEST 4: Drag existing bar with edge scroll ─────────────────
    console.log('\n=== TEST 4: Drag bar to edge (edge scroll) ===');
    const firstBar = await page.$('[data-timeline-item]');
    if (firstBar) {
      const barBox = await firstBar.boundingBox();
      if (barBox) {
        console.log(`  Bar at: x=${barBox.x} y=${barBox.y} w=${barBox.width} h=${barBox.height}`);
        
        const scrollBefore = (await readState()).scrollLeft;
        // Drag the bar to the right edge
        const barCenterY = barBox.y + barBox.height / 2;
        await page.mouse.move(barBox.x + 5, barCenterY);
        await page.mouse.down({ button: 'left' });
        await sleep(50);
        // Move far right to trigger edge scroll
        for (let i = 0; i < 30; i++) {
          await page.mouse.move(bodyBox.x + bodyBox.width - 10, barCenterY);
          await sleep(50);
        }
        await page.mouse.up({ button: 'left' });
        await sleep(200);

        const scrollAfter = (await readState()).scrollLeft;
        console.log(`  Scroll before=${scrollBefore} after=${scrollAfter}`);
        console.log(`  Edge scroll ${scrollAfter !== scrollBefore ? '✅ WORKED' : '❌ DID NOT SCROLL'}`);
      } else {
        console.log('  Could not get bar bounding box');
      }
    } else {
      console.log('  No bars found to drag');
    }

    // ── Summary ─────────────────────────────────────────────────────
    const logs = consoleLogs.filter((l) => l.includes('event') || l.includes('action') || l.includes('ERROR') || l.includes('error'));
    console.log('\n=== BROWSER LOGS (filtered) ===');
    logs.slice(-30).forEach((l) => console.log(`  ${l}`));

    console.log('\n=== Done. Keeping browser open for 5s for inspection ===');
    await sleep(5000);
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

main();
