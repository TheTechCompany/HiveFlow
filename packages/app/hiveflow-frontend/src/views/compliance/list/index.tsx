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
  MenuItem,
  Stack,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Gavel as GavelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { DataTable } from '@hive-flow/ui';
import moment from 'moment';

// ── Types ───────────────────────────────────────────────────────

type RegulationType = 'act' | 'regulation' | 'code' | 'standard';
type LinkStatus = 'verified' | 'stale' | 'broken' | 'unchecked';

interface RegulationVersion {
  id: string;
  regulationId: string;
  version: number;
  changes: string;
  file?: string;
  createdAt: string;
}

interface BreakoutPoint {
  id: string;
  regulationId: string;
  sectionRef: string;
  title: string;
  summary: string;
  understanding: 'acknowledged' | 'pending' | 'needs-review';
  reviewedBy?: string;
  reviewedAt?: string;
}

interface ProofEntry {
  id: string;
  regulationId: string;
  userName: string;
  action: 'viewed' | 'acknowledged' | 'reviewed';
  timestamp: string;
}

interface Regulation {
  id: string;
  title: string;
  description: string;
  type: RegulationType;
  source: string;
  category: string;
  isoClause?: string;
  status: 'active' | 'under-review' | 'superseded' | 'draft';
  linkStatus: LinkStatus;
  storedHash?: string;
  lastVerifiedAt?: string;
  currentVersion: number;
  versions: RegulationVersion[];
  breakouts: BreakoutPoint[];
  proofs: ProofEntry[];
  createdAt: string;
  updatedAt: string;
}

// ── Constants ───────────────────────────────────────────────────

const REGULATION_TYPES: { value: RegulationType; label: string }[] = [
  { value: 'act', label: 'Act' },
  { value: 'regulation', label: 'Regulation' },
  { value: 'code', label: 'Code of Practice' },
  { value: 'standard', label: 'Standard' },
];

const CATEGORIES = [
  'Health & Safety',
  'Environmental',
  'Privacy & Data',
  'Employment',
  'Financial',
  'Building & Construction',
  'Transport',
  'Energy',
];

const LINK_STATUS_ICONS: Record<LinkStatus, React.ReactNode> = {
  verified: <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />,
  stale: <ScheduleIcon sx={{ fontSize: 16, color: '#ff9800' }} />,
  broken: <ErrorIcon sx={{ fontSize: 16, color: '#f44336' }} />,
  unchecked: <ScheduleIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />,
};

// ── Seed data ───────────────────────────────────────────────────

