import React, { useState, useMemo, useCallback } from 'react';
import {
  Autocomplete,
  Box,
  CircularProgress,
  Paper,
  Select,
  MenuItem as SelectMenuItem,
  FormControl,
  TextField,
  Typography,
  Alert,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Collapse,
} from '@mui/material';
import {
  CheckBoxOutlined,
  Subject,
  TableChart,
  Timeline,
  Dashboard,
  AccountTree,
  Add,
  TaskOutlined,
  BuildOutlined,
  NoteAddOutlined,
  ExpandMore,
  ExpandLess,
  Loop,
} from '@mui/icons-material';
import { gql, useQuery } from '@apollo/client';
import { AvatarList } from '@hexhive/ui';
import {
  HorizontalKanban,
  TableView,
  TimelineView,
} from '../../components/TaskViews';
import { useAssignments } from '../../hooks/use-assignments';
import { TaskModal } from '../../modals/new-task';
import { CiUpdateModal } from '../../modals/new-task/ci-update';
import { ProjectNoteModal } from '../../modals/new-task/project-note';
import { HandoverModal } from '../../components/HandoverModal';
import { extractChecklistFromHtml } from '@hive-flow/ui';
import type {
  KanbanTask,
  KanbanRow,
  TaskFilterOption,
} from '../../types/kanban';

// ── GraphQL ─────────────────────────────────────────────────────────

const MY_CONTINUOUS_IMPROVEMENTS = gql`
  query MyContinuousImprovements {
    myContinuousImprovements {
      id
      displayId
      title
      category
      source
      status
      priority
      createdAt
    }
  }
`;

// ── View switcher types ─────────────────────────────────────────────

type TaskViewMode = 'horizontal' | 'table' | 'timeline';

const VIEW_OPTIONS: Array<{
  value: TaskViewMode;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: 'horizontal', label: 'Kanban', icon: <Dashboard fontSize="small" /> },
  { value: 'table', label: 'Table', icon: <TableChart fontSize="small" /> },
  { value: 'timeline', label: 'Timeline', icon: <Timeline fontSize="small" /> },
];

// ── Helpers ─────────────────────────────────────────────────────────

type GroupByMode = 'none' | 'project';

function taskToSelected(task: KanbanTask) {
  return {
    ...task,
    start: task.startDate ? new Date(task.startDate) : undefined,
    end: task.endDate ? new Date(task.endDate) : undefined,
  };
}

/** Returns true if the HTML string contains visible text (not just empty tags or whitespace). */
function hasVisibleContent(html: string | null | undefined): boolean {
  if (!html) return false;
  // Strip HTML tags and trim whitespace
  const text = html.replace(/<[^>]*>/g, '').trim();
  return text.length > 0;
}

// ── Render-card sub-component ───────────────────────────────────────

function freqLabel(frequency: string | null | undefined): string {
  if (!frequency) return '';
  switch (frequency) {
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    case 'monthly': return 'Monthly';
    case 'quarterly': return 'Quarterly';
    case 'yearly': return 'Yearly';
    default: return frequency;
  }
}

/** Returns true if a task came from a recurring event (generated ProjectTask or raw legacy RecurringEvent). */
function isRecurringTask(t: KanbanTask): boolean {
  return !!(t.recurringEvent || t.scheduleId || t.__typename === 'RecurringEvent');
}

function recurringBadge(t: KanbanTask): { freq?: string | null; scheduleName?: string } | null {
  if (t.recurringEvent) {
    return {
      freq: t.recurringEvent.frequency,
      scheduleName: t.recurringEvent.schedule?.name,
    };
  }
  if (t.scheduleId || t.__typename === 'RecurringEvent') {
    return {
      freq: t.frequency,
      scheduleName: t.schedule?.name,
    };
  }
  return null;
}

