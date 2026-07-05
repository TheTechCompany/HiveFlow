import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Subject,
  Schedule,
} from '@mui/icons-material';
import { AvatarList } from '@hexhive/ui';
import type { KanbanColumn, KanbanRow, KanbanTask } from '../../types/kanban';

// ── Types ───────────────────────────────────────────────────────────

export interface TableViewProps {
  columns: KanbanColumn[];
  onSelectCard?: (row: KanbanRow) => void;
}

// ── Helpers ─────────────────────────────────────────────────────────

type SortKey = 'source' | 'title' | 'status' | 'progress' | 'startDate' | 'endDate';

interface FlatRow {
  _row: KanbanRow;
  task: KanbanTask;
  source: string;
  sourceName: string;
  title: string;
  status: string;
  subtaskDone: number;
  subtaskCount: number;
  hasDescription: boolean;
  startDate: string | null;
  endDate: string | null;
  members: Array<{ id: string; name: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  'In Progress': '#4caf50',
  Backlog: '#ff9800',
  Reviewing: '#2196f3',
  Finished: '#9e9e9e',
};

function flattenRows(columns: KanbanColumn[]): FlatRow[] {
  return columns.flatMap((col) =>
    col.rows.map((row) => {
      const t = row._task;
      const src = t.project ?? t.estimate;
      const subtaskTotal = t.children?.length ?? 0;
      const subtaskDone = t.children?.filter(s => s.status === 'Finished').length ?? 0;
      return {
        _row: row,
        task: t,
        source: src?.displayId ?? '',
        sourceName: src?.name ?? '',
        title: row.title,
        status: col.id,
        subtaskDone,
        subtaskCount: subtaskTotal,
        hasDescription: !!(t.description && t.description.replace(/<[^>]*>/g, '').trim()),
        startDate: t.startDate ?? null,
        endDate: t.endDate ?? null,
        members: t.members ?? [],
      };
    }),
  );
}

function formatDate(d: string | null): string {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? '2-digit' : undefined,
  });
}

// ── Component ───────────────────────────────────────────────────────