const SEED_REGULATIONS: Regulation[] = [
  {
    id: 'r1',
    title: 'Health and Safety at Work Act 2015',
    description: 'Primary legislation governing workplace health and safety in New Zealand.',
    type: 'act',
    source: 'https://legislation.govt.nz/act/public/2015/0070/latest/DLM5976660.html',
    category: 'Health & Safety',
    isoClause: 'ISO 45001 §4.1',
    status: 'active',
    linkStatus: 'verified',
    storedHash: 'abc123def',
    lastVerifiedAt: '2025-06-15T10:30:00Z',
    currentVersion: 2,
    versions: [
      { id: 'v1', regulationId: 'r1', version: 1, changes: 'Initial upload', createdAt: '2025-01-10T08:00:00Z' },
      { id: 'v2', regulationId: 'r1', version: 2, changes: 'Updated to reflect 2024 amendment', createdAt: '2025-06-15T10:30:00Z' },
    ],
    breakouts: [
      { id: 'b1', regulationId: 'r1', sectionRef: 's.36', title: 'Primary duty of care', summary: 'PCBU must ensure health and safety of workers and others affected by work, so far as reasonably practicable.', understanding: 'acknowledged', reviewedBy: 'Alice Chang', reviewedAt: '2025-06-16T09:00:00Z' },
      { id: 'b2', regulationId: 'r1', sectionRef: 's.37', title: 'Duty to notify of notifiable event', summary: 'PCBU must notify regulator immediately of notifiable events (death, serious injury, incident).', understanding: 'pending' },
      { id: 'b3', regulationId: 'r1', sectionRef: 's.44', title: 'Duty to consult workers', summary: 'PCBU must consult with workers on health and safety matters, including H&S representatives.', understanding: 'acknowledged', reviewedBy: 'Bob Matthews', reviewedAt: '2025-05-20T14:00:00Z' },
    ],
    proofs: [
      { id: 'p1', regulationId: 'r1', userName: 'Alice Chang', action: 'viewed', timestamp: '2025-06-16T09:00:00Z' },
      { id: 'p2', regulationId: 'r1', userName: 'Alice Chang', action: 'acknowledged', timestamp: '2025-06-16T09:05:00Z' },
      { id: 'p3', regulationId: 'r1', userName: 'Bob Matthews', action: 'viewed', timestamp: '2025-05-20T14:00:00Z' },
    ],
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-06-15T10:30:00Z',
  },
  {
    id: 'r2',
    title: 'Privacy Act 2020',
    description: 'Governs the collection, use, storage, and disclosure of personal information.',
    type: 'act',
    source: 'https://legislation.govt.nz/act/public/2020/0031/latest/LMS23223.html',
    category: 'Privacy & Data',
    isoClause: 'ISO 27001 §A.18.1.4',
    status: 'active',
    linkStatus: 'verified',
    storedHash: 'def456ghi',
    lastVerifiedAt: '2025-06-10T11:00:00Z',
    currentVersion: 1,
    versions: [
      { id: 'v3', regulationId: 'r2', version: 1, changes: 'Initial upload', createdAt: '2025-02-20T09:00:00Z' },
    ],
    breakouts: [
      { id: 'b4', regulationId: 'r2', sectionRef: 'IPPs 1-4', title: 'Collection of personal information', summary: 'Only collect necessary information directly from the individual, with transparency about purpose.', understanding: 'needs-review' },
      { id: 'b5', regulationId: 'r2', sectionRef: 'IPP 5', title: 'Storage and security', summary: 'Personal information must be protected by reasonable security safeguards against loss, misuse, and unauthorised access.', understanding: 'pending' },
    ],
    proofs: [
      { id: 'p4', regulationId: 'r2', userName: 'Alice Chang', action: 'viewed', timestamp: '2025-06-10T11:00:00Z' },
    ],
    createdAt: '2025-02-20T09:00:00Z',
    updatedAt: '2025-06-10T11:00:00Z',
  },
  {
    id: 'r3',
    title: 'Resource Management Act 1991',
    description: 'Governs land use, resource consents, and environmental impact management.',
    type: 'act',
    source: 'https://legislation.govt.nz/act/public/1991/0069/latest/DLM230265.html',
    category: 'Environmental',
    isoClause: 'ISO 14001 §6.1.2',
    status: 'under-review',
    linkStatus: 'stale',
    storedHash: 'ghi789jkl',
    lastVerifiedAt: '2025-03-01T08:00:00Z',
    currentVersion: 1,
    versions: [
      { id: 'v4', regulationId: 'r3', version: 1, changes: 'Initial upload', createdAt: '2025-03-01T08:00:00Z' },
    ],
    breakouts: [
      { id: 'b6', regulationId: 'r3', sectionRef: 's.9', title: 'Restricted discretionary activities', summary: 'Activities that require resource consent where council discretion is restricted to specific matters.', understanding: 'pending' },
    ],
    proofs: [],
    createdAt: '2025-03-01T08:00:00Z',
    updatedAt: '2025-03-01T08:00:00Z',
  },
  {
    id: 'r4',
    title: 'Electricity (Safety) Regulations 2010',
    description: 'Prescribes safety requirements for electrical works and equipment.',
    type: 'regulation',
    source: 'https://legislation.govt.nz/regulation/public/2010/0036/latest/DLM2776601.html',
    category: 'Energy',
    isoClause: 'ISO 45001 §8.1.2',
    status: 'active',
    linkStatus: 'unchecked',
    currentVersion: 1,
    versions: [
      { id: 'v5', regulationId: 'r4', version: 1, changes: 'Initial upload', createdAt: '2025-04-15T10:00:00Z' },
    ],
    breakouts: [],
    proofs: [],
    createdAt: '2025-04-15T10:00:00Z',
    updatedAt: '2025-04-15T10:00:00Z',
  },
  {
    id: 'r5',
    title: 'Building Code (Schedule 1 of Building Regulations 1992)',
    description: 'Performance-based code setting minimum standards for building work in New Zealand.',
    type: 'code',
    source: 'https://www.building.govt.nz/building-code-compliance/',
    category: 'Building & Construction',
    status: 'active',
    linkStatus: 'verified',
    lastVerifiedAt: '2025-05-28T15:00:00Z',
    currentVersion: 1,
    versions: [
      { id: 'v6', regulationId: 'r5', version: 1, changes: 'Initial upload', createdAt: '2025-01-05T13:00:00Z' },
    ],
    breakouts: [
      { id: 'b7', regulationId: 'r5', sectionRef: 'B1', title: 'Structure', summary: 'Buildings must withstand the combination of loads they are likely to experience.', understanding: 'acknowledged', reviewedBy: 'Chris Turner', reviewedAt: '2025-05-28T15:00:00Z' },
      { id: 'b8', regulationId: 'r5', sectionRef: 'C1-C6', title: 'Fire safety', summary: 'Protect occupants, fire service, and neighbouring property from fire hazard.', understanding: 'acknowledged', reviewedBy: 'Chris Turner', reviewedAt: '2025-05-28T15:00:00Z' },
    ],
    proofs: [
      { id: 'p5', regulationId: 'r5', userName: 'Chris Turner', action: 'viewed', timestamp: '2025-05-28T15:00:00Z' },
      { id: 'p6', regulationId: 'r5', userName: 'Chris Turner', action: 'acknowledged', timestamp: '2025-05-28T15:05:00Z' },
    ],
    createdAt: '2025-01-05T13:00:00Z',
    updatedAt: '2025-05-28T15:00:00Z',
  },
];

