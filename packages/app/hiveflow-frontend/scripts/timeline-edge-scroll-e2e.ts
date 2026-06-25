// ── Edge-scroll e2e test (Puppeteer — real CDP mouse events) ─────
// Puppeteer's page.mouse dispatches real browser-level events that
// trigger React's onPointerDown correctly on child elements, unlike
// dispatchEvent which only works on the target element itself.

const puppeteer = require('puppeteer');

const BASE = 'http://localhost:8080';
const PATH = '/dashboard/hive-flow/timeline-demo';

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1280, height: 900 },
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();

  // Collect console messages
  const logs: string[] = [];
  page.on('console', (msg) => {
    const text = msg.text();
    if (text.includes('[onMove]') || text.includes('[edge-scroll]') || text.includes('[drag]')) {
      console.log('  BROWSER:', text);
      logs.push(text);
    }
  });
  page.on('pageerror', (err) => console.log('  PAGE ERROR:', err.message));

  try {
    // Mock GraphQL
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.url().includes('/graphql') || req.url().includes('localhost:7000')) {
        req.respond({ status: 200, contentType: 'application/json', body: '{"data":{}}' });
      } else {
        req.continue();
      }
    });

    await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(4000);

    // Find the first bar
    const barInfo = await page.evaluate(() => {
      const bar = document.querySelector('[data-timeline-item]');
      if (!bar) return null;
      const r = bar.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, id: bar.getAttribute('data-timeline-item') };
    });
    if (!barInfo) { console.log('❌ No bar found'); await browser.close(); return; }
    console.log(`Bar: id=${barInfo.id} x=${barInfo.x} y=${barInfo.y} w=${barInfo.w} h=${barInfo.h}`);

    // Get body rect
    const bodyRect = await page.evaluate(() => {
      const t = document.querySelector('[data-timeline]');
      if (!t) return null;
      const body = t.children[1];
      const r = body.getBoundingClientRect();
      return { left: r.left, right: r.right, width: r.width, top: r.top };
    });
    console.log(`Body: left=${bodyRect.left} right=${bodyRect.right} width=${bodyRect.width}`);

    // Helper to read pan X from DOM
    async function readPanX() {
      return page.evaluate(() => {
        const t = document.querySelector('[data-timeline]');
        if (!t) return NaN;
        const body = t.children[1] as HTMLElement;
        const pw = body.children[0] as HTMLElement;
        const m = pw.style.transform.match(/translateX\(([-\d.]+)px\)/);
        return m ? parseFloat(m[1]) : 0;
      });
    }

    // ── Test 1: Bar drag edge-scroll to the right ──────────────────
    console.log('\n=== Test 1: Bar drag edge-scroll right ===');
    const beforeRight = await readPanX();
    console.log(`  panX before: ${beforeRight}`);

    // Click and hold the bar
    const barCX = barInfo.x + barInfo.w / 2;
    const barCY = barInfo.y + barInfo.h / 2;
    console.log(`  clicking bar at (${barCX}, ${barCY})`);

    await page.mouse.move(barCX, barCY);
    await page.mouse.down();
    await sleep(200);

    // Check if drag started
    const isDragging = await page.evaluate(() => {
      return !!document.querySelector('.timeline-bar--dragging');
    });
    console.log(`  isDragging: ${isDragging}`);

    if (!isDragging) {
      // Try again with a slight offset
      console.log('  Retry: clicking slightly left...');
      await page.mouse.up();
      await sleep(100);
      await page.mouse.move(barCX - 20, barCY);
      await page.mouse.down();
      await sleep(200);
      const isDragging2 = await page.evaluate(() => {
        return !!document.querySelector('.timeline-bar--dragging');
      });
      console.log(`  isDragging (retry): ${isDragging2}`);
    }

    // Move to right edge repeatedly
    for (let i = 0; i < 30; i++) {
      await page.mouse.move(bodyRect.right - 10, barCY);
      await sleep(30);
    }

    const afterRight = await readPanX();
    console.log(`  panX after edge-scroll: ${afterRight}`);

    await page.mouse.up();
    await sleep(300);

    const finalRight = await readPanX();
    console.log(`  panX after release: ${finalRight}`);

    // ── Test 2: Bar drag edge-scroll to the left ───────────────────
    console.log('\n=== Test 2: Bar drag edge-scroll left ===');

    // Find a bar on the right side
    const bars = await page.evaluate(() => {
      return [...document.querySelectorAll('[data-timeline-item]')].map(b => {
        const r = b.getBoundingClientRect();
        return { id: b.getAttribute('data-timeline-item'), x: r.x, y: r.y, w: r.width, h: r.height };
      });
    });
    const rightBar = bars.reduce((a, b) => a.x > b.x ? a : b);
    console.log(`  rightmost bar: id=${rightBar.id} x=${rightBar.x}`);

    const beforeLeft = await readPanX();
    console.log(`  panX before: ${beforeLeft}`);

    await page.mouse.move(rightBar.x + 20, rightBar.y + rightBar.h / 2);
    await page.mouse.down();
    await sleep(200);

    // Move to left edge repeatedly
    for (let i = 0; i < 30; i++) {
      await page.mouse.move(bodyRect.left + 10, rightBar.y + rightBar.h / 2);
      await sleep(30);
    }

    const afterLeft = await readPanX();
    console.log(`  panX after edge-scroll: ${afterLeft}`);

    await page.mouse.up();
    await sleep(300);

    // ── Results ────────────────────────────────────────────────────
    console.log('\n=== Results ===');
    console.log(`  Right edge-scroll: ${beforeRight} → ${afterRight} (expected: after > before)`);
    console.log(`  Left edge-scroll:  ${beforeLeft} → ${afterLeft} (expected: after < before)`);

    const rightOk = afterRight > beforeRight;
    const leftOk = afterLeft < beforeLeft;
    console.log(`  Right: ${rightOk ? '✅' : '❌'}  Left: ${leftOk ? '✅' : '❌'}`);

    if (!rightOk && !leftOk) {
      console.log('\n  Debug: console logs from browser:');
      for (const l of logs) console.log('    ' + l);
      if (logs.length === 0) console.log('    (no logs — onMove never fired)');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
}

main();
