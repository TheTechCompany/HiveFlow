import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import { Add as AddIcon, Repeat as RepeatIcon } from '@mui/icons-material';
import { DataTable } from '@hive-flow/ui';
import moment from 'moment';

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
  if (events.length === 0) return '—';
  const soonest = events
    .map((e) => ({ event: e, next: nextOccurrence(e) }))
    .sort((a, b) => a.next.getTime() - b.next.getTime())[0];
  return `${soonest.event.name} — ${moment(soonest.next).format('D MMM')}`;
}

// ── Seed data ───────────────────────────────────────────────────

const SEED_SCHEDULES: Schedule[] = [
  {
    id: 's1',
    name: 'ISO 27001 Audit',
    description: 'Annual information security management audit cycle',
    events: [
      { id: 'e1', scheduleId: 's1', name: 'Risk assessment review', description: 'Review and update risk register', frequency: 'quarterly', startDate: '2025-01-15', assignedTo: 'Security Team' },
      { id: 'e2', scheduleId: 's1', name: 'Internal audit evidence collection', description: 'Gather evidence for Annex A controls', frequency: 'yearly', startDate: '2025-03-01', assignedTo: 'Audit Committee' },
      { id: 'e3', scheduleId: 's1', name: 'Management review meeting', description: 'Formal ISMS management review', frequency: 'yearly', startDate: '2025-06-01', assignedTo: 'CISO' },
      { id: 'e4', scheduleId: 's1', name: 'External audit prep', description: 'Prepare for external auditor', frequency: 'yearly', startDate: '2025-09-01', assignedTo: 'Security Team' },
    ],
  },
  {
    id: 's2',
    name: 'SOC 2 Compliance',
    description: 'Annual SOC 2 Type II control monitoring',
    events: [
      { id: 'e5', scheduleId: 's2', name: 'Access control review', description: 'Review system access, remove stale accounts', frequency: 'monthly', startDate: '2025-01-05', assignedTo: 'IT Operations' },
      { id: 'e6', scheduleId: 's2', name: 'Change management audit', description: 'Audit change requests against policy', frequency: 'weekly', startDate: '2025-01-06', assignedTo: 'Engineering Lead' },
      { id: 'e7', scheduleId: 's2', name: 'Vendor security review', description: 'Review third-party vendor posture', frequency: 'quarterly', startDate: '2025-02-01', assignedTo: 'Procurement' },
      { id: 'e8', scheduleId: 's2', name: 'Backup & DR test', description: 'Test backup restoration and DR plan', frequency: 'quarterly', startDate: '2025-03-15', assignedTo: 'Platform Team' },
    ],
  },
  {
    id: 's3',
    name: 'Equipment Maintenance',
    description: 'Routine maintenance checks',
    events: [
      { id: 'e9', scheduleId: 's3', name: 'Safety inspection', description: 'Monthly safety inspection', frequency: 'monthly', startDate: '2025-01-01', assignedTo: 'Operations' },
      { id: 'e10', scheduleId: 's3', name: 'Calibration check', description: 'Verify measurement instruments', frequency: 'quarterly', startDate: '2025-02-15', assignedTo: 'Quality Assurance' },
    ],
  },
];

// ── Main ────────────────────────────────────────────────────────

export const ScheduleList: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(SEED_SCHEDULES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [property, setProperty] = useState('name');

  const navigate = useNavigate();

  const openCreate = () => {
    setEditingSchedule(null);
    setFormName('');
    setFormDesc('');
    setModalOpen(true);
  };

  const openEdit = (s: Schedule) => {
    setEditingSchedule(s);
    setFormName(s.name);
    setFormDesc(s.description);
    setModalOpen(true);
  };

  const save = () => {
    if (!formName.trim()) return;
    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id ? { ...s, name: formName.trim(), description: formDesc.trim() } : s,
        ),
      );
    } else {
      setSchedules((prev) => [
        ...prev,
        { id: String(Date.now()), name: formName.trim(), description: formDesc.trim(), events: [] },
      ]);
    }
    setModalOpen(false);
    setEditingSchedule(null);
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const rows = schedules.map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    eventCount: s.events.length,
    frequencies: [...new Set(s.events.map((e) => FREQUENCIES.find((f) => f.value === e.frequency)?.label ?? e.frequency))].join(', '),
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
      {/* ── Header ──────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RepeatIcon sx={{ color: 'navigation.main' }} />
          <Typography sx={{ color: 'navigation.main' }} fontWeight="bold" variant="h6">
            Schedules
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ textTransform: 'none' }}
        >
          New Schedule
        </Button>
      </Box>

      {/* ── DataTable ───────────────────────────────────────── */}
      <Paper sx={{ flex: 1, display: 'flex', marginTop: '3px' }}>
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
