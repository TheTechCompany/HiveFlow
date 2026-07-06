import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mui/material';
import { TreeBranch } from '../index';
import { TreeBranchVSCode, VSCODE_INDENT, type TreeVariant } from '../VSCode';

const ROW_H = 34;

/* ── Wrapper that simulates a tree row ──────────────────────────────── */
const RowWrapper: React.FC<{
    depth: number;
    hasChildren: boolean;
    isCollapsed: boolean;
    connectors: boolean[];
    label?: string;
}> = ({ depth, hasChildren, isCollapsed, connectors, label }) => {
    const [collapsed, setCollapsed] = React.useState(isCollapsed);
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: ROW_H,
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                bgcolor: '#fff',
            }}
        >
            <TreeBranch
                depth={depth}
                hasChildren={hasChildren}
                isCollapsed={collapsed}
                onToggle={() => setCollapsed((c) => !c)}
                connectors={connectors}
            />
            {/* Title area with indent spacer */}
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    borderRight: '1px solid',
                    borderColor: 'grey.200',
                    height: '100%',
                }}
            >
                {depth > 0 && (
                    <Box
                        sx={{
                            width: depth * 12,
                            flexShrink: 0,
                        }}
                    />
                )}
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                        px: 0.5,
                        fontSize: '0.78rem',
                    }}
                >
                    {label || `Depth ${depth}`}
                </Box>
            </Box>
            {/* Fixed columns for alignment demo */}
            <Box
                sx={{
                    width: 104,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: '1px solid',
                    borderColor: 'grey.200',
                    height: '100%',
                    fontSize: '0.7rem',
                    color: 'text.secondary',
                }}
            >
                Start
            </Box>
            <Box
                sx={{
                    width: 104,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRight: '1px solid',
                    borderColor: 'grey.200',
                    height: '100%',
                    fontSize: '0.7rem',
                    color: 'text.secondary',
                }}
            >
                End
            </Box>
            <Box
                sx={{
                    width: 54,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '0.7rem',
                    color: 'text.secondary',
                }}
            >
                Hrs
            </Box>
        </Box>
    );
};

/* ── Meta ──────────────────────────────────────────────────────────── */
const meta: Meta<typeof TreeBranch> = {
    title: 'Tree / TreeBranch',
    component: TreeBranch,
    tags: ['autodocs'],
    argTypes: {
        depth: { control: { type: 'number', min: 0, max: 5 } },
        hasChildren: { control: 'boolean' },
        isCollapsed: { control: 'boolean' },
    },
};
export default meta;
type Story = StoryObj<typeof TreeBranch>;

/* ── Stories ────────────────────────────────────────────────────────── */

export const Root: Story = {
    name: 'Root — depth 0, no children',
    args: {
        depth: 0,
        hasChildren: false,
        isCollapsed: false,
        onToggle: () => {},
        connectors: [false],
    },
    render: (args) => (
        <RowWrapper
            depth={args.depth}
            hasChildren={args.hasChildren}
            isCollapsed={args.isCollapsed}
            connectors={args.connectors}
            label="Root item"
        />
    ),
};

export const RootWithChildren: Story = {
    name: 'Root — depth 0, has children',
    args: {
        depth: 0,
        hasChildren: true,
        isCollapsed: false,
        onToggle: () => {},
        connectors: [true],
    },
    render: (args) => (
        <RowWrapper
            depth={args.depth}
            hasChildren={args.hasChildren}
            isCollapsed={args.isCollapsed}
            connectors={args.connectors}
            label="Parent item"
        />
    ),
};

export const Depth1: Story = {
    name: 'Depth 1 — first child',
    args: {
        depth: 1,
        hasChildren: false,
        isCollapsed: false,
        onToggle: () => {},
        connectors: [true, false],
    },
    render: (args) => (
        <RowWrapper
            depth={args.depth}
            hasChildren={args.hasChildren}
            isCollapsed={args.isCollapsed}
            connectors={args.connectors}
            label="Child item"
        />
    ),
};

export const Depth1WithChildren: Story = {
    name: 'Depth 1 — has children',
    args: {
        depth: 1,
        hasChildren: true,
        isCollapsed: false,
        onToggle: () => {},
        connectors: [true, true],
    },
    render: (args) => (
        <RowWrapper
            depth={args.depth}
            hasChildren={args.hasChildren}
            isCollapsed={args.isCollapsed}
            connectors={args.connectors}
            label="Parent child"
        />
    ),
};

export const Depth2LastSibling: Story = {
    name: 'Depth 2 — last sibling',
    args: {
        depth: 2,
        hasChildren: false,
        isCollapsed: false,
        onToggle: () => {},
        connectors: [true, false, false],
    },
    render: (args) => (
        <RowWrapper
            depth={args.depth}
            hasChildren={args.hasChildren}
            isCollapsed={args.isCollapsed}
            connectors={args.connectors}
            label="Last grandchild"
        />
    ),
};

export const Depth3MiddleSibling: Story = {
    name: 'Depth 3 — middle sibling',
    args: {
        depth: 3,
        hasChildren: true,
        isCollapsed: false,
        onToggle: () => {},
        connectors: [true, true, true, true],
    },
    render: (args) => (
        <RowWrapper
            depth={args.depth}
            hasChildren={args.hasChildren}
            isCollapsed={args.isCollapsed}
            connectors={args.connectors}
            label="Deep nested item"
        />
    ),
};

