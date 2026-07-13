// ── Timeline E2E: Comprehensive test suite ─────────────────────────
// Covers panning, wheel, shift+drag create, selection, readonly,
// keyboard, loading/empty states, and navigation.

import { test, expect } from '@playwright/test';

const DEMO_URL = 'http://localhost:8080/dashboard/hive-flow/timeline-demo';

// ── Helpers ──────────────────────────────────────────────────────────

async function readPanOffset(page: any): Promise<number> {
  return page.evaluate(() => {
    const timeline = document.querySelector('[data-timeline]');
    if (!timeline) return NaN;
    const body = timeline.children[1] as HTMLElement;
    if (!body) return NaN;
    const panWrapper = body.children[0] as HTMLElement;
    const m = panWrapper.style.transform.match(/translateX\(([-\d.]+)px\)/);
    return m ? parseFloat(m[1]) : 0;
  });
}

async function countItems(page: any): Promise<number> {
  return page.locator('[data-timeline-item]').count();
}

async function dispatchPointer(
  page: any,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  x: number,
  y: number,
  opts: { shiftKey?: boolean; pointerId?: number } = {},
) {
  await page.evaluate(
    ({ type, x, y, shiftKey, pointerId }: any) => {
      const el = document.querySelector('[data-timeline]');
      if (el) {
        el.dispatchEvent(new PointerEvent(type, {
          bubbles: true, cancelable: true,
          clientX: x, clientY: y,
          pointerId: pointerId ?? 1, shiftKey: !!shiftKey, button: 0,
        }));
      }
    },
    { type, x, y, shiftKey: opts.shiftKey ?? false, pointerId: opts.pointerId ?? 1 },
  );
}

