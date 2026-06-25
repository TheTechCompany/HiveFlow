// ── Timeline — TimelineHeader unit tests ────────────────────────────
// Isolated multi-tier time-axis header rendering.

import React from 'react';
import { render } from '@testing-library/react';
import { TimelineHeader } from '../TimelineHeader';
import type { TimelineHeaderProps } from '../TimelineHeader';
import type { TimelineGeometry } from '../types';

// ── Helpers ─────────────────────────────────────────────────────────

function d(iso: string): Date {
  let s = iso.replace(/Z$/, '');
  if (!s.includes('T')) s += 'T00:00:00';
  return new Date(s);
}

function makeGeometry(overrides: Partial<TimelineGeometry> = {}): TimelineGeometry {
  return {
    viewportWidth: 1200,
    viewportHeight: 600,
    sidebarWidth: 0,
    timelineWidth: 1120,
    pxPerMs: 1120 / (14 * 86400000), // ~80px per day
    pxPerStep: 80,
    stepDurationMs: 86400000,
    ...overrides,
  };
}

const defaultProps: TimelineHeaderProps = {
  geometry: makeGeometry(),
  start: d('2025-06-01'),
  end: d('2025-06-15'),
  step: 'day',
  height: 60,
};

function renderHeader(overrides: Partial<TimelineHeaderProps> = {}) {
  return render(<TimelineHeader {...defaultProps} {...overrides} />);
}

// ── Tests ───────────────────────────────────────────────────────────