export const FullTree: Story = {
    name: 'Full tree — multiple rows',
    render: () => {
        const rows: {
            depth: number;
            hasChildren: boolean;
            connectors: boolean[];
            label: string;
        }[] = [
            { depth: 0, hasChildren: true,  connectors: [true],                          label: 'Project Alpha' },
            { depth: 1, hasChildren: true,  connectors: [true, true],                     label: 'Phase 1' },
            { depth: 2, hasChildren: false, connectors: [true, true, true],               label: 'Task A' },
            { depth: 2, hasChildren: true,  connectors: [true, true, false],              label: 'Task B' },
            { depth: 3, hasChildren: false, connectors: [true, true, false, false],       label: 'Subtask B.1' },
            { depth: 1, hasChildren: false, connectors: [true, false],                    label: 'Phase 2' },
            { depth: 0, hasChildren: false, connectors: [false],                          label: 'Project Beta' },
        ];
        return (
            <Box sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 1, overflow: 'hidden' }}>
                {rows.map((row, i) => (
                    <RowWrapper key={i} {...row} />
                ))}
            </Box>
        );
    },
};

// ═══════════════════════════════════════════════════════════════════════
// TreeBranchVSCode — variant showcase
// ═══════════════════════════════════════════════════════════════════════

const VSCodeRowWrapper: React.FC<{
    depth: number;
    hasChildren: boolean;
    isCollapsed: boolean;
    connectors: boolean[];
    variant?: TreeVariant;
    label?: string;
}> = ({ depth, hasChildren, isCollapsed, connectors, variant, label }) => {
    const [collapsed, setCollapsed] = React.useState(isCollapsed);
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: ROW_H,
                borderBottom: '1px solid',
                borderColor: 'grey.200',
                bgcolor: '#fff',
            }}
        >
            <TreeBranchVSCode
                depth={depth}
                hasChildren={hasChildren}
                isCollapsed={collapsed}
                onToggle={() => setCollapsed((c) => !c)}
                connectors={connectors}
                variant={variant}
            />
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', borderRight: '1px solid', borderColor: 'grey.200', height: '100%' }}>
                {depth > 0 && <Box sx={{ width: depth * VSCODE_INDENT, flexShrink: 0 }} />}
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', px: 0.5, fontSize: '0.78rem' }}>
                    {label || `Depth ${depth}`}
                </Box>
            </Box>
            <Box sx={{ width: 104, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid', borderColor: 'grey.200', height: '100%', fontSize: '0.7rem', color: 'text.secondary' }}>Start</Box>
            <Box sx={{ width: 104, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid', borderColor: 'grey.200', height: '100%', fontSize: '0.7rem', color: 'text.secondary' }}>End</Box>
            <Box sx={{ width: 54, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '0.7rem', color: 'text.secondary' }}>Hrs</Box>
        </Box>
    );
};

const TREE_DATA: {
    depth: number;
    hasChildren: boolean;
    connectors: boolean[];
    label: string;
}[] = [
    { depth: 0, hasChildren: true,  connectors: [true],                     label: 'src/' },
    { depth: 1, hasChildren: true,  connectors: [true, true],                label: 'components/' },
    { depth: 2, hasChildren: false, connectors: [true, true, true],          label: 'Button.tsx' },
    { depth: 2, hasChildren: true,  connectors: [true, true, false],         label: 'Modal/' },
    { depth: 3, hasChildren: false, connectors: [true, true, false, false],  label: 'index.tsx' },
    { depth: 3, hasChildren: false, connectors: [true, true, false, false],  label: 'styles.ts' },
    { depth: 1, hasChildren: false, connectors: [true, false],               label: 'utils.ts' },
    { depth: 0, hasChildren: false, connectors: [false],                     label: 'package.json' },
];

const VARIANT_LABELS: Record<TreeVariant, string> = {
    'solid-connectors': 'Solid Connectors',
    'indent-guides': 'Indent Guides',
    'depth-borders': 'Depth Borders',
    'minimal': 'Minimal',
};

export const AllVariants: StoryObj = {
    name: 'All 4 variants',
    render: () => {
        const variants: TreeVariant[] = [
            'solid-connectors',
            'indent-guides',
            'depth-borders',
            'minimal',
        ];
        return (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, p: 2, bgcolor: '#f5f5f5' }}>
                {variants.map((v) => (
                    <Box key={v} sx={{ bgcolor: '#fff', borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'grey.300' }}>
                        <Box sx={{
                            px: 1.5, py: 1, fontWeight: 700, fontSize: '0.8rem',
                            color: 'text.secondary', borderBottom: '1px solid',
                            borderColor: 'grey.200', bgcolor: '#fafbfc',
                        }}>
                            {VARIANT_LABELS[v]}
                            <Box component="span" sx={{ fontWeight: 400, fontSize: '0.7rem', ml: 1, color: 'text.disabled' }}>
                                {v === 'solid-connectors' && 'T-junctions + branch arms'}
                                {v === 'indent-guides' && 'vertical lines only, no arms'}
                                {v === 'depth-borders' && 'coloured left-border bands'}
                                {v === 'minimal' && 'pure indentation, no lines'}
                            </Box>
                        </Box>
                        {TREE_DATA.map((row, i) => (
                            <VSCodeRowWrapper key={i} {...row} variant={v} />
                        ))}
                    </Box>
                ))}
            </Box>
        );
    },
};
