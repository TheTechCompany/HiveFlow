// ── Timeline — Grid lines ───────────────────────────────────────────
// Renders vertical dividers and a "today" marker over the timeline area.

import React, { useMemo } from 'react';
import type { TimelineGeometry, TimelineStep, HighlightedDay } from './types';
import { generateTierIntervals, dateToX } from './utils';
import { HEADER_TIERS } from './constants';

export interface TimelineGridProps {
  geometry: TimelineGeometry;
  start: Date;
  end: Date;
  step: TimelineStep;
  totalHeight: number;
  showToday?: boolean;
  /** Left offset to skip sidebar area. */
  sidebarWidth?: number;
  /** Days to highlight with coloured strips. */
  highlightedDays?: HighlightedDay[];
}

// ── Module-level style constants ──────────────────────────────────

const GRID_CONTAINER_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  zIndex: -1,
};

const GRID_LINE_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  width: '1px',
  backgroundColor: '#d8d8d8',
  pointerEvents: 'none',
};

const TODAY_LINE_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  width: '2px',
  backgroundColor: '#ea4335',
  zIndex: 8,
  pointerEvents: 'none',
};

const WEEKEND_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  backgroundColor: 'rgba(0,0,0,0.06)',
  pointerEvents: 'none',
};

/** Default background colours for highlighted day types. */
const HIGHLIGHT_COLORS: Record<string, string> = {
  holiday: 'rgba(234, 67, 53, 0.08)',
  important: 'rgba(251, 188, 4, 0.10)',
};

const HIGHLIGHT_STRIP_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  pointerEvents: 'auto',
};

// ── Component ───────────────────────────────────────────────────────

export const TimelineGrid: React.FC<TimelineGridProps> = React.memo(
  function TimelineGrid({
    geometry,
    start,
    end,
    step,
    totalHeight,
    showToday = true,
    sidebarWidth = 0,
    highlightedDays,
  }) {
    // Get the finest tier (last one) for grid lines
    const tiers = useMemo(() => HEADER_TIERS[step], [step]);
    const finestTier = tiers[tiers.length - 1];

    const gridLines = useMemo(() => {
      if (!finestTier) return null;
      const intervals = generateTierIntervals(start, end, finestTier);

      return intervals.map((interval, i) => {
        const x = dateToX(interval.start, start, geometry.pxPerMs);
        if (x < 0) return null;

        return (
          <div
            key={i}
            style={{
              ...GRID_LINE_STYLE,
              left: `${x}px`,
              height: `${totalHeight}px`,
            }}
          />
        );
      });
    }, [finestTier, start, end, geometry.pxPerMs, totalHeight]);

    // Today marker
    const todayLine = useMemo(() => {
      if (!showToday) return null;
      const now = new Date();
      if (now < start || now > end) return null;

      const x = dateToX(now, start, geometry.pxPerMs);

      return (
        <div
          data-today-line
          style={{
            ...TODAY_LINE_STYLE,
            left: `${x}px`,
            height: `${totalHeight}px`,
          }}
        />
      );
    }, [showToday, start, end, geometry.pxPerMs, totalHeight]);

    // ── Highlighted days lookup (keyed by ISO date string) ───────
    const highlightMap = useMemo(() => {
      if (!highlightedDays || highlightedDays.length === 0) return null;
      const map = new Map<string, HighlightedDay>();
      for (const h of highlightedDays) {
        const key = `${h.date.getFullYear()}-${String(h.date.getMonth() + 1).padStart(2, '0')}-${String(h.date.getDate()).padStart(2, '0')}`;
        map.set(key, h);
      }
      return map;
    }, [highlightedDays]);

    // Highlighted day strips (for hour/day/week steps)
    const highlightedStrips = useMemo(() => {
      if (!highlightMap || (step !== 'hour' && step !== 'day' && step !== 'week')) return null;
      const dayTier = { unit: 'day' as TimelineStep, format: 'ddd' };
      const intervals = generateTierIntervals(start, end, dayTier);

      return intervals
        .map((iv) => {
          const key = `${iv.start.getFullYear()}-${String(iv.start.getMonth() + 1).padStart(2, '0')}-${String(iv.start.getDate()).padStart(2, '0')}`;
          const hd = highlightMap.get(key);
          if (!hd) return null;

          const x = dateToX(iv.start, start, geometry.pxPerMs);
          const w = dateToX(iv.end, start, geometry.pxPerMs) - x;
          const bgColor = hd.color ?? HIGHLIGHT_COLORS[hd.type ?? ''] ?? HIGHLIGHT_COLORS.important;

          return (
            <div
              key={`hl-${key}`}
              title={hd.label}
              style={{
                ...HIGHLIGHT_STRIP_STYLE,
                left: `${x}px`,
                width: `${Math.max(0, w)}px`,
                height: `${totalHeight}px`,
                backgroundColor: bgColor,
              }}
            />
          );
        })
        .filter(Boolean);
    }, [highlightMap, step, start, end, geometry.pxPerMs, totalHeight]);

    // Weekend shading (for hour/day/week steps — not month/year where days are too narrow)
    const weekendShading = useMemo(() => {
      if (step === 'month' || step === 'year') return null;
      const dayTier = { unit: 'day' as TimelineStep, format: 'ddd' };
      const intervals = generateTierIntervals(start, end, dayTier);

      return intervals
        .filter((iv) => {
          const day = iv.start.getDay();
          return day === 0 || day === 6;
        })
        .map((iv, i) => {
          const x = dateToX(iv.start, start, geometry.pxPerMs);
          const w = dateToX(iv.end, start, geometry.pxPerMs) - x;
          return (
            <div
              key={`we-${i}`}
              style={{
                ...WEEKEND_STYLE,
                left: `${x}px`,
                width: `${Math.max(0, w)}px`,
                height: `${totalHeight}px`,
              }}
            />
          );
        });
    }, [step, start, end, geometry.pxPerMs, totalHeight]);

    return (
      <div
        data-timeline-grid
        style={{
          ...GRID_CONTAINER_STYLE,
          left: `${sidebarWidth}px`,
        }}
      >
        {weekendShading}
        {highlightedStrips}
        {gridLines}
        {todayLine}
      </div>
    );
  },
);

export default TimelineGrid;
