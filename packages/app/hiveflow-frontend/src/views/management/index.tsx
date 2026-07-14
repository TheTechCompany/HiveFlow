import React, { useMemo, useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
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
  Build,
  Subject,
  Dashboard,
  TableChart,
} from '@mui/icons-material';
import { gql, useQuery } from '@apollo/client';
import { AvatarList } from '@hexhive/ui';
import { KanbanBoard } from '../../components/KanbanBoard';
import type { KanbanTask, KanbanColumn, KanbanRow } from '../../types/kanban';
import { useTypeConfiguration } from '../../context';
import { CiUpdateModal, CiDetail } from '../../modals/new-task/ci-update';

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

const GET_CONTINUOUS_IMPROVEMENTS = gql`
  query GetContinuousImprovements {
    continuousImprovements {
      id
      displayId
      title
      description
      category
      source
      status
      priority
      impact
      rootCause
      actionTaken
      outcomeMeasured
      createdBy { id name }
      assignedTo { id name }
      createdAt
      updatedAt
      completedAt
    }
  }
`;

// ── Constants ───────────────────────────────────────────────────────

type TabId = 'overview' | 'ci-register';
type ViewMode = 'kanban' | 'list';

const CI_KEYWORDS = ['improvement', 'kaizen', 'quality', 'process', 'audit', 'procedure', 'standard', 'corrective', 'preventive', 'nonconformance', 'iso', 'pdca', 'lean', 'six sigma', 'root cause', 'capa', '5s', 'gemba', 'jidoka', 'andon'];

const TASK_STATUS_ORDER = ['Backlog', 'In Progress', 'Reviewing', 'Finished'] as const;
const TASK_STATUS_TITLES: Record<string, string> = {
  'Backlog': 'Backlog',
  'In Progress': 'In Progress',
  'Reviewing': 'In Review',
  'Finished': 'Finished',
};

const CI_STATUS_ORDER = ['identified', 'in_progress', 'implemented', 'verified', 'closed'] as const;
const CI_STATUS_TITLES: Record<string, string> = {
  'identified': 'Identified',
  'in_progress': 'In Progress',
  'implemented': 'Implemented',
  'verified': 'Verified',
  'closed': 'Closed',
};

const CI_PRIORITY_COLORS: Record<string, string> = {
  low: '#9e9e9e',
  medium: '#2196f3',
  high: '#ff9800',
  critical: '#f44336',
};

// ── Types ───────────────────────────────────────────────────────────

function isCiRelated(task: KanbanTask): boolean {
  const text = `${task.title ?? ''} ${task.description ?? ''}`.toLowerCase();
  return CI_KEYWORDS.some((kw) => text.includes(kw));
}

function hasVisibleContent(html: string | null | undefined): boolean {
  if (!html) return false;
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > 0;
}

function buildTaskKanbanColumns(tasks: KanbanTask[]): KanbanColumn[] {
  return TASK_STATUS_ORDER.map((status) => {
    const filtered = tasks
      .filter((t) => t.status === status)
      .sort((a, b) => (a.columnRank ?? '').localeCompare(b.columnRank ?? ''));
    return {
      id: status,
      title: TASK_STATUS_TITLES[status] ?? status,
      rows: filtered.map((t) => ({
        id: t.id,
        title: t.title,
        _task: t,
      })),
    };
  });
}

function buildCiKanbanColumns(records: CiDetail[]): KanbanColumn[] {
  return CI_STATUS_ORDER.map((status) => {
    const filtered = records
      .filter((r) => r.status === status)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return {
      id: status,
      title: CI_STATUS_TITLES[status] ?? status,
      rows: filtered.map((r) => ({
        id: r.id,
        title: r.title,
        _task: r,
      })),
    };
  });
}

