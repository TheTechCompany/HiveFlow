// ── Timeline stories — Mock data helpers ────────────────────────────
// Shared factory functions so every story can build realistic
// TimelineItem[], TimelineGroup[], and TimelineLink[] arrays quickly.

import type {
  TimelineItem,
  TimelineGroup,
  TimelineLink,
  TimelineGeometry,
} from '../types';

// ── Dates ──────────────────────────────────────────────────────────

/** Convenience: date from year/month/day. Month is 1-based. */
export function d(y: number, m: number, day: number, h = 0): Date {
  return new Date(y, m - 1, day, h);
}

// ── Items ──────────────────────────────────────────────────────────

let _itemSeq = 0;
export function resetItemSeq(s = 0): void { _itemSeq = s; }

export interface MakeItemOpts {
  id?: string;
  start?: Date;
  end?: Date;
  label?: string;
  color?: string;
  groupId?: string;
  progress?: number;
  resizable?: boolean;
  movable?: boolean;
  selectable?: boolean;
  hoverInfo?: string;
  height?: number;
}

export function makeItem(opts: MakeItemOpts = {}): TimelineItem {
  _itemSeq += 1;
  const id = opts.id ?? `item-${_itemSeq}`;
  const start = opts.start ?? d(2026, 6, 1 + _itemSeq);
  const end = opts.end ?? d(2026, 6, 6 + _itemSeq);
  return {
    id,
    start,
    end,
    label: opts.label ?? `Task ${_itemSeq}`,
    color: opts.color,
    groupId: opts.groupId,
    progress: opts.progress,
    resizable: opts.resizable,
    movable: opts.movable,
    selectable: opts.selectable,
    hoverInfo: opts.hoverInfo,
    height: opts.height,
  };
}

export function makeItems(count: number, overrides: Partial<MakeItemOpts> = {}): TimelineItem[] {
  return Array.from({ length: count }, (_, i) =>
    makeItem({
      ...overrides,
      id: overrides.id ? `${overrides.id}-${i}` : undefined,
      label: overrides.label ? `${overrides.label} ${i + 1}` : undefined,
      start: overrides.start
        ? new Date(overrides.start.getTime() + i * 86400000 * 2)
        : undefined,
      end: overrides.end
        ? new Date(overrides.end.getTime() + i * 86400000 * 2)
        : undefined,
    }),
  );
}

// ── Groups ─────────────────────────────────────────────────────────

export interface MakeGroupOpts {
  id?: string;
  label?: string;
  itemCount?: number;
}

let _groupSeq = 0;
export function resetGroupSeq(s = 0): void { _groupSeq = s; }

export function makeGroup(opts: MakeGroupOpts = {}): TimelineGroup {
  _groupSeq += 1;
  const id = opts.id ?? `group-${_groupSeq}`;
  const count = opts.itemCount ?? 2;
  const items = makeItems(count, { groupId: id, label: `${opts.label ?? 'Group'} Task` });
  return {
    id,
    label: opts.label ?? `Group ${_groupSeq}`,
    items,
  };
}

export function makeGroups(count: number): TimelineGroup[] {
  return Array.from({ length: count }, () => makeGroup());
}

// ── Links ──────────────────────────────────────────────────────────

let _linkSeq = 0;
export function resetLinkSeq(s = 0): void { _linkSeq = s; }

export function makeLink(source: string, target: string, color?: string): TimelineLink {
  _linkSeq += 1;
  return { id: `link-${_linkSeq}`, source, target, color };
}

export function makeLinks(pairs: [string, string][]): TimelineLink[] {
  return pairs.map(([s, t]) => makeLink(s, t));
}

// ── Geometry ───────────────────────────────────────────────────────

export function makeGeometry(overrides: Partial<TimelineGeometry> = {}): TimelineGeometry {
  return {
    viewportWidth: 1100,
    viewportHeight: 500,
    sidebarWidth: 180,
    timelineWidth: 920,
    pxPerMs: 0.00005,
    pxPerStep: 80,
    stepDurationMs: 86400000,
    ...overrides,
  };
}

// ── Pre-built kits ─────────────────────────────────────────────────

/** A realistic 3-group, 6-item dataset for the full Timeline. */
export function demoKit() {
  resetItemSeq(0);
  resetGroupSeq(0);
  resetLinkSeq(0);

  const items: TimelineItem[] = [
    makeItem({ id: 't1', label: 'Design', start: d(2026, 6, 1), end: d(2026, 6, 5), color: '#4a90d9', progress: 100, groupId: 'g1' }),
    makeItem({ id: 't2', label: 'Development', start: d(2026, 6, 5), end: d(2026, 6, 12), color: '#7b61ff', progress: 60, groupId: 'g1' }),
    makeItem({ id: 't3', label: 'Testing', start: d(2026, 6, 2), end: d(2026, 6, 8), color: '#e06c75', progress: 30, groupId: 'g2' }),
    makeItem({ id: 't4', label: 'Deployment', start: d(2026, 6, 10), end: d(2026, 6, 15), color: '#56b6c2', progress: 0, groupId: 'g2' }),
    makeItem({ id: 't5', label: 'Documentation', start: d(2026, 6, 3), end: d(2026, 6, 9), color: '#e5c07b', progress: 80, groupId: 'g3' }),
    makeItem({ id: 't6', label: 'Review', start: d(2026, 6, 12), end: d(2026, 6, 18), color: '#98c379', progress: 0, groupId: 'g3' }),
  ];

  const groups: TimelineGroup[] = [
    { id: 'g1', label: 'Engineering', items: items.filter(i => i.groupId === 'g1') },
    { id: 'g2', label: 'QA', items: items.filter(i => i.groupId === 'g2') },
    { id: 'g3', label: 'Docs', items: items.filter(i => i.groupId === 'g3') },
  ];

  const links: TimelineLink[] = [
    makeLink('t1', 't2', '#999'),
    makeLink('t2', 't4', '#999'),
    makeLink('t3', 't4', '#999'),
    makeLink('t5', 't6', '#999'),
  ];

  return { items, groups, links };
}

/** Viewport date range for the demo kit. */
export function demoRange() {
  return {
    start: d(2026, 6, 1),
    end: d(2026, 6, 20),
  };
}
