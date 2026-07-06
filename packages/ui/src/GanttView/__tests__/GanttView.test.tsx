// ── GanttView — Tests ────────────────────────────────────────────────

import React from 'react';
import { render, screen } from '@testing-library/react';
import { GanttView } from '../GanttView';
import type { TimelineItem, TimelineGroup } from '../../Timeline';

// ── Mocks ────────────────────────────────────────────────────────────

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(window as any).ResizeObserver = MockResizeObserver;

// ── Helpers ──────────────────────────────────────────────────────────

function d(y: number, m: number, day: number): Date {
  return new Date(y, m - 1, day);
}

function makeItem(overrides: Partial<TimelineItem> = {}): TimelineItem {
  return {
    id: 'item-1',
    start: d(2025, 6, 10),
    end: d(2025, 6, 15),
    label: 'Test Item',
    color: '#4caf50',
    ...overrides,
  };
}

function makeGroup(overrides: Partial<TimelineGroup> = {}): TimelineGroup {
  return {
    id: 'g1',
    label: 'Phase 1',
    ...overrides,
  };
}

const defaultProps = {
  items: [makeItem()],
  groups: [makeGroup()],
  start: d(2025, 6, 1),
  end: d(2025, 7, 31),
  step: 'day' as const,
  fitContainer: true,
};

// ── Tests ────────────────────────────────────────────────────────────

describe('GanttView', () => {
  it('renders without crashing', () => {
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView {...defaultProps} />
      </div>,
    );
    // Should render without errors
    expect(document.body).toBeTruthy();
  });

  it('renders with sidebarWidth=0 (gantt-only mode)', () => {
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView {...defaultProps} sidebarWidth={0} />
      </div>,
    );
    expect(document.body).toBeTruthy();
  });

  it('renders with a large sidebarWidth (list-only mode)', () => {
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView {...defaultProps} sidebarWidth={9999} />
      </div>,
    );
    expect(document.body).toBeTruthy();
  });

  it('renders contextMenu when provided', () => {
    const menu = <div data-testid="ctx-menu">Context Menu</div>;
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView {...defaultProps} contextMenu={menu} />
      </div>,
    );
    expect(screen.getByTestId('ctx-menu')).toBeInTheDocument();
    expect(screen.getByTestId('ctx-menu')).toHaveTextContent('Context Menu');
  });

  it('renders without contextMenu', () => {
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView {...defaultProps} />
      </div>,
    );
    // Should render fine without a context menu
    expect(document.body).toBeTruthy();
  });

  it('renders in loading state', () => {
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView {...defaultProps} loading={true} />
      </div>,
    );
    expect(document.body).toBeTruthy();
  });

  it('renders with no items', () => {
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView {...defaultProps} items={[]} groups={[]} />
      </div>,
    );
    expect(document.body).toBeTruthy();
  });

  it('renders with custom renderers', () => {
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView
          {...defaultProps}
          renderers={{
            renderSidebarHeader: () => <div data-testid="custom-header">Header</div>,
            renderItem: (item) => <span data-testid="custom-item">{item.label}</span>,
          }}
        />
      </div>,
    );
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
  });

  it('renders with a sidebar node', () => {
    const sidebar = <div data-testid="the-sidebar">My Sidebar</div>;
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView {...defaultProps} sidebar={sidebar} />
      </div>,
    );
    expect(screen.getByTestId('the-sidebar')).toBeInTheDocument();
  });

  it('renders sidebar + contextMenu together', () => {
    const sidebar = <div data-testid="the-sidebar">Sidebar</div>;
    const menu = <div data-testid="ctx-menu">Menu</div>;
    render(
      <div style={{ width: 800, height: 400 }}>
        <GanttView {...defaultProps} sidebar={sidebar} contextMenu={menu} />
      </div>,
    );
    expect(screen.getByTestId('the-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('ctx-menu')).toBeInTheDocument();
  });
});