// ── Card renderers ──────────────────────────────────────────────────

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
              const subtasks = t.children;
              if (subtasks && subtasks.length > 0) {
                const done = subtasks.filter(s => s.status === 'Finished').length;
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <Subject sx={{ fontSize: 13 }} />
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                      {done}/{subtasks.length}
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
              <Tooltip title="CI-related task">
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

const CiCard: React.FC<{ row: KanbanRow }> = ({ row }) => {
  const ci = row._task as CiDetail;
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
      <Box sx={{ padding: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            {ci.displayId}
          </Typography>
          {ci.priority && (
            <Chip
              label={ci.priority}
              size="small"
              sx={{
                bgcolor: CI_PRIORITY_COLORS[ci.priority] ?? '#9e9e9e',
                color: 'white',
                fontSize: '0.6rem',
                height: 18,
              }}
            />
          )}
        </Box>
        <Typography variant="body2" sx={{ mb: 0.5 }}>{ci.title}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {ci.category && (
              <Chip label={ci.category} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />
            )}
          </Stack>
          {ci.assignedTo && (
            <AvatarList size={18} users={[ci.assignedTo]} />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

// ── Main view ───────────────────────────────────────────────────────

export const ManagementView: React.FC = () => {
  const managementPerm = useTypeConfiguration('Management');

  const { data, loading, error } = useQuery(GET_MANAGEMENT_DATA, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: ciData, loading: ciLoading, error: ciError, refetch: refetchCis } = useQuery(GET_CONTINUOUS_IMPROVEMENTS, {
    fetchPolicy: 'cache-and-network',
  });

  const [tab, setTab] = useState<TabId>('overview');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [selectedCi, setSelectedCi] = useState<CiDetail | null>(null);

  const tasks: KanbanTask[] = data?.assignments ?? [];
  const ciRecords: CiDetail[] = ciData?.continuousImprovements ?? [];

  const handleSelectCi = useCallback((row: KanbanRow) => {
    setSelectedCi(row._task as CiDetail);
  }, []);

  const allKanbanColumns = useMemo(() => buildTaskKanbanColumns(tasks), [tasks]);
  const ciKanbanColumns = useMemo(() => buildCiKanbanColumns(ciRecords), [ciRecords]);

  // ── Permission guard ──────────────────────────────────────────

  if (managementPerm?.read === false) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <Alert severity="warning">You do not have permission to access the Management view.</Alert>
      </Box>
    );
  }

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
          label={`Improvement Register (${ciRecords.length})`}
          value="ci-register"
          icon={<Build fontSize="small" color="warning" />}
          iconPosition="end"
        />
      </Tabs>

      {/* Tab content */}
      {tab === 'overview' ? (
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 2 }}>
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
                            <Tooltip title="CI-related task">
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
            Improvement Register — Continuous Improvement ({ciRecords.length})
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            Track improvement ideas from identification through to verification and closure.
          </Typography>

          {ciLoading ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : ciError ? (
            <Alert severity="error">Failed to load CI register: {ciError.message}</Alert>
          ) : ciRecords.length === 0 ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Alert severity="info">
                No continuous improvements recorded yet. Submit a CI from the Assignments view to populate this register.
              </Alert>
            </Box>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              columns={ciKanbanColumns}
              renderCard={(row) => <CiCard row={row} />}
              onSelectCard={handleSelectCi}
            />
          ) : (
            <TableContainer component={Paper} sx={{ flex: 1, bgcolor: 'background.paper' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Assigned To</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Created</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ciRecords.map((ci) => (
                    <TableRow key={ci.id} hover onClick={() => setSelectedCi(ci)} sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Typography variant="caption" fontWeight="bold">
                          {ci.displayId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {ci.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {ci.category && (
                          <Chip label={ci.category} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={CI_STATUS_TITLES[ci.status] ?? ci.status}
                          size="small"
                          sx={{
                            bgcolor:
                              ci.status === 'identified' ? '#9e9e9e' :
                              ci.status === 'in_progress' ? '#4caf50' :
                              ci.status === 'implemented' ? '#2196f3' :
                              ci.status === 'verified' ? '#9c27b0' :
                              ci.status === 'closed' ? '#757575' : '#9e9e9e',
                            color: 'white',
                            fontSize: '0.65rem',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {ci.priority && (
                          <Chip
                            label={ci.priority}
                            size="small"
                            sx={{
                              bgcolor: CI_PRIORITY_COLORS[ci.priority] ?? '#9e9e9e',
                              color: 'white',
                              fontSize: '0.65rem',
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {ci.assignedTo ? (
                          <AvatarList size={22} users={[ci.assignedTo]} />
                        ) : (
                          <Typography variant="caption" color="text.secondary">—</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(ci.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* ── CI detail modal ──────────────────────────────────── */}
      <CiUpdateModal
        open={!!selectedCi}
        selected={selectedCi}
        users={data?.users ?? []}
        onClose={() => setSelectedCi(null)}
        onUpdated={() => { refetchCis(); }}
        onDeleted={() => { refetchCis(); }}
      />
    </Box>
  );
};

export default ManagementView;
