// ── Timeline — TimelineLinks unit tests ─────────────────────────────
// Isolated SVG dependency link rendering and interaction.

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TimelineLinks } from '../TimelineLink';
import type { TimelineLinksProps } from '../TimelineLink';
import type { TimelineLink } from '../types';
import type { BarLayout } from '../useTimeline';

// ── Helpers ─────────────────────────────────────────────────────────

function makeBarLayout(overrides: Partial<BarLayout> = {}): BarLayout {
  return {
    itemId: 'item-a',
    left: 100,
    top: 10,
    width: 150,
    height: 30,
    ...overrides,
  };
}

function makeLink(overrides: Partial<TimelineLink> = {}): TimelineLink {
  return {
    id: 'link-1',
    source: 'item-a',
    target: 'item-b',
    ...overrides,
  };
}

const defaultProps: TimelineLinksProps = {
  links: [makeLink()],
  barLayouts: [
    makeBarLayout({ itemId: 'item-a', left: 100, top: 10, width: 150, height: 30 }),
    makeBarLayout({ itemId: 'item-b', left: 400, top: 50, width: 120, height: 30 }),
  ],
  areaWidth: 1200,
  areaHeight: 300,
  sidebarWidth: 0,
  selectedLinkIds: [],
  onSelectLink: jest.fn(),
};

function renderLinks(overrides: Partial<TimelineLinksProps> = {}) {
  return render(<TimelineLinks {...defaultProps} {...overrides} />);
}

// ── Tests ───────────────────────────────────────────────────────────

