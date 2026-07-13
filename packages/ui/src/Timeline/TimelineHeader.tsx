// ── Timeline — Time-axis header ─────────────────────────────────────
// Renders multi-tier date labels above the grid.

import React, { useMemo } from 'react';
import type { TimelineGeometry, TimelineStep, HighlightedDay } from './types';
import { generateTierIntervals, dateToX } from './utils';
import { HEADER_TIERS } from './constants';

export interface TimelineHeaderProps {
  geometry: TimelineGeometry;
  start: Date;
  end: Date;
  step: TimelineStep;
  /** Height of the full header in px. */
  height: number;
  /** Optional render prop for individual day cells. */
  renderDay?: (date: Date, step: TimelineStep) => React.ReactNode;
  /** Optional extra content rendered below each top-level interval. */
  renderDayContent?: (start: Date, end: Date) => React.ReactNode;
  /** Days to highlight with indicator dots in the day header cells. */
  highlightedDays?: HighlightedDay[];
}

// ── Module-level style constants ──────────────────────────────────

const TIER_ROW_HEIGHT = 24;

const HEADER_CONTAINER_STYLE: React.CSSProperties = {
  overflow: 'hidden',
  flexShrink: 0,
  backgroundColor: '#fafafa',
  borderBottom: '2px solid #d0d0d0',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const TIER_ROW_STYLE: React.CSSProperties = {
  display: 'flex',
  position: 'relative',
  borderBottom: '1px solid #e0e0e0',
};

const INTERVAL_CELL_STYLE: React.CSSProperties = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid #e8e8e8',
  overflow: 'hidden',
  height: '100%',
};

export const TimelineHeader: React.FC<TimelineHeaderProps> = React.memo(
  function TimelineHeader({
    geometry,
    start,
    end,
    step,
    height,
    renderDay,
    renderDayContent,
    highlightedDays,
  }) {
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

    /** Default dot colours for highlighted day types. */
    const HIGHLIGHT_DOT_COLORS: Record<string, string> = {
      holiday: '#ea4335',
      important: '#f9ab00',
    };

    const tiers = useMemo(() => HEADER_TIERS[step], [step]);

    const tierRows = useMemo(() => {
      // Adapt day format based on available pixel width per interval
      const pxPerDay = geometry.pxPerMs * 86400000;

      return tiers.map((tier, tierIndex) => {
        const intervals = generateTierIntervals(start, end, tier);
        const rowHeight = Math.min(
          TIER_ROW_HEIGHT,
          (height - 4) / tiers.length,
        );
        const fontSize = 14 - tierIndex * 2;

        // Shrink or drop the day tier when zoomed out
        if (tier.unit === 'day' && pxPerDay < 14) {
          // Too narrow — drop the day tier entirely, months suffice
          return null;
        }

        return (
          <div
            key={tier.unit}
            style={{
              ...TIER_ROW_STYLE,
              height: `${rowHeight}px`,
            }}
          >
            {intervals.map((interval, i) => {
              const left = dateToX(interval.start, start, geometry.pxPerMs);
              const right = dateToX(interval.end, start, geometry.pxPerMs);
              const width = Math.max(0, right - left);

              // Tighter format for narrow columns
              let label = interval.label;
              if (tier.unit === 'day' && pxPerDay < 30) {
                // Show only the day number: "31" instead of "Mon 31"
                label = interval.start.getDate().toString();
              }

              return (
                <div
                  key={i}
                  style={{
                    ...INTERVAL_CELL_STYLE,
                    left: `${left}px`,
                    width: `${width}px`,
                  }}
                >
                  <span
                    style={{
                      fontSize: `${fontSize}px`,
                      fontWeight: tierIndex === 0 ? 600 : 400,
                      color: '#555',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      padding: '0 2px',
                    }}
                  >
                    {label}
                  </span>
                  {/* Highlighted day indicator dot (only on day-tier cells) */}
                  {tier.unit === 'day' && highlightMap && (() => {
                    const key = `${interval.start.getFullYear()}-${String(interval.start.getMonth() + 1).padStart(2, '0')}-${String(interval.start.getDate()).padStart(2, '0')}`;
                    const hd = highlightMap.get(key);
                    if (!hd) return null;
                    const dotColor = hd.color ?? HIGHLIGHT_DOT_COLORS[hd.type ?? ''] ?? HIGHLIGHT_DOT_COLORS.important;
                    return (
                      <div
                        title={hd.label}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: dotColor,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      />
                    );
                  })()}
                  {tierIndex === tiers.length - 1 && renderDay && (
                    <div style={{ fontSize: '10px', color: '#999' }}>
                      {renderDay(interval.start, tier.unit)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }).filter(Boolean); // remove null entries from dropped tiers
    }, [tiers, start, end, geometry.pxPerMs, height, renderDay, highlightMap]);

    return (
      <div
        data-timeline-header
        style={{
          ...HEADER_CONTAINER_STYLE,
          height: `${height}px`,
        }}
      >
        {tierRows}
        {/* Day content row (for day status / day info equivalents) */}
        {renderDayContent && (
          <div
            style={{
              position: 'relative',
              height: '100%',
              flex: 1,
            }}
          >
            {/* This would need per-day rendering; simplified for now */}
          </div>
        )}
      </div>
    );
  },
);

export default TimelineHeader;
