import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import { DataTable } from '@hive-flow/ui';
import { gql, useQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import { ScheduleHeader } from './header';

// ── GraphQL ────────────────────────────────────────────────────

const GET_SCHEDULES = gql`
  query GetSchedules {
    recurringSchedules {
      id
      name
      description
      eventCount
      events {
        id
        name
        frequency
        startDate
      }
    }
  }
`;

const CREATE_SCHEDULE = gql`
  mutation CreateSchedule($input: RecurringScheduleInput!) {
    createRecurringSchedule(input: $input) {
      id
      name
      description
    }
  }
`;

const UPDATE_SCHEDULE = gql`
  mutation UpdateSchedule($id: ID!, $input: RecurringScheduleUpdateInput!) {
    updateRecurringSchedule(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

const DELETE_SCHEDULE = gql`
  mutation DeleteSchedule($id: ID!) {
    deleteRecurringSchedule(id: $id) {
      id
    }
  }
`;

// ── Types ───────────────────────────────────────────────────────

interface RecurringEvent {
  id: string;
  scheduleId: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  assignedTo?: string;
}

interface Schedule {
  id: string;
  name: string;
  description: string;
  eventCount: number;
  events: RecurringEvent[];
}

const FREQUENCIES: { value: RecurringEvent['frequency']; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

function nextOccurrence(event: RecurringEvent): Date {
  const start = moment(event.startDate);
  const now = moment();
  if (now.isBefore(start)) return start.toDate();
  const diff = now.diff(start, 'minutes');
  let periods = 0;
  switch (event.frequency) {
    case 'daily': periods = Math.floor(diff / (24 * 60)); break;
    case 'weekly': periods = Math.floor(diff / (7 * 24 * 60)); break;
    case 'monthly': periods = Math.floor(moment.duration(now.diff(start)).asMonths()); break;
    case 'quarterly': periods = Math.floor(moment.duration(now.diff(start)).asMonths() / 3); break;
    case 'yearly': periods = Math.floor(moment.duration(now.diff(start)).asYears()); break;
  }
  const next = moment(start);
  switch (event.frequency) {
    case 'daily': next.add(periods + 1, 'days'); break;
    case 'weekly': next.add(periods + 1, 'weeks'); break;
    case 'monthly': next.add(periods + 1, 'months'); break;
    case 'quarterly': next.add((periods + 1) * 3, 'months'); break;
    case 'yearly': next.add(periods + 1, 'years'); break;
  }
  return next.toDate();
}

function upcomingLabel(events: RecurringEvent[]): string {
  if (!events || events.length === 0) return '—';
  const soonest = events
    .map((e) => ({ event: e, next: nextOccurrence(e) }))
    .sort((a, b) => a.next.getTime() - b.next.getTime())[0];
  return `${soonest.event.name} — ${moment(soonest.next).format('D MMM')}`;
}

// ── Main ────────────────────────────────────────────────────────

export const ScheduleList: React.FC = () => {
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(GET_SCHEDULES, {
    fetchPolicy: 'cache-and-network',
  });

  const [createSchedule] = useMutation(CREATE_SCHEDULE, {
    refetchQueries: ['GetSchedules'],
  });

  const [updateSchedule] = useMutation(UPDATE_SCHEDULE, {
    refetchQueries: ['GetSchedules'],
  });

  const [deleteSchedule] = useMutation(DELETE_SCHEDULE, {
    refetchQueries: ['GetSchedules'],
  });

  const schedules: Schedule[] = data?.recurringSchedules || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [property, setProperty] = useState('name');
  const [search, setSearch] = useState('');

  const openCreate = () => {
    setEditingSchedule(null);
    setFormName('');
    setFormDesc('');
    setModalOpen(true);
  };

  const openEdit = (s: Schedule) => {
    setEditingSchedule(s);
    setFormName(s.name);
    setFormDesc(s.description || '');
    setModalOpen(true);
  };

  const save = async () => {
    if (!formName.trim()) return;
    if (editingSchedule) {
      await updateSchedule({
        variables: {
          id: editingSchedule.id,
          input: { name: formName.trim(), description: formDesc.trim() },
        },
      });
    } else {
      await createSchedule({
        variables: {
          input: { name: formName.trim(), description: formDesc.trim() },
        },
      });
    }
    setModalOpen(false);
    setEditingSchedule(null);
  };

  const handleDelete = async (id: string) => {
    await deleteSchedule({ variables: { id } });
  };

  const rows = schedules
    .filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()))
    .map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      eventCount: s.eventCount ?? s.events?.length ?? 0,
      frequencies: s.events?.length
        ? [...new Set(s.events.map((e) => FREQUENCIES.find((f) => f.value === e.frequency)?.label ?? e.frequency))].join(', ')
        : '—',
      nextUp: upcomingLabel(s.events),
    }));

  const sorted = [...rows].sort((a: any, b: any) => {
    const va = a[property] ?? '';
    const vb = b[property] ?? '';
    return direction === 'asc'
      ? String(va).localeCompare(String(vb), undefined, { numeric: true })
      : String(vb).localeCompare(String(va), undefined, { numeric: true });
  });

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <ScheduleHeader
        search={search}
        onSearchChange={setSearch}
        onCreate={openCreate}
      />

      {/* ── DataTable ───────────────────────────────────────── */}
      <Paper sx={{ flex: 1, display: 'flex', marginTop: '3px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Typography color="error">Failed to load schedules: {error.message}</Typography>
          </Box>
        ) : (
          <DataTable
            order={direction}
            orderBy={property}
            onSort={(_property) => {
              if (property === _property) {
                setDirection(direction === 'asc' ? 'desc' : 'asc');
              } else {
                setProperty(_property);
                setDirection('asc');
              }
            }}
            columns={[
              { property: 'name', header: 'Name', width: '30%', sortable: true },
              { property: 'description', header: 'Description', width: '25%' },
              { property: 'eventCount', header: 'Events', size: 'xsmall', align: 'center' },
              { property: 'frequencies', header: 'Frequencies', size: 'small' },
              { property: 'nextUp', header: 'Next Up', size: 'medium' },
            ]}
            onEditRow={(schedule) => openEdit(schedule)}
            onClickRow={(schedule) => navigate(`${schedule.id}`)}
            data={sorted}
          />
        )}
      </Paper>

      {/* ── Create / Edit schedule dialog ────────────────────── */}
      <Dialog
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSchedule(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSchedule ? 'Edit Schedule' : 'New Schedule'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
              fullWidth
              size="small"
              placeholder="e.g. ISO 27001 Audit, SOC 2 Compliance"
            />
            <TextField
              label="Description"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              multiline
              rows={2}
              fullWidth
              size="small"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModalOpen(false);
              setEditingSchedule(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={!formName.trim()}>
            {editingSchedule ? 'Save Changes' : 'Create Schedule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