export const TableView: React.FC<TableViewProps> = ({
  columns,
  onSelectCard,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('status');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const flatRows = useMemo(() => flattenRows(columns), [columns]);

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...flatRows].sort((a, b) => {
      const statusOrder = ['In Progress', 'Backlog', 'Reviewing', 'Finished'];
      switch (sortKey) {
        case 'status':
          return (statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)) * dir;
        case 'source':
          return a.source.localeCompare(b.source) * dir;
        case 'title':
          return a.title.localeCompare(b.title) * dir;
        case 'progress': {
          const pctA = a.subtaskCount > 0 ? a.subtaskDone / a.subtaskCount : -1;
          const pctB = b.subtaskCount > 0 ? b.subtaskDone / b.subtaskCount : -1;
          return (pctA - pctB) * dir;
        }
        case 'startDate':
          return ((a.startDate ?? '').localeCompare(b.startDate ?? '')) * dir;
        case 'endDate':
          return ((a.endDate ?? '').localeCompare(b.endDate ?? '')) * dir;
        default:
          return 0;
      }
    });
  }, [flatRows, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  if (flatRows.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}
      >
        <Typography>No tasks assigned</Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        flex: 1,
        bgcolor: 'background.paper',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        '& .MuiTableCell-root': { borderColor: 'divider' },
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ bgcolor: 'secondary.main', color: 'white', width: 120 }}>
              <TableSortLabel
                active={sortKey === 'source'}
                direction={sortKey === 'source' ? sortDir : 'asc'}
                onClick={() => handleSort('source')}
                sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' }, '& .MuiTableSortLabel-icon': { color: 'inherit' } }}
              >
                Source
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ bgcolor: 'secondary.main', color: 'white' }}>
              <TableSortLabel
                active={sortKey === 'title'}
                direction={sortKey === 'title' ? sortDir : 'asc'}
                onClick={() => handleSort('title')}
                sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' }, '& .MuiTableSortLabel-icon': { color: 'inherit' } }}
              >
                Title
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ bgcolor: 'secondary.main', color: 'white', width: 130 }}>
              <TableSortLabel
                active={sortKey === 'status'}
                direction={sortKey === 'status' ? sortDir : 'asc'}
                onClick={() => handleSort('status')}
                sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' }, '& .MuiTableSortLabel-icon': { color: 'inherit' } }}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ bgcolor: 'secondary.main', color: 'white', width: 100 }}>
              <TableSortLabel
                active={sortKey === 'progress'}
                direction={sortKey === 'progress' ? sortDir : 'asc'}
                onClick={() => handleSort('progress')}
                sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' }, '& .MuiTableSortLabel-icon': { color: 'inherit' } }}
              >
                Progress
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ bgcolor: 'secondary.main', color: 'white', width: 100 }}>
              <TableSortLabel
                active={sortKey === 'startDate'}
                direction={sortKey === 'startDate' ? sortDir : 'asc'}
                onClick={() => handleSort('startDate')}
                sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' }, '& .MuiTableSortLabel-icon': { color: 'inherit' } }}
              >
                Start
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ bgcolor: 'secondary.main', color: 'white', width: 100 }}>
              <TableSortLabel
                active={sortKey === 'endDate'}
                direction={sortKey === 'endDate' ? sortDir : 'asc'}
                onClick={() => handleSort('endDate')}
                sx={{ color: 'inherit', '&.Mui-active': { color: 'inherit' }, '& .MuiTableSortLabel-icon': { color: 'inherit' } }}
              >
                Due
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ bgcolor: 'secondary.main', color: 'white', width: 100 }}>
              Members
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((row) => (
            <TableRow
              key={row._row.id}
              hover
              onClick={() => onSelectCard?.(row._row)}
              sx={{
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
                '&:nth-of-type(odd)': { bgcolor: 'rgba(0,0,0,0.02)' },
              }}
            >
              {/* Source */}
              <TableCell>
                {row.source ? (
                  <Tooltip title={row.sourceName}>
                    <Chip
                      label={`${row.source}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.7rem',
                        height: 20,
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Typography variant="caption" color="text.secondary">—</Typography>
                )}
              </TableCell>

              {/* Title */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.title}
                  </Typography>
                  {row.hasDescription && (
                    <Subject sx={{ fontSize: 14, color: 'text.secondary' }} />
                  )}
                </Box>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Chip
                  label={row.status === 'Backlog' ? 'Up Next' : row.status}
                  size="small"
                  sx={{
                    bgcolor: STATUS_COLORS[row.status] ?? '#9e9e9e',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    height: 22,
                  }}
                />
              </TableCell>

              {/* Progress */}
              <TableCell>
                {row.subtaskCount > 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(row.subtaskDone / row.subtaskCount) * 100}
                      sx={{
                        flex: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(0,0,0,0.08)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor:
                            row.subtaskDone === row.subtaskCount
                              ? '#4caf50'
                              : '#ff9800',
                          borderRadius: 3,
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 28 }}>
                      {row.subtaskDone}/{row.subtaskCount}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    —
                  </Typography>
                )}
              </TableCell>

              {/* Start date */}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Schedule sx={{ fontSize: 12, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {formatDate(row.startDate)}
                  </Typography>
                </Box>
              </TableCell>

              {/* Due date */}
              <TableCell>
                <Typography
                  variant="caption"
                  sx={{
                    color: row.endDate && new Date(row.endDate) < new Date()
                      ? '#ef5350'
                      : 'text.secondary',
                    fontWeight: row.endDate && new Date(row.endDate) < new Date()
                      ? 600
                      : 400,
                  }}
                >
                  {formatDate(row.endDate)}
                </Typography>
              </TableCell>

              {/* Members */}
              <TableCell>
                <AvatarList size={22} users={row.members} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableView;
