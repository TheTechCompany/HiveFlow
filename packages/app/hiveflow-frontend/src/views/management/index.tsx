import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  Engineering,
  Speed,
  BugReport,
  Build,
  CheckBoxOutlined,
  Subject,
  Dashboard,
  TableChart,
} from '@mui/icons-material';
import { gql, useQuery } from '@apollo/client';
import { AvatarList } from '@hexhive/ui';
import { KanbanBoard } from '../../components/KanbanBoard';
import type { KanbanTask, KanbanColumn, KanbanRow } from '../../types/kanban';
import { extractChecklistFromHtml } from '@hive-flow/ui';

// ── GraphQL ─────────────────────────────────────────────────────────

const GET_MANAGEMENT_DATA = gql`
  query GetManagementData {
    users(active: true) {
      id
      name
    }
    assignments {
      ... on EstimateTask {
        id
        title
        description
        startDate
        endDate
        status
        timelineRank
        columnRank
        handoverNote
        members { id name }
        estimate { displayId id name }
      }
      ... on ProjectTask {
        id
        title
        description
        startDate
        endDate
        status
        timelineRank
        columnRank
        handoverNote
        members { id name }
        project { id displayId name }
      }
    }
  }
`;

// ── Constants ───────────────────────────────────────────────────────

type TabId = 'overview' | 'ci-register';
type ViewMode = 'kanban' | 'list';

const CI_KEYWORDS = ['improvement', 'kaizen', 'quality', 'process', 'audit', 'procedure', 'standard', 'corrective', 'preventive', 'nonconformance', 'iso', 'pdca', 'lean', 'six sigma', 'root cause', 'capa', '5s', 'gemba', 'jidoka', 'andon'];

// ── Helpers ─────────────────────────────────────────────────────────

function isCiRelated(task: KanbanTask): boolean {
  const text = `${task.title ?? ''} ${task.description ?? ''}`.toLowerCase();
  return CI_KEYWORDS.some((kw) => text.includes(kw));
}

function hasVisibleContent(html: string | null | undefined): boolean {
  if (!html) return false;
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > 0;
}

const STATUS_ORDER = ['Backlog', 'In Progress', 'Reviewing', 'Finished'] as const;
const STATUS_TITLES: Record<string, string> = {
  'Backlog': 'Backlog',
  'In Progress': 'In Progress',
  'Reviewing': 'In Review',
  'Finished': 'Finished',
};

function buildKanbanColumns(tasks: KanbanTask[]): KanbanColumn[] {
  return STATUS_ORDER.map((status) => {
    const filtered = tasks
      .filter((t) => t.status === status)
      .sort((a, b) => (a.columnRank ?? '').localeCompare(b.columnRank ?? ''));
    return {
      id: status,
      title: STATUS_TITLES[status] ?? status,
      rows: filtered.map((t) => ({
        id: t.id,
        title: t.title,
        _task: t,
      })),
    };
  });
}

// ── Card renderer ───────────────────────────────────────────────────

const ManagementTaskCard: React.FC<{ row: KanbanRow }> = ({ row }) => {
  const t = row._task;
  const src = t.project ?? t.estimate;
  return (
    <Paper
      sx={{
        bgcolor: 'background.paper',
        minHeight: '24px',
        flexDirection: 'column',
        display: 'flex',
        boxShadow: 1,
      }}
    >
      {src && (
        <Box sx={{ bgcolor: 'secondary.main', padding: '6px' }}>
          <Typography variant="caption" sx={{ color: 'white' }}>
            {src.displayId} - {src.name}
          </Typography>
        </Box>
      )}
      <Box sx={{ padding: '6px' }}>
        <Typography variant="body2">{t.title}</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: '4px',
          }}
        >
          <Box>
            {(() => {
              const checklist = extractChecklistFromHtml(t.description);
              if (checklist.length > 0) {
                const done = checklist.filter((i) => i.checked).length;
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <CheckBoxOutlined sx={{ fontSize: 13 }} />
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                      {done}/{checklist.length}
                    </Typography>
                  </Box>
                );
              }
              if (hasVisibleContent(t.description)) {
                return <Subject fontSize="small" />;
              }
              return null;
            })()}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isCiRelated(t) && (
              <Tooltip title="Continuous Improvement">
                <Build fontSize="small" color="secondary" sx={{ fontSize: 14 }} />
              </Tooltip>
            )}
            <AvatarList size={20} users={t.members ?? []} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

// ── Sub-components ──────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <Card sx={{ flex: 1, minWidth: 140 }}>
    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
        <Box sx={{ color, opacity: 0.7 }}>{icon}</Box>
      </Stack>
    </CardContent>
  </Card>
);

// ── Main view ───────────────────────────────────────────────────────

