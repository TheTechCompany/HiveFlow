import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  CheckBoxOutlined,
  Subject,
  Schedule,
  Flag,
  ArrowForward,
} from '@mui/icons-material';
import { AvatarList } from '@hexhive/ui';
import { extractChecklistFromHtml } from '../RichTextEditor';
import type { KanbanColumn, KanbanRow, KanbanTask } from '../../types/kanban';

// ── Types ───────────────────────────────────────────────────────────

export interface CardGridProps {
  columns: KanbanColumn[];
  onSelectCard?: (row: KanbanRow) => void;
}

// ── Helpers ─────────────────────────────────────────────────────────

interface GridCard {
  _row: KanbanRow;
  task: KanbanTask;
  sourceLabel: string;
  sourceName: string;
  title: string;
  status: string;
  statusColor: string;
  statusLabel: string;
  checklistDone: number;
  checklistTotal: number;
  hasDescription: boolean;
  descriptionSnippet: string;
  startDate: string | null;
  endDate: string | null;
  members: Array<{ id: string; name: string }>;
  isOverdue: boolean;
  progressPct: number;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  'In Progress': { label: 'In Progress', color: '#4caf50' },
  Backlog: { label: 'Up Next', color: '#ff9800' },
  Reviewing: { label: 'In Review', color: '#2196f3' },
  Finished: { label: 'Finished', color: '#9e9e9e' },
};

function stripHtml(html: string | null | undefined, maxLen: number = 100): string {
  if (!html) return '';
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? text.slice(0, maxLen) + '…' : text;
}

function buildCards(columns: KanbanColumn[]): GridCard[] {
  const cards: GridCard[] = [];
  // Order: In Progress first, then Backlog, Reviewing, Finished
  const order = ['In Progress', 'Backlog', 'Reviewing', 'Finished'];
  const sorted = [...columns].sort(
    (a, b) => order.indexOf(a.id) - order.indexOf(b.id),
  );

  for (const col of sorted) {
    const meta = STATUS_META[col.id] ?? { label: col.title, color: '#9e9e9e' };
    for (const row of col.rows) {
      const t = row._task;
      const checklist = extractChecklistFromHtml(t.description);
      const src = t.project ?? t.estimate;
      const now = new Date();
      cards.push({
        _row: row,
        task: t,
        sourceLabel: src?.displayId ?? '',
        sourceName: src?.name ?? '',
        title: t.title,
        status: col.id,
        statusColor: meta.color,
        statusLabel: meta.label,
        checklistDone: checklist.filter((i) => i.checked).length,
        checklistTotal: checklist.length,
        hasDescription: !!(t.description && t.description.replace(/<[^>]*>/g, '').trim()),
        descriptionSnippet: stripHtml(t.description, 80),
        startDate: t.startDate ?? null,
        endDate: t.endDate ?? null,
        members: t.members ?? [],
        isOverdue: !!(t.endDate && new Date(t.endDate) < now && col.id !== 'Finished'),
        progressPct: checklist.length > 0
          ? (checklist.filter((i) => i.checked).length / checklist.length) * 100
          : col.id === 'Finished' ? 100 : 0,
      });
    }
  }

  return cards;
}

function formatDate(d: string | null): string {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

// ── Component ───────────────────────────────────────────────────────

export const CardGrid: React.FC<CardGridProps> = ({ columns, onSelectCard }) => {
  const cards = useMemo(() => buildCards(columns), [columns]);

  if (cards.length === 0) {
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
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        px: 2,
        py: 1.5,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 1.5,
        alignContent: 'flex-start',
      }}
    >
      {cards.map((card) => (
        <Paper
          key={card._row.id}
          onClick={() => onSelectCard?.(card._row)}
          sx={{
            cursor: 'pointer',
            bgcolor: '#3a3a3a',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'box-shadow 0.15s, transform 0.15s',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {/* Top accent bar */}
          <Box sx={{ height: 4, bgcolor: card.statusColor, flexShrink: 0 }} />

          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
            {/* Header: source + status */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              {card.sourceLabel ? (
                <Chip
                  label={`${card.sourceLabel} — ${card.sourceName}`}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.08)',
                    color: 'text.secondary',
                    fontSize: '0.65rem',
                    height: 20,
                    maxWidth: '70%',
                    '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
                  }}
                />
              ) : (
                <Box />
              )}
              <Chip
                label={card.statusLabel}
                size="small"
                sx={{
                  bgcolor: card.statusColor,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  height: 20,
                }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="subtitle2"
              sx={{ color: 'white', fontWeight: 600, mb: 0.75, lineHeight: 1.3 }}
            >
              {card.title}
            </Typography>

            {/* Description snippet */}
            {card.descriptionSnippet && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  mb: 1,
                  lineHeight: 1.4,
                  flex: 1,
                }}
              >
                {card.descriptionSnippet}
              </Typography>
            )}

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 1 }} />

            {/* Dates row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              {card.startDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Flag sx={{ fontSize: 12, color: 'text.secondary' }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                    {formatDate(card.startDate)}
                  </Typography>
                </Box>
              )}
              {card.startDate && card.endDate && (
                <ArrowForward sx={{ fontSize: 10, color: 'text.secondary' }} />
              )}
              {card.endDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Schedule sx={{ fontSize: 12, color: card.isOverdue ? '#ef5350' : 'text.secondary' }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: card.isOverdue ? '#ef5350' : 'text.secondary',
                      fontWeight: card.isOverdue ? 600 : 400,
                      fontSize: '0.65rem',
                    }}
                  >
                    {formatDate(card.endDate)}
                    {card.isOverdue && ' ⚠'}
                  </Typography>
                </Box>
              )}
              {!card.startDate && !card.endDate && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic', fontSize: '0.65rem' }}>
                  No dates set
                </Typography>
              )}
            </Box>

            {/* Bottom row: progress + members */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                {card.checklistTotal > 0 ? (
                  <>
                    <LinearProgress
                      variant="determinate"
                      value={card.progressPct}
                      sx={{
                        flex: 1,
                        maxWidth: 100,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: card.progressPct >= 100 ? '#4caf50' : card.statusColor,
                          borderRadius: 3,
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                      <CheckBoxOutlined sx={{ fontSize: 13, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>
                        {card.checklistDone}/{card.checklistTotal}
                      </Typography>
                    </Box>
                  </>
                ) : card.hasDescription ? (
                  <Subject sx={{ fontSize: 14, color: 'text.secondary' }} />
                ) : null}
              </Box>
              <AvatarList size={20} users={card.members} />
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default CardGrid;