const TaskCard: React.FC<{ row: KanbanRow }> = ({ row }) => {
  const t = row._task;
  const src = t.project ?? t.estimate;
  const isRecurring = isRecurringTask(t);
  const badge = recurringBadge(t);
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
      {isRecurring && badge ? (
        <Box sx={{ bgcolor: 'primary.main', padding: '6px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Loop sx={{ fontSize: 14, color: 'white' }} />
          <Typography variant="caption" sx={{ color: 'white' }}>
            {freqLabel(badge.freq)}{badge.scheduleName ? ` — ${badge.scheduleName}` : ''}
          </Typography>
        </Box>
      ) : src ? (
        <Box sx={{ bgcolor: 'secondary.main', padding: '6px' }}>
          <Typography variant="caption" sx={{ color: 'white' }}>
            {src.displayId} - {src.name}
          </Typography>
        </Box>
      ) : null}
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
              if (isRecurring && badge?.freq) {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <Loop sx={{ fontSize: 13 }} />
                    <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600 }}>
                      {freqLabel(badge.freq)}
                    </Typography>
                  </Box>
                );
              }
              const checklist = extractChecklistFromHtml(t.description);
              if (checklist.length > 0) {
                const done = checklist.filter(i => i.checked).length;
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
          <AvatarList size={20} users={t.members ?? []} />
        </Box>
      </Box>
    </Paper>
  );
};

// ── Horizon selector ───────────────────────────────────────────────

const HORIZON_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 30, label: '30 days' },
  { value: 90, label: '90 days' },
  { value: 180, label: '6 months' },
  { value: 365, label: 'This year' },
];

// ── Main view ───────────────────────────────────────────────────────

