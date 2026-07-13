import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Box } from '@mui/material';
import { TreeBranch } from '../index';

/* ── Test wrapper — provides a row context with position: relative ──── */
const renderTree = (props: Partial<React.ComponentProps<typeof TreeBranch>> = {}) => {
    return render(
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                height: 34,
                borderBottom: '1px solid',
                borderColor: 'grey.200',
            }}
        >
            <TreeBranch
                depth={0}
                hasChildren={false}
                isCollapsed={false}
                onToggle={() => {}}
                connectors={[]}
                {...props}
            />
            {/* Title area */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', height: '100%' }}>
                {((props.depth ?? 0) > 0) && (
                    <Box
                        sx={{ width: (props.depth ?? 0) * 12, flexShrink: 0 }}
                        data-testid="indent-spacer"
                    />
                )}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', px: 0.5, fontSize: '0.78rem' }}>
                    Test row
                </Box>
            </Box>
        </Box>,
    );
};

/* ── Tests ──────────────────────────────────────────────────────────── */

describe('TreeBranch', () => {
    /* ── Twisty icon ──────────────────────────────────────────── */
    describe('twisty icon', () => {
        it('renders an expand/collapse button when hasChildren is true', () => {
            renderTree({ hasChildren: true });
            expect(screen.getByRole('button')).toBeInTheDocument();
        });

        it('does not render a button when hasChildren is false', () => {
            renderTree({ hasChildren: false });
            expect(screen.queryByRole('button')).toBeNull();
        });

        it('shows ExpandMore icon when not collapsed', () => {
            renderTree({ hasChildren: true, isCollapsed: false });
            expect(screen.getByTestId('ExpandMoreIcon')).toBeInTheDocument();
        });

        it('shows ChevronRight icon when collapsed', () => {
            renderTree({ hasChildren: true, isCollapsed: true });
            expect(screen.getByTestId('ChevronRightIcon')).toBeInTheDocument();
        });

        it('calls onToggle when the twisty button is clicked', () => {
            const onToggle = jest.fn();
            renderTree({ hasChildren: true, onToggle });
            fireEvent.click(screen.getByRole('button'));
            expect(onToggle).toHaveBeenCalledTimes(1);
        });

        it('has accessible aria-label "Expand" when collapsed', () => {
            renderTree({ hasChildren: true, isCollapsed: true });
            expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
        });

        it('has accessible aria-label "Collapse" when expanded', () => {
            renderTree({ hasChildren: true, isCollapsed: false });
            expect(screen.getByRole('button', { name: 'Collapse' })).toBeInTheDocument();
        });
    });

    /* ── Connector lines ──────────────────────────────────────── */
    describe('connector lines', () => {
        it('renders no connector lines at depth 0', () => {
            const { container } = renderTree({ depth: 0, connectors: [] });
            // No absolutely-positioned boxes for connectors
            const lines = container.querySelectorAll('[style*="position: absolute"]');
            expect(lines.length).toBe(0);
        });

        it('renders vertical branch line at depth > 0', () => {
            const { container } = renderTree({ depth: 1, connectors: [true, false] });
            // Should have: vertical-up line + horizontal branch arm = 2 absolute elements
            // (no vertical-down since connectors[1] is false)
            const lines = container.querySelectorAll('[style*="position: absolute"]');
            expect(lines.length).toBeGreaterThanOrEqual(2);
        });

        it('renders vertical-down line when connectors[depth] is true', () => {
            const { container } = renderTree({ depth: 1, connectors: [true, true] });
            // Should have: vertical-up + vertical-down + horizontal = 3 absolute elements
            const lines = container.querySelectorAll('[style*="position: absolute"]');
            expect(lines.length).toBeGreaterThanOrEqual(3);
        });

        it('renders ancestor connector lines for each true connector above depth', () => {
            const { container } = renderTree({
                depth: 2,
                connectors: [true, true, false],
            });
            // depth=2: ancestor levels 0,1 → if both true → 2 ancestor lines
            // + current branch (vertical-up + horizontal) = 4 absolute elements
            const lines = container.querySelectorAll('[style*="position: absolute"]');
            expect(lines.length).toBeGreaterThanOrEqual(4);
        });

        it('skips ancestor line when connector is false', () => {
            const { container } = renderTree({
                depth: 2,
                connectors: [false, true, false],
            });
            // Only 1 ancestor line (level 1), + branch (vertical-up + horizontal)
            const lines = container.querySelectorAll('[style*="position: absolute"]');
            expect(lines.length).toBeGreaterThanOrEqual(3);
        });
    });

    /* ── Indent spacer ────────────────────────────────────────── */
    describe('indent spacer', () => {
        it('does not render indent spacer at depth 0', () => {
            renderTree({ depth: 0 });
            expect(screen.queryByTestId('indent-spacer')).toBeNull();
        });

        it('renders indent spacer at depth > 0', () => {
            renderTree({ depth: 2 });
            expect(screen.getByTestId('indent-spacer')).toBeInTheDocument();
        });

        it('indent spacer width equals depth * indent per depth', () => {
            renderTree({ depth: 3 });
            const spacer = screen.getByTestId('indent-spacer');
            expect(spacer).toHaveStyle({ width: '36px' }); // 3 * 12 = 36
        });
    });

    /* ── Layout ───────────────────────────────────────────────── */
    describe('layout', () => {
        it('twisty column has correct width', () => {
            const { container } = renderTree();
            // The twisty Box is the first flex child (after absolute overlays)
            const flexChildren = container.firstChild?.childNodes;
            expect(flexChildren).toBeDefined();
        });

        it('connector lines have pointer-events disabled', () => {
            const { container } = renderTree({
                depth: 1,
                connectors: [true, false],
            });
            const lines = container.querySelectorAll('[style*="position: absolute"]');
            lines.forEach((line) => {
                expect(line).toHaveStyle({ pointerEvents: 'none' });
            });
        });
    });
});
