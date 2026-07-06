// ── TimelineLink stories — Dependency arrows ────────────────────────
import type { Meta, StoryObj } from '@storybook/react';
import { TimelineLinks } from '../TimelineLink';
import type { TimelineLinksProps } from '../TimelineLink';
import type { BarLayout } from '../useTimeline';
import { d } from '../__stories__/mockData';

const meta: Meta<typeof TimelineLinks> = {
  title: 'Timeline / TimelineLinks',
  component: TimelineLinks,
  tags: ['autodocs'],
  argTypes: {
    onSelectLink: { action: 'selectLink' },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineLinks>;

// ── Sample bar layouts ─────────────────────────────────────────────

const barLayouts: BarLayout[] = [
  { itemId: 'a', left: 60, top: 11, width: 180, height: 30 },
  { itemId: 'b', left: 320, top: 45, width: 200, height: 30 },
  { itemId: 'c', left: 600, top: 11, width: 160, height: 30 },
  { itemId: 'd', left: 100, top: 79, width: 140, height: 30 },
  { itemId: 'e', left: 300, top: 79, width: 120, height: 30 },
];

// ── Stories ─────────────────────────────────────────────────────────

export const SingleLink: Story = {
  name: 'Single dependency',
  args: {
    links: [{ id: 'l1', source: 'a', target: 'b' }],
    barLayouts: barLayouts.slice(0, 2),
    areaWidth: 920,
    areaHeight: 136,
    sidebarWidth: 0,
    selectedLinkIds: [],
  },
};

export const MultipleLinks: Story = {
  name: 'Multiple dependencies',
  args: {
    links: [
      { id: 'l1', source: 'a', target: 'b' },
      { id: 'l2', source: 'a', target: 'c' },
      { id: 'l3', source: 'b', target: 'c' },
      { id: 'l4', source: 'd', target: 'e' },
    ],
    barLayouts,
    areaWidth: 920,
    areaHeight: 136,
    sidebarWidth: 0,
    selectedLinkIds: [],
  },
};

export const SelectedLink: Story = {
  name: 'Selected link',
  args: {
    ...MultipleLinks.args,
    selectedLinkIds: ['l2'],
  },
};

export const CustomColor: Story = {
  name: 'Custom link color',
  args: {
    links: [
      { id: 'l1', source: 'a', target: 'b', color: '#ea4335' },
      { id: 'l2', source: 'b', target: 'c', color: '#34a853' },
    ],
    barLayouts: barLayouts.slice(0, 3),
    areaWidth: 920,
    areaHeight: 136,
    sidebarWidth: 0,
    selectedLinkIds: [],
  },
};

export const WithSidebarOffset: Story = {
  name: 'With sidebar offset',
  args: {
    ...MultipleLinks.args,
    sidebarWidth: 180,
  },
};

export const Empty: Story = {
  name: 'No links',
  args: {
    links: [],
    barLayouts: [],
    areaWidth: 920,
    areaHeight: 200,
    sidebarWidth: 0,
    selectedLinkIds: [],
  },
};