export const Assignments: React.FC = () => {
  // ── Local UI state (horizon must be set before hook call) ────

  const [horizonDays, setHorizonDays] = useState<number>(90);

  const {
    loading,
    error,
    users,
    taskFilters,
    buildColumns,
    onDrag,
    updateTask,
    createTask,
    deleteProjectTask,
    deleteEstimateTask,
    refetch,
    pendingHandover,
    submitHandover,
    cancelHandover,
    startNextTask,
  } = useAssignments(horizonDays);

  // ── Local UI state ─────────────────────────────────────────────

  const [filter, setFilter] = useState<TaskFilterOption[]>([]);
  const [modalType, setModalType] = useState<'task' | 'ci_update' | 'project_note' | null>(null);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [viewMode, setViewMode] = useState<TaskViewMode>('horizontal');
  const [groupBy, setGroupBy] = useState<GroupByMode>('none');
  const [addMenuAnchor, setAddMenuAnchor] = useState<HTMLElement | null>(null);
  const [showMyCIs, setShowMyCIs] = useState(false);

  // ── My CIs query ──────────────────────────────────────────────

  const { data: myCiData } = useQuery(MY_CONTINUOUS_IMPROVEMENTS, {
    fetchPolicy: 'cache-and-network',
  });
  const myCIs: any[] = myCiData?.myContinuousImprovements ?? [];

  // ── Derived columns ────────────────────────────────────────────

  const columns = useMemo(() => buildColumns(filter, groupBy), [buildColumns, filter, groupBy]);

  // ── Handlers ───────────────────────────────────────────────────

  const taskType = selectedTask?.project
    ? 'project'
    : selectedTask?.estimate
      ? 'estimate'
      : undefined;

  const handleAutoSaveDescription = useCallback(
    (html: string) => {
      if (!selectedTask || !taskType) return;
      updateTask(selectedTask.id, { description: html }, taskType);
    },
    [selectedTask, taskType, updateTask],
  );

  const handleSelectCard = useCallback((row: KanbanRow) => {
    setSelectedTask(row._task);
    setModalType('task');
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalType(null);
    setSelectedTask(null);
  }, []);

  const handleDeleteTask = useCallback(async () => {
    if (!selectedTask) return;
    try {
      if (selectedTask.project) {
        await deleteProjectTask(selectedTask.id);
      } else if (selectedTask.estimate) {
        await deleteEstimateTask(selectedTask.id);
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      return;
    }
    refetch();
    handleCloseModal();
  }, [selectedTask, deleteProjectTask, deleteEstimateTask, refetch, handleCloseModal]);

  const handleSubmitTask = useCallback(
    async (task: Record<string, unknown>) => {
      if (!selectedTask) {
        // ── Create mode (no existing task selected) ──────────
        if (!task.title) return;
        await createTask({
          title: task.title,
          description: task.description,
          startDate: task.startDate,
          endDate: task.endDate,
          status: task.status ?? 'Backlog',
          taskType: task.taskType,
          category: task.category,
        });
      } else if (taskType) {
        // ── Edit mode ────────────────────────────────────────
        await updateTask(
          selectedTask.id,
          {
            title: task.title,
            description: task.description,
            startDate: task.startDate,
            endDate: task.endDate,
            status: task.status,
            taskType: task.taskType,
            category: task.category,
          },
          taskType,
        );
      }
      refetch();
      handleCloseModal();
    },
    [selectedTask, taskType, updateTask, createTask, refetch, handleCloseModal],
  );

  // ── Render states ──────────────────────────────────────────────

  if (loading) {
    return (
      <Paper
        sx={{
          flex: 1,
          bgcolor: 'secondary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ flex: 1, p: 2 }}>
        <Alert severity="error">
          Failed to load assignments: {error.message}
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        flex: 1,
        bgcolor: 'secondary.main',
        flexDirection: 'column',
        display: 'flex',
      }}
    >
      {/* ── Task modal ─────────────────────────────────────── */}
      <TaskModal
        users={users}
        open={modalType === 'task'}
        selected={selectedTask ? taskToSelected(selectedTask) : null}
        onClose={handleCloseModal}
        onDelete={handleDeleteTask}
        onSubmit={handleSubmitTask}
        onAutoSaveDescription={handleAutoSaveDescription}
      />

      {/* ── CI Update modal ─────────────────────────────────── */}
      <CiUpdateModal
        users={users}
        open={modalType === 'ci_update'}
        onClose={handleCloseModal}
      />

      {/* ── Project Note modal ──────────────────────────────── */}
      <ProjectNoteModal
        open={modalType === 'project_note'}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
      />

      {/* ── Handover modal ───────────────────────────────────── */}
      <HandoverModal
        open={!!pendingHandover}
        task={pendingHandover}
        onSubmit={submitHandover}
        onCancel={cancelHandover}
      />

      {/* ── Header ───────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            sx={{ color: 'navigation.main', padding: '6px' }}
            fontWeight="bold"
          >
            Assigned tasks
          </Typography>

          <FormControl size="small" sx={{ minWidth: 105 }}>
            <Select
              value={horizonDays}
              onChange={(e) => setHorizonDays(e.target.value as number)}
              sx={{
                color: 'white',
                fontSize: '0.7rem',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' },
                '.MuiSvgIcon-root': { color: 'white' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
              }}
            >
              {HORIZON_OPTIONS.map((opt) => (
                <SelectMenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectMenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            size="small"
            onChange={(_ev, val) => val && setViewMode(val)}
            sx={{
              '& .MuiToggleButton-root': {
                color: 'text.secondary',
                borderColor: 'rgba(255,255,255,0.12)',
                textTransform: 'none',
                px: 1.25,
                py: 0.25,
                fontSize: '0.7rem',
                '&.Mui-selected': {
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.12)',
                },
              },
            }}
          >
            {VIEW_OPTIONS.map((opt) => (
              <Tooltip key={opt.value} title={opt.label}>
                <ToggleButton value={opt.value}>
                  {opt.icon}
                </ToggleButton>
              </Tooltip>
            ))}
          </ToggleButtonGroup>

          <ToggleButtonGroup
            value={groupBy}
            exclusive
            size="small"
            onChange={(_ev, val) => val !== null && setGroupBy(val)}
            sx={{
              '& .MuiToggleButton-root': {
                color: 'text.secondary',
                borderColor: 'rgba(255,255,255,0.12)',
                textTransform: 'none',
                px: 1.25,
                py: 0.25,
                fontSize: '0.7rem',
                '&.Mui-selected': {
                  color: 'white',
                  bgcolor: 'rgba(255,255,255,0.12)',
                },
              },
            }}
          >
            <Tooltip title="Group by project">
              <ToggleButton value="project">
                <AccountTree fontSize="small" />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Add fontSize="small" />}
            onClick={(e) => setAddMenuAnchor(e.currentTarget)}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              py: 0.5,
              px: 1.5,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            Add Update
          </Button>
          <Menu
            anchorEl={addMenuAnchor}
            open={Boolean(addMenuAnchor)}
            onClose={() => setAddMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                setAddMenuAnchor(null);
                setSelectedTask(null);
                setModalType('task');
              }}
            >
              <ListItemIcon><TaskOutlined fontSize="small" /></ListItemIcon>
              <ListItemText>New Task</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAddMenuAnchor(null);
                setSelectedTask(null);
                setModalType('ci_update');
              }}
            >
              <ListItemIcon><BuildOutlined fontSize="small" /></ListItemIcon>
              <ListItemText>CI Update</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setAddMenuAnchor(null);
                setSelectedTask(null);
                setModalType('project_note');
              }}
            >
              <ListItemIcon><NoteAddOutlined fontSize="small" /></ListItemIcon>
              <ListItemText>Project Note</ListItemText>
            </MenuItem>
          </Menu>

          <Autocomplete
          multiple
          sx={{ minWidth: '200px', padding: '6px' }}
          value={filter}
          onChange={(_ev, values) => setFilter(values)}
          getOptionLabel={(opt) => `${opt.displayId} - ${opt.name}`}
          options={taskFilters}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Filter" />
          )}
        />
        </Box>
      </Box>

      {/* ── Task list area ────────────────────────────────────── */}
      <Box sx={{ bgcolor: 'background.default', display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {columns.length === 0 ? (
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
        ) : viewMode === 'horizontal' ? (
          <HorizontalKanban
            columns={columns}
            renderCard={(row) => <TaskCard row={row} />}
            onDragEnd={onDrag}
            onSelectCard={handleSelectCard}

          />
        ) : viewMode === 'table' ? (
          <TableView
            columns={columns}
            onSelectCard={handleSelectCard}
          />
        ) : viewMode === 'timeline' ? (
          <TimelineView
            columns={columns}
            onSelectCard={handleSelectCard}
            updateTask={updateTask}
            refetch={refetch}
          />
        ) : null}
        </Box>

        {/* ── My CIs collapsible section ────────────────────────── */}
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Button
            fullWidth
            size="small"
            onClick={() => setShowMyCIs(!showMyCIs)}
            sx={{
              textTransform: 'none',
              justifyContent: 'space-between',
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
              color: 'text.secondary',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BuildOutlined fontSize="small" />
              My Continuous Improvements ({myCIs.length})
            </Box>
            {showMyCIs ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </Button>
          <Collapse in={showMyCIs}>
            <Box sx={{ maxHeight: 200, overflow: 'auto', px: 2, pb: 1 }}>
              {myCIs.length === 0 ? (
                <Typography variant="caption" color="text.secondary" sx={{ py: 1, display: 'block' }}>
                  No CIs submitted yet. Use "Add Update → CI Update" to submit one.
                </Typography>
              ) : (
                myCIs.map((ci: any) => (
                  <Box
                    key={ci.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: 0.75,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" fontWeight="bold" color="text.secondary">
                        {ci.displayId}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {ci.title}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {ci.category && (
                        <Chip label={ci.category} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />
                      )}
                      <Chip
                        label={ci.status}
                        size="small"
                        sx={{
                          bgcolor:
                            ci.status === 'identified' ? '#9e9e9e' :
                            ci.status === 'in_progress' ? '#4caf50' :
                            ci.status === 'implemented' ? '#2196f3' :
                            ci.status === 'verified' ? '#9c27b0' :
                            ci.status === 'closed' ? '#757575' : '#9e9e9e',
                          color: 'white',
                          fontSize: '0.6rem',
                          height: 18,
                        }}
                      />
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Paper>
  );
};

export default Assignments;
