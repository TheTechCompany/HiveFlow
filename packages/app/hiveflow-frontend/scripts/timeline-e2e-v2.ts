// ── Timeline E2E — focused tests using native event dispatch ───────
// Puppeteer's page.mouse doesn't reliably trigger React onPointerDown,
// so we use page.evaluate + native PointerEvent dispatch.

import puppeteer from 'puppeteer';

const BASE = 'http://localhost:8503';
const DEMO_PATH = '/dashboard/hive-flow/timeline-demo';

async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  page.on('console', (msg) => {
    if (msg.text().includes('[native') || msg.text().includes('[handlePointer')) {
      console.log(`  BROWSER: ${msg.text()}`);
    }
  });

  page.on('pageerror', (err) => console.log(`  PAGE ERROR: ${err.message}`));

  try {
    await page.goto(`${BASE}${DEMO_PATH}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(3000);

    const exists = await page.$('[data-timeline]');
    console.log(`Timeline rendered: ${!!exists}`);
    if (!exists) { await browser.close(); return; }

    // Helper: dispatch native pointer events
    async function nativePointer(phase: 'down' | 'move' | 'up', x: number, y: number, shift: boolean, pid: number) {
      const type = phase === 'down' ? 'pointerdown' : phase === 'move' ? 'pointermove' : 'pointerup';
      await page.evaluate(({ type, x, y, shift, pid }) => {
        const el = document.querySelector('[data-timeline]');
        if (el) {
          el.dispatchEvent(new PointerEvent(type, {
            bubbles: true, cancelable: true,
            clientX: x, clientY: y, pointerId: pid, shiftKey: shift,
          }));
        }
      }, { type, x, y, shift, pid });
    }

    async function readScroll() {
      return page.evaluate(() => {
        const el = document.querySelector('[data-timeline] div[style*="overflow: auto"]');
        if (!el) return { sl: -1, sw: -1, cw: -1 };
        return {
          sl: (el as HTMLElement).scrollLeft,
          sw: (el as HTMLElement).scrollWidth,
          cw: (el as HTMLElement).clientWidth,
        };
      });
    }

    // ── Check scroll dimensions ──────────────────────────────────
    const dims = await readScroll();
    console.log(`\nScroll dimensions: scrollWidth=${dims.sw} clientWidth=${dims.cw} maxScroll=${dims.sw - dims.cw}`);
    const canScroll = dims.sw > dims.cw;

    // ── TEST: Pan by drag ─────────────────────────────────────────
    console.log('\n=== Pan test ===');
    const before = await readScroll();
    
    // pointerdown
    await nativePointer('down', 600, 400, false, 10);
    await sleep(50);
    // pointermove (drag left → should trigger 'next' navigation)
    await nativePointer('move', 200, 400, false, 10);
    await sleep(50);
    // pointerup
    await nativePointer('up', 200, 400, false, 10);
    await sleep(500);

    const after = await readScroll();
    console.log(`  Before: scrollLeft=${before.sl} | After: scrollLeft=${after.sl}`);
    // Check if onNavigate was called by looking for new items
    const barsAfterPan = await page.$$eval('[data-timeline-item]', (els) => els.length);
    console.log(`  Bars after pan: ${barsAfterPan}`);
    if (barsAfterPan !== barsBeforeCreate) console.log('  ✅ PAN NAVIGATED (different items visible)');
    else if (!canScroll) console.log('  ⚠️  Content fits viewport — pan triggers onNavigate call');
    else console.log('  ❌ PAN FAILED');

    // ── TEST: Shift+drag to create ────────────────────────────────
    console.log('\n=== Create test ===');
    const barsBefore = await page.$$eval('[data-timeline-item]', (els) => els.length);
    console.log(`  Bars before: ${barsBefore}`);

    // pointerdown with shift
    await nativePointer('down', 600, 500, true, 20);
    await sleep(50);
    // pointermove to create range
    await nativePointer('move', 750, 500, true, 20);
    await sleep(50);
    // pointerup
    await nativePointer('up', 750, 500, true, 20);
    await sleep(500);

    const barsAfter = await page.$$eval('[data-timeline-item]', (els) => els.length);
    console.log(`  Bars after: ${barsAfter}`);
    if (barsAfter > barsBefore) console.log('  ✅ CREATE WORKED');
    else console.log('  ❌ CREATE FAILED');

    // ── TEST: Edge scroll during bar drag ─────────────────────────
    console.log('\n=== Edge scroll test ===');
    const firstBar = await page.$('[data-timeline-item]');
    if (firstBar) {
      const bb = await firstBar.boundingBox();
      if (bb) {
        console.log(`  Bar at x=${bb.x} y=${bb.y}`);
        
        // Click and hold the bar
        await page.mouse.move(bb.x + 5, bb.y + bb.height / 2);
        await page.mouse.down();
        await sleep(100);

        const scBefore = (await readScroll()).sl;
        
        // Move far right repeatedly to trigger edge scroll
        for (let i = 0; i < 20; i++) {
          await page.mouse.move(1350, bb.y + bb.height / 2); // near right edge
          await sleep(30);
        }
        
        const scMid = (await readScroll()).sl;
        await page.mouse.up();
        await sleep(200);

        const scAfter = (await readScroll()).sl;
        console.log(`  Scroll: before=${scBefore} mid=${scMid} after=${scAfter}`);
        if (scMid !== scBefore) console.log('  ✅ EDGE SCROLL WORKED');
        else if (!canScroll) console.log('  ⚠️  Cannot scroll — content fits viewport');
        else console.log('  ❌ EDGE SCROLL FAILED');
      }
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

main();