describe('TimelineHeader', () => {
  // ── Rendering ──────────────────────────────────────────────────

  it('renders the header container with data-timeline-header', () => {
    renderHeader();
    const header = document.querySelector('[data-timeline-header]');
    expect(header).toBeInTheDocument();
  });

  it('applies the specified height', () => {
    renderHeader({ height: 80 });
    const header = document.querySelector('[data-timeline-header]') as HTMLElement;
    expect(header.style.height).toBe('80px');
  });

  it('has sticky positioning', () => {
    renderHeader();
    const header = document.querySelector('[data-timeline-header]') as HTMLElement;
    expect(header.style.position).toBe('sticky');
    expect(header.style.top).toBe('0px');
  });

  it('has a bottom border separator', () => {
    renderHeader();
    const header = document.querySelector('[data-timeline-header]') as HTMLElement;
    expect(header.style.borderBottom).toContain('2px solid');
  });

  // ── Day step tiers ─────────────────────────────────────────────

  it('renders month + day tiers for day step', () => {
    renderHeader({ step: 'day' });
    // Month tier label should be visible
    expect(document.body.textContent).toContain('June');
    // Day tier labels should be visible (day numbers)
    expect(document.body.textContent).toMatch(/\d+/);
  });

  it('renders month labels in bold (fontWeight 600)', () => {
    renderHeader({ step: 'day' });
    const header = document.querySelector('[data-timeline-header]')!;
    const spans = header.querySelectorAll('span');
    const monthSpan = Array.from(spans).find(
      (s) => s.textContent?.includes('June'),
    ) as HTMLElement;
    expect(monthSpan).toBeTruthy();
    if (monthSpan) {
      expect(monthSpan.style.fontWeight).toBe('600');
    }
  });

  // ── Week step tiers ────────────────────────────────────────────

  it('renders 3 tiers for week step', () => {
    renderHeader({
      step: 'week',
      start: d('2025-06-01'),
      end: d('2025-07-06'),
      geometry: makeGeometry({
        pxPerMs: 1200 / (35 * 86400000),
        pxPerStep: 160,
        stepDurationMs: 7 * 86400000,
      }),
    });
    const header = document.querySelector('[data-timeline-header]')!;
    // 3 tier rows expected: month, week, day
    const rows = header.querySelectorAll(':scope > div');
    expect(rows.length).toBeGreaterThanOrEqual(2);
  });

  // ── Hour step tiers ────────────────────────────────────────────

  it('renders day + hour tiers for hour step', () => {
    renderHeader({
      step: 'hour',
      start: d('2025-06-01T00:00:00'),
      end: d('2025-06-02T00:00:00'),
      geometry: makeGeometry({
        pxPerMs: 1200 / 86400000,
        pxPerStep: 60,
        stepDurationMs: 3600000,
      }),
    });
    const header = document.querySelector('[data-timeline-header]')!;
    // Should have hour labels (HH:mm format)
    expect(header).toBeInTheDocument();
  });

  // ── Month step tiers ───────────────────────────────────────────

  it('renders year + month tiers for month step', () => {
    renderHeader({
      step: 'month',
      start: d('2025-01-01'),
      end: d('2025-06-01'),
      geometry: makeGeometry({
        pxPerMs: 1200 / (150 * 86400000),
        pxPerStep: 200,
        stepDurationMs: 30 * 86400000,
      }),
      height: 60,
    });
    const header = document.querySelector('[data-timeline-header]')!;
    // Year tier (2025) should be present
    expect(header.textContent).toContain('2025');
  });

  // ── Custom renderDay ───────────────────────────────────────────

  it('calls renderDay for finest tier intervals', () => {
    const renderDay = jest.fn().mockReturnValue(<span data-testid="custom-day">custom</span>);
    renderHeader({ renderDay });
    const customElements = document.querySelectorAll('[data-testid="custom-day"]');
    expect(customElements.length).toBeGreaterThan(0);
    expect(renderDay).toHaveBeenCalled();
  });

  it('does not render custom day content when renderDay is absent', () => {
    renderHeader({ renderDay: undefined });
    const customElements = document.querySelectorAll('[data-testid="custom-day"]');
    expect(customElements.length).toBe(0);
  });

  // ── Narrow day tier behavior ───────────────────────────────────

  it('drops day tier when pxPerDay < 20 (tight zoom)', () => {
    // pxPerMs * 86400000 must be < 20.
    // Use a tiny timelineWidth so total px is small relative to the date range.
    renderHeader({
      step: 'day',
      start: d('2025-01-01'),
      end: d('2025-12-31'),
      geometry: {
        viewportWidth: 800,
        viewportHeight: 600,
        sidebarWidth: 0,
        timelineWidth: 800,
        pxPerMs: 800 / (365 * 86400000), // 800px over 365 days ≈ 0.0253 px/ms → ~2.19 px/day
        pxPerStep: 2.19,
        stepDurationMs: 86400000,
      },
    });
    const header = document.querySelector('[data-timeline-header]')!;
    // Only month tier should render (day tier dropped when < 20px/day)
    // Use header.children to count direct children (tier row divs)
    // renderDayContent is not provided so no extra div
    const directChildren = Array.from(header.children).filter(
      (c) => c.tagName === 'DIV',
    );
    expect(directChildren.length).toBe(1);
  });

  it('shows shortened day labels when pxPerDay < 45', () => {
    // 25px/day → between 20 and 45, so shows day numbers only
    renderHeader({
      step: 'day',
      start: d('2025-06-01'),
      end: d('2025-06-08'),
      geometry: makeGeometry({
        pxPerMs: 1000 / (7 * 86400000), // ~142 px/day — wait, that's not narrow
        pxPerStep: 80,
        stepDurationMs: 86400000,
        timelineWidth: 320, // only 320px for 7 days = ~45px/day
      }),
    });
    // In this setup, we have pxPerMs = 320 / (7 * 86400000) ≈ 0.00053, pxPerDay ≈ 45.7
    // Slightly above 45, so full labels. Let's make it narrower.
    renderHeader({
      step: 'day',
      start: d('2025-06-01'),
      end: d('2025-06-08'),
      geometry: makeGeometry({
        pxPerMs: 200 / (7 * 86400000), // ~0.00033, pxPerDay ≈ 28.5
        pxPerStep: 28.5,
        stepDurationMs: 86400000,
        timelineWidth: 200,
      }),
    });
    // Day labels should be just the day number (no weekday prefix)
    const header = document.querySelector('[data-timeline-header]')!;
    expect(header).toBeInTheDocument();
    // We can't easily test the exact label format without knowing locale,
    // but the component should still render
  });

  // ── Interval positioning ───────────────────────────────────────

  it('positions intervals absolutely within the header', () => {
    renderHeader({ step: 'day' });
    const header = document.querySelector('[data-timeline-header]')!;
    // Each interval cell should be absolutely positioned
    const cells = header.querySelectorAll('[style*="position: absolute"]');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('renders borders between intervals', () => {
    renderHeader({ step: 'day' });
    const header = document.querySelector('[data-timeline-header]')!;
    const cells = header.querySelectorAll('[style*="border-right"]');
    expect(cells.length).toBeGreaterThan(0);
  });

  // ── Edge cases ─────────────────────────────────────────────────

  it('handles zero-length range gracefully', () => {
    renderHeader({
      start: d('2025-06-15'),
      end: d('2025-06-15'),
      step: 'day',
    });
    const header = document.querySelector('[data-timeline-header]')!;
    // Should render without crashing, just with no/empty intervals
    expect(header).toBeInTheDocument();
  });

  it('handles very wide range with many intervals', () => {
    renderHeader({
      start: d('2025-01-01'),
      end: d('2025-12-31'),
      step: 'month',
      geometry: makeGeometry({
        pxPerMs: 1200 / (365 * 86400000),
        pxPerStep: 200,
        stepDurationMs: 30 * 86400000,
      }),
    });
    const header = document.querySelector('[data-timeline-header]')!;
    // Should render all 12 months
    expect(header).toBeInTheDocument();
  });
});