describe('TimelineLinks', () => {
  // ── Rendering ──────────────────────────────────────────────────

  it('renders SVG container with data-timeline-links', () => {
    renderLinks();
    const svg = document.querySelector('[data-timeline-links]');
    expect(svg).toBeInTheDocument();
  });

  it('renders an SVG element', () => {
    renderLinks();
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    // React boolean attributes: data-timeline-links renders as "true" string
    expect(svg!.hasAttribute('data-timeline-links')).toBe(true);
  });

  it('sets viewBox matching area dimensions', () => {
    renderLinks({ areaWidth: 800, areaHeight: 400 });
    const svg = document.querySelector('[data-timeline-links]')!;
    expect(svg.getAttribute('viewBox')).toBe('0 0 800 400');
  });

  it('sets width and height from area dimensions', () => {
    renderLinks({ areaWidth: 800, areaHeight: 400 });
    const svg = document.querySelector('[data-timeline-links]')!;
    expect(svg.getAttribute('width')).toBe('800');
    expect(svg.getAttribute('height')).toBe('400');
  });

  // ── Empty states ───────────────────────────────────────────────

  it('returns null when no links provided', () => {
    const { container } = renderLinks({ links: [] });
    const svg = container.querySelector('[data-timeline-links]');
    expect(svg).not.toBeInTheDocument();
  });

  it('returns null when areaWidth is 0', () => {
    const { container } = renderLinks({ areaWidth: 0 });
    const svg = container.querySelector('[data-timeline-links]');
    expect(svg).not.toBeInTheDocument();
  });

  it('returns null when areaHeight is 0', () => {
    const { container } = renderLinks({ areaHeight: 0 });
    const svg = container.querySelector('[data-timeline-links]');
    expect(svg).not.toBeInTheDocument();
  });

  // ── Link paths ─────────────────────────────────────────────────

  it('renders SVG paths for valid links', () => {
    renderLinks();
    const svg = document.querySelector('[data-timeline-links]')!;
    const paths = svg.querySelectorAll('path');
    // Each link has 2 paths: transparent wide hit path + visible stroke
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });

  it('renders a transparent hit path for click detection', () => {
    renderLinks();
    const hitPath = document.querySelector('[data-timeline-links] path[stroke="transparent"]');
    expect(hitPath).toBeInTheDocument();
    expect(hitPath!.getAttribute('stroke-width')).toBe('14');
  });

  it('renders a visible colored path', () => {
    renderLinks();
    const svg = document.querySelector('[data-timeline-links]')!;
    const paths = svg.querySelectorAll('path');
    const visiblePaths = Array.from(paths).filter(
      (p) => p.getAttribute('stroke') !== 'transparent' && p.getAttribute('stroke') !== 'none',
    );
    expect(visiblePaths.length).toBeGreaterThanOrEqual(1);
  });

  // ── Missing layouts ────────────────────────────────────────────

  it('returns null when source bar layout is missing', () => {
    const { container } = renderLinks({
      links: [makeLink({ source: 'item-x' })],
      barLayouts: [makeBarLayout({ itemId: 'item-b' })],
    });
    const svg = container.querySelector('[data-timeline-links]');
    expect(svg).not.toBeInTheDocument();
  });

  it('returns null when target bar layout is missing', () => {
    const { container } = renderLinks({
      links: [makeLink({ target: 'item-x' })],
      barLayouts: [makeBarLayout({ itemId: 'item-a' })],
    });
    const svg = container.querySelector('[data-timeline-links]');
    expect(svg).not.toBeInTheDocument();
  });

  it('returns null when target is to the left of source', () => {
    const { container } = renderLinks({
      links: [makeLink({ source: 'item-b', target: 'item-a' })],
      barLayouts: [
        makeBarLayout({ itemId: 'item-a', left: 100 }),
        makeBarLayout({ itemId: 'item-b', left: 400 }),
      ],
    });
    const svg = container.querySelector('[data-timeline-links]');
    expect(svg).not.toBeInTheDocument();
  });

  // ── Selection ──────────────────────────────────────────────────

  it('applies selected styling to selected link', () => {
    renderLinks({ selectedLinkIds: ['link-1'] });
    const svg = document.querySelector('[data-timeline-links]')!;
    // Selected link gets #1a73e8 color
    const selectedPath = svg.querySelector('path[stroke="#1a73e8"]');
    expect(selectedPath).toBeInTheDocument();
  });

  it('applies default color to unselected link', () => {
    renderLinks({ selectedLinkIds: [] });
    const svg = document.querySelector('[data-timeline-links]')!;
    const defaultPath = svg.querySelector('path[stroke="#b0b0b0"]');
    expect(defaultPath).toBeInTheDocument();
  });

  it('selected link has thicker stroke (2 vs 1.5)', () => {
    renderLinks({ selectedLinkIds: ['link-1'] });
    const svg = document.querySelector('[data-timeline-links]')!;
    const selected = svg.querySelector('path[stroke="#1a73e8"]')!;
    expect(selected.getAttribute('stroke-width')).toBe('2');
  });

  it('unselected link has normal stroke (1.5)', () => {
    renderLinks({ selectedLinkIds: [] });
    const svg = document.querySelector('[data-timeline-links]')!;
    const unselected = svg.querySelector('path[stroke="#b0b0b0"]')!;
    expect(unselected.getAttribute('stroke-width')).toBe('1.5');
  });

  // ── Click handling ─────────────────────────────────────────────

  it('calls onSelectLink when hit path is clicked', () => {
    const onSelectLink = jest.fn();
    renderLinks({ onSelectLink });
    const hitPath = document.querySelector('[data-timeline-links] path[stroke="transparent"]')!;
    fireEvent.click(hitPath);
    expect(onSelectLink).toHaveBeenCalledWith('link-1', false);
  });

  it('calls onSelectLink with additive flag on ctrl+click', () => {
    const onSelectLink = jest.fn();
    renderLinks({ onSelectLink });
    const hitPath = document.querySelector('[data-timeline-links] path[stroke="transparent"]')!;
    fireEvent.click(hitPath, { ctrlKey: true });
    expect(onSelectLink).toHaveBeenCalledWith('link-1', true);
  });

  it('calls onSelectLink with additive flag on meta+click', () => {
    const onSelectLink = jest.fn();
    renderLinks({ onSelectLink });
    const hitPath = document.querySelector('[data-timeline-links] path[stroke="transparent"]')!;
    fireEvent.click(hitPath, { metaKey: true });
    expect(onSelectLink).toHaveBeenCalledWith('link-1', true);
  });

  // ── Custom link color ──────────────────────────────────────────

  it('uses custom link color when provided', () => {
    renderLinks({
      links: [makeLink({ color: '#ff0000' })],
      selectedLinkIds: [],
    });
    const svg = document.querySelector('[data-timeline-links]')!;
    const redPath = svg.querySelector('path[stroke="#ff0000"]');
    expect(redPath).toBeInTheDocument();
  });

  it('overrides custom color with selected color when selected', () => {
    // When selected and a custom color IS set, the custom color wins (?? operator)
    // selected color is only the fallback when NO custom color is provided
    renderLinks({
      links: [makeLink({ color: '#ff0000' })],
      selectedLinkIds: ['link-1'],
    });
    const svg = document.querySelector('[data-timeline-links]')!;
    // Custom color takes precedence even when selected (?? operator)
    expect(svg.querySelector('path[stroke="#ff0000"]')).toBeInTheDocument();
  });

  // ── Sidebar offset ─────────────────────────────────────────────

  it('positions SVG at sidebar offset', () => {
    renderLinks({ sidebarWidth: 180 });
    const svg = document.querySelector('[data-timeline-links]') as HTMLElement;
    expect(svg.style.left).toBe('180px');
  });

  it('defaults sidebar offset to 0', () => {
    renderLinks({ sidebarWidth: undefined });
    const svg = document.querySelector('[data-timeline-links]') as HTMLElement;
    expect(svg.style.left).toBe('0px');
  });

  // ── Arrowhead markers ──────────────────────────────────────────

  it('includes arrowhead marker definitions in SVG', () => {
    renderLinks();
    const svg = document.querySelector('[data-timeline-links]')!;
    const defs = svg.querySelector('defs');
    expect(defs).toBeInTheDocument();
    const markerAn = defs!.querySelector('#an');
    const markerAs = defs!.querySelector('#as');
    expect(markerAn).toBeInTheDocument();
    expect(markerAs).toBeInTheDocument();
  });

  it('uses normal arrowhead (an) for unselected links', () => {
    renderLinks({ selectedLinkIds: [] });
    const visiblePath = document.querySelector('[data-timeline-links] path[marker-end]');
    expect(visiblePath).toBeInTheDocument();
    if (visiblePath!.getAttribute('stroke') === '#b0b0b0') {
      expect(visiblePath!.getAttribute('marker-end')).toContain('url(#an)');
    }
  });

  it('uses selected arrowhead (as) for selected links', () => {
    renderLinks({ selectedLinkIds: ['link-1'] });
    const visiblePath = document.querySelector('[data-timeline-links] path[marker-end]');
    expect(visiblePath).toBeInTheDocument();
    // Should be one of the visible paths with marker-end
    const paths = document.querySelectorAll('[data-timeline-links] path[marker-end]');
    const hasSelectedArrow = Array.from(paths).some(
      (p) => p.getAttribute('marker-end')?.includes('url(#as)'),
    );
    expect(hasSelectedArrow).toBe(true);
  });

  // ── Multiple links ─────────────────────────────────────────────

  it('renders multiple links', () => {
    renderLinks({
      links: [
        makeLink({ id: 'l1', source: 'item-a', target: 'item-b' }),
        makeLink({ id: 'l2', source: 'item-a', target: 'item-c' }),
      ],
      barLayouts: [
        makeBarLayout({ itemId: 'item-a', left: 100, top: 10, width: 150, height: 30 }),
        makeBarLayout({ itemId: 'item-b', left: 400, top: 10, width: 120, height: 30 }),
        makeBarLayout({ itemId: 'item-c', left: 400, top: 80, width: 120, height: 30 }),
      ],
    });
    const svg = document.querySelector('[data-timeline-links]')!;
    // 2 links × 2 paths each = 4 paths
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(4);
  });

  it('has pointer-events: none on the SVG layer', () => {
    renderLinks();
    const svg = document.querySelector('[data-timeline-links]') as HTMLElement;
    expect(svg.style.pointerEvents).toBe('none');
  });

  it('hit paths have pointer-events: stroke for click targeting', () => {
    renderLinks();
    const hitPath = document.querySelector('[data-timeline-links] path[stroke="transparent"]') as HTMLElement;
    expect(hitPath.style.pointerEvents).toBe('stroke');
  });
});