export const ManagementView: React.FC = () => {
  const { data, loading, error } = useQuery(GET_MANAGEMENT_DATA, {
    fetchPolicy: 'cache-and-network',
  });

  const [tab, setTab] = useState<TabId>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  const tasks: KanbanTask[] = data?.assignments ?? [];

  // ── Derived stats ──────────────────────────────────────────────

  const allKanbanColumns = useMemo(() => buildKanbanColumns(tasks), [tasks]);
  const ciKanbanColumns = useMemo(() => buildKanbanColumns(tasks.filter(isCiRelated)), [tasks]);

  const stats = useMemo(() => {
    const inProgress = tasks.filter((t) => t.status === 'In Progress');
    const ciTasks = tasks.filter(isCiRelated);
    const ciInProgress = ciTasks.filter((t) => t.status === 'In Progress');
    const reviewing = tasks.filter((t) => t.status === 'Reviewing');

    return {
      total: tasks.length,
      inProgress: inProgress.length,
      ciTotal: ciTasks.length,
      ciInProgress: ciInProgress.length,
      reviewing: reviewing.length,
    };
  }, [tasks]);

  const ciTasks = useMemo(() => tasks.filter(isCiRelated), [tasks]);

  // ── Loading state ──────────────────────────────────────────────

  if (loading) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ flex: 1, p: 2 }}>
        <Alert severity="error">Failed to load management data: {error.message}</Alert>
      </Box>
    );
  }

  // ── Render ─────────────────────────────────────────────────────

  return (
    <Box sx={{ flex: 1, flexDirection: 'column', display: 'flex', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2, pb: 0 }}>
        <Typography sx={{ color: 'text.primary' }} fontWeight="bold" variant="h6">
          Management
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          size="small"
          onChange={(_ev, val) => val && setViewMode(val)}
        >
          <ToggleButton value="kanban" title="Kanban view">
            <Dashboard fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list" title="List view">
            <TableChart fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_ev, val) => setTab(val)}
        sx={{
          px: 2,
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: 40,
            textTransform: 'none',
            color: 'text.secondary',
            fontSize: '0.8rem',
            '&.Mui-selected': { color: 'primary.main' },
          },
          '& .MuiTabs-indicator': { bgcolor: 'primary.main' },
        }}
      >
        <Tab label="Overview" value="overview" />
        <Tab
          label={`Improvement Register (${ciTasks.length})`}
          value="ci-register"
          icon={ciTasks.some((t) => t.status === 'In Progress' || t.status === 'Reviewing') ? <Build fontSize="small" color="warning" /> : undefined}
          iconPosition="end"
        />
      </Tabs>

      {/* Tab content */}
      {tab === 'overview' ? (
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* ── Stat cards ─────────────────────────────────────── */}
          <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <StatCard label="In Progress" value={stats.inProgress} icon={<Engineering fontSize="large" />} color="#4caf50" />
            <StatCard label="In Review" value={stats.reviewing} icon={<Speed fontSize="large" />} color="#ff9800" />
            <StatCard label="Improvement" value={stats.ciTotal} icon={<Build fontSize="large" />} color="#9c27b0" />
            <StatCard label="Active Improvement" value={stats.ciInProgress} icon={<BugReport fontSize="large" />} color="#f44336" />
          </Stack>

          {/* ── All-ticket view ────────────────────────────────── */}
          {tasks.length === 0 ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">No tickets found.</Typography>
            </Box>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              columns={allKanbanColumns}
              renderCard={(row) => <ManagementTaskCard row={row} />}
            />
          ) : (
            <TableContainer component={Paper} sx={{ flex: 1, bgcolor: 'background.paper' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Ticket</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Assignees</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {isCiRelated(task) && (
                            <Tooltip title="Continuous Improvement">
                              <Build fontSize="small" color="secondary" sx={{ fontSize: 14 }} />
                            </Tooltip>
                          )}
                          <Typography variant="body2" fontWeight="medium">
                            {task.title}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {(task.project ?? task.estimate)?.displayId} - {(task.project ?? task.estimate)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          size="small"
                          sx={{
                            bgcolor: task.status === 'In Progress' ? '#4caf50' : task.status === 'Reviewing' ? '#ff9800' : task.status === 'Finished' ? '#2196f3' : '#9e9e9e',
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <AvatarList size={22} users={task.members ?? []} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ) : (
        /* ── Improvement Register tab ─────────────────────────────── */
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
            Improvement Register — Continuous Improvement ({ciTasks.length})
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            Tickets matching ISO CI keywords: {CI_KEYWORDS.join(', ')}
          </Typography>

          {ciTasks.length === 0 ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Alert severity="info">
                No improvement tickets found. Create tickets with ISO CI keywords (improvement, kaizen, quality, process, audit, etc.) to populate this register.
              </Alert>
            </Box>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              columns={ciKanbanColumns}
              renderCard={(row) => <ManagementTaskCard row={row} />}
            />
          ) : (
            <TableContainer component={Paper} sx={{ flex: 1, bgcolor: 'background.paper' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Ticket</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Source</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Assignees</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ciTasks.map((task) => (
                    <TableRow key={task.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {task.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {(task.project ?? task.estimate)?.displayId} - {(task.project ?? task.estimate)?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={task.status}
                          size="small"
                          sx={{
                            bgcolor: task.status === 'In Progress' ? '#4caf50' : task.status === 'Reviewing' ? '#ff9800' : task.status === 'Finished' ? '#2196f3' : '#9e9e9e',
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <AvatarList size={22} users={task.members ?? []} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ManagementView;