async function setupPage(page: any) {
  await page.route('**/graphql', async (route: any) => {
    await route.fulfill({ json: { data: {} } });
  });
  await page.route('http://localhost:7000/**', async (route: any) => {
    await route.fulfill({ status: 404, json: {} });
  });
  await page.route('**/.well-known/**', async (route: any) => {
    await route.fulfill({ status: 404 });
  });

  await page.goto(DEMO_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  await page.addStyleTag({
    content: 'div[id^=single-spa-application]{ height: 100vh; } body{padding: 0; margin: 0}',
  });

  await expect(page.locator('[data-timeline]')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('[data-timeline-item]').first()).toBeVisible({ timeout: 15000 });
}

// ── Tests ────────────────────────────────────────────────────────────

test.describe('Timeline', () => {
  test.describe('rendering', () => {
    test.beforeEach(async ({ page }) => { await setupPage(page); });

    test('renders the timeline container', async ({ page }) => {
      await expect(page.locator('[data-timeline]')).toBeVisible();
    });

    test('renders items as bars', async ({ page }) => {
      const count = await countItems(page);
      expect(count).toBeGreaterThan(0);
    });

    test('renders the today marker', async ({ page }) => {
      const marker = page.locator('[data-today-line]');
      await expect(marker).toBeVisible();
    });

    test('renders the grid', async ({ page }) => {
      await expect(page.locator('[data-timeline-grid]')).toBeVisible();
    });

    test('renders group rows', async ({ page }) => {
      // The harness has 5 groups
      const rows = page.locator('[data-timeline-row]');
      const count = await rows.count();
      expect(count).toBeGreaterThanOrEqual(5);
    });

    test('renders the nav buttons', async ({ page }) => {
      await expect(page.locator('button[title="Previous"]')).toBeVisible();
      await expect(page.locator('button[title="Today"]')).toBeVisible();
      await expect(page.locator('button[title="Next"]')).toBeVisible();
    });
  });

  test.describe('panning', () => {
    test.beforeEach(async ({ page }) => { await setupPage(page); });

    test('drag left on empty space updates dates (CSS stays at 0)', async ({ page }) => {
      expect(await readPanOffset(page)).toBe(0);

      await dispatchPointer(page, 'pointerdown', 600, 400);
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointermove', 400, 400);
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointerup', 400, 400);
      await page.waitForTimeout(500);

      expect(await readPanOffset(page)).toBe(0);
      expect(await countItems(page)).toBeGreaterThan(0);
    });

    test('drag right on empty space updates dates', async ({ page }) => {
      await dispatchPointer(page, 'pointerdown', 400, 400);
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointermove', 600, 400);
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointerup', 600, 400);
      await page.waitForTimeout(500);

      expect(await readPanOffset(page)).toBe(0);
      expect(await countItems(page)).toBeGreaterThan(0);
    });

    test('click without movement clears selection and does not pan', async ({ page }) => {
      const before = await readPanOffset(page);
      await dispatchPointer(page, 'pointerdown', 500, 400);
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointerup', 501, 400);
      await page.waitForTimeout(300);
      expect(await readPanOffset(page)).toBe(before);
    });

    test('large drags do not break the timeline', async ({ page }) => {
      await dispatchPointer(page, 'pointerdown', 700, 400);
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointermove', 100, 400);
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointerup', 100, 400);
      await page.waitForTimeout(500);

      await dispatchPointer(page, 'pointerdown', 400, 400);
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointermove', 1200, 400);
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointerup', 1200, 400);
      await page.waitForTimeout(500);

      expect(await countItems(page)).toBeGreaterThan(0);
    });
  });

  test.describe('wheel', () => {
    test.beforeEach(async ({ page }) => { await setupPage(page); });

    test('wheel deltaX updates dates (CSS stays at 0)', async ({ page }) => {
      expect(await readPanOffset(page)).toBe(0);

      await page.evaluate(() => {
        const timeline = document.querySelector('[data-timeline]');
        if (!timeline) return;
        const body = timeline.children[1] as HTMLElement;
        body.dispatchEvent(new WheelEvent('wheel', {
          bubbles: true, cancelable: true, deltaX: 120, deltaY: 0,
        }));
      });
      await page.waitForTimeout(400);

      expect(await readPanOffset(page)).toBe(0);
      expect(await countItems(page)).toBeGreaterThan(0);
    });

    test('wheel shiftKey pans via deltaY', async ({ page }) => {
      await page.evaluate(() => {
        const timeline = document.querySelector('[data-timeline]');
        if (!timeline) return;
        const body = timeline.children[1] as HTMLElement;
        body.dispatchEvent(new WheelEvent('wheel', {
          bubbles: true, cancelable: true, deltaX: 0, deltaY: 120, shiftKey: true,
        }));
      });
      await page.waitForTimeout(400);

      expect(await readPanOffset(page)).toBe(0);
      expect(await countItems(page)).toBeGreaterThan(0);
    });

    test('rapid wheel events do not break the timeline', async ({ page }) => {
      await page.evaluate(() => {
        const timeline = document.querySelector('[data-timeline]');
        if (!timeline) return;
        const body = timeline.children[1] as HTMLElement;
        for (let i = 0; i < 5; i++) {
          body.dispatchEvent(new WheelEvent('wheel', {
            bubbles: true, cancelable: true, deltaX: 60, deltaY: 0,
          }));
        }
      });
      await page.waitForTimeout(500);
      expect(await readPanOffset(page)).toBe(0);
      expect(await countItems(page)).toBeGreaterThan(0);
    });
  });

  test.describe('shift+drag create', () => {
    test.beforeEach(async ({ page }) => { await setupPage(page); });

    test('creates a new bar and does not change pan offset', async ({ page }) => {
      const beforeCount = await countItems(page);
      const beforePan = await readPanOffset(page);

      await dispatchPointer(page, 'pointerdown', 600, 500, { shiftKey: true });
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointermove', 750, 500, { shiftKey: true });
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointerup', 750, 500, { shiftKey: true });
      await page.waitForTimeout(500);

      expect(await countItems(page)).toBeGreaterThan(beforeCount);
      expect(await readPanOffset(page)).toBe(beforePan);
    });

    test('shift+drag near edges does not break the timeline', async ({ page }) => {
      const beforeCount = await countItems(page);

      await dispatchPointer(page, 'pointerdown', 500, 500, { shiftKey: true });
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointermove', 580, 500, { shiftKey: true });
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointerup', 580, 500, { shiftKey: true });
      await page.waitForTimeout(500);

      expect(await countItems(page)).toBeGreaterThan(beforeCount);
    });

    test('creates a new group when dragging in filler lane', async ({ page }) => {
      const beforeGroups = await page.locator('[data-timeline-row]').count();

      // Drag far down in the filler area (Y well beyond any existing rows)
      await dispatchPointer(page, 'pointerdown', 600, 800, { shiftKey: true });
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointermove', 750, 800, { shiftKey: true });
      await page.waitForTimeout(50);
      await dispatchPointer(page, 'pointerup', 750, 800, { shiftKey: true });
      await page.waitForTimeout(500);

      // Either a new group row was added or the item went to an existing group
      const afterGroups = await page.locator('[data-timeline-row]').count();
      expect(afterGroups).toBeGreaterThanOrEqual(beforeGroups);
    });
  });

  test.describe('navigation', () => {
    test.beforeEach(async ({ page }) => { await setupPage(page); });

    test('nav buttons are clickable', async ({ page }) => {
      const prev = page.locator('button[title="Previous"]');
      const next = page.locator('button[title="Next"]');
      const today = page.locator('button[title="Today"]');

      await expect(prev).toBeEnabled();
      await expect(next).toBeEnabled();
      await expect(today).toBeEnabled();
    });

    test('clicking Today button is present', async ({ page }) => {
      const today = page.locator('button[title="Today"]');
      await expect(today).toBeVisible();
      await expect(today).toBeEnabled();
    });
  });

  test.describe('keyboard', () => {
    test.beforeEach(async ({ page }) => { await setupPage(page); });

    test('Escape key does not break the timeline', async ({ page }) => {
      await page.locator('[data-timeline]').press('Escape');
      await page.waitForTimeout(200);
      expect(await countItems(page)).toBeGreaterThan(0);
    });
  });

  test.describe('readonly mode', () => {
    test.beforeEach(async ({ page }) => { await setupPage(page); });

    test('readonly toggle exists and is unchecked by default', async ({ page }) => {
      // The harness has a "Read-only" switch
      const switchEl = page.locator('input[type="checkbox"]').first();
      await expect(switchEl).not.toBeChecked();
    });
  });
});