// ── Helpers ─────────────────────────────────────────────────────

function breakoutChip(breakouts: BreakoutPoint[]): string {
  const pending = breakouts.filter((b) => b.understanding === 'pending').length;
  const needs = breakouts.filter((b) => b.understanding === 'needs-review').length;
  if (needs > 0) return `${needs} need review`;
  if (pending > 0) return `${breakouts.length} / ${pending} pending`;
  if (breakouts.length === 0) return '—';
  return `${breakouts.length} all done`;
}

// ── Main ────────────────────────────────────────────────────────

export const ComplianceList: React.FC = () => {
  const navigate = useNavigate();
  const [regulations, setRegulations] = useState<Regulation[]>(SEED_REGULATIONS);
  const [dialogOpen, setDialogOpen] = useState(false);

  // ── Add form state ──────────────────────────────────────────
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<RegulationType>('act');
  const [formSource, setFormSource] = useState('');
  const [formCategory, setFormCategory] = useState('Health & Safety');

  const handleAdd = () => {
    const now = new Date().toISOString();
    const id = `r-${Date.now()}`;
    const newReg: Regulation = {
      id,
      title: formTitle,
      description: formDescription,
      type: formType,
      source: formSource,
      category: formCategory,
      status: 'draft',
      linkStatus: 'unchecked',
      currentVersion: 1,
      versions: [{ id: `v-${Date.now()}`, regulationId: id, version: 1, changes: 'Created', createdAt: now }],
      breakouts: [],
      proofs: [],
      createdAt: now,
      updatedAt: now,
    };
    setRegulations((prev) => [newReg, ...prev]);
    setDialogOpen(false);
    setFormTitle('');
    setFormDescription('');
    setFormSource('');
    setFormType('act');
    setFormCategory('Health & Safety');
  };

  const columns = [
    {
      header: 'Title',
      property: 'title' as const,
      render: (row: Regulation) => (
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {row.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.type.toUpperCase()} · {row.category}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'Status',
      property: 'status' as const,
      width: '130px',
      render: (row: Regulation) => {
        const val = row.status;
        const colors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
          active: 'success',
          'under-review': 'warning',
          superseded: 'error',
          draft: 'default',
        };
        return <Chip label={val} size="small" color={colors[val]} variant="outlined" />;
      },
    },
    {
      header: 'Link',
      property: 'linkStatus' as const,
      width: '110px',
      render: (row: Regulation) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {LINK_STATUS_ICONS[row.linkStatus]}
          <Typography variant="caption">{row.linkStatus}</Typography>
        </Stack>
      ),
    },
    {
      header: 'Breakout Points',
      property: 'breakouts' as const,
      width: '160px',
      render: (row: Regulation) => (
        <Typography variant="caption">{breakoutChip(row.breakouts)}</Typography>
      ),
    },
    {
      header: 'Last Verified',
      property: 'lastVerifiedAt' as const,
      width: '140px',
      render: (row: Regulation) =>
        row.lastVerifiedAt ? <Typography variant="caption">{moment(row.lastVerifiedAt).format('D MMM YYYY')}</Typography> : <Typography variant="caption" color="text.secondary">—</Typography>,
    },
  ];

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1, overflow: 'hidden' }}>
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <GavelIcon color="primary" />
              <Typography variant="h6">Compliance Management</Typography>
            </Stack>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
              Add Regulation
            </Button>
          </Stack>
        </Box>
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <DataTable
            order="asc"
            columns={columns}
            data={regulations}
            onClickRow={(row: Regulation) => navigate(row.id)}
          />
        </Box>
      </Paper>

      {/* ── Add Regulation Dialog ──────────────────────────────── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Regulation</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Health and Safety at Work Act 2015"
              size="small"
              fullWidth
            />
            <TextField
              label="Description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Brief description of the regulation"
              size="small"
              multiline
              rows={2}
              fullWidth
            />
            <TextField
              select
              label="Type"
              value={formType}
              onChange={(e) => setFormType(e.target.value as RegulationType)}
              size="small"
              fullWidth
            >
              {REGULATION_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Source URL"
              value={formSource}
              onChange={(e) => setFormSource(e.target.value)}
              placeholder="https://legislation.govt.nz/..."
              size="small"
              fullWidth
            />
            <TextField
              select
              label="Category"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              size="small"
              fullWidth
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!formTitle}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
