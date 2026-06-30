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
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Gavel as GavelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { DataTable } from '@hive-flow/ui';
import { gql, useQuery, useMutation } from '@apollo/client';
import moment from 'moment';

// ── GraphQL ────────────────────────────────────────────────────

const COMPLIANCE_REGULATIONS = gql`
  query ComplianceRegulations {
    complianceRegulations {
      id
      title
      description
      type
      source
      category
      isoClause
      status
      linkStatus
      lastVerifiedAt
      currentVersion
      createdAt
      updatedAt
      versions {
        id
        version
        changes
        createdAt
      }
      breakouts {
        id
        sectionRef
        title
        summary
        understanding
        reviewedBy
        reviewedAt
      }
      proofs {
        id
        userName
        action
        timestamp
      }
    }
  }
`;

const INFER_REGULATION = gql`
  mutation InferRegulation($source: String!, $title: String) {
    inferRegulation(source: $source, title: $title) {
      id
      title
      description
      type
      source
      category
      status
      linkStatus
      currentVersion
      createdAt
      updatedAt
      versions {
        id
        version
        changes
        createdAt
      }
      breakouts {
        id
        sectionRef
        title
        summary
        understanding
      }
      proofs {
        id
        userName
        action
        timestamp
      }
    }
  }
`;

// ── Types ───────────────────────────────────────────────────────

type LinkStatus = 'verified' | 'stale' | 'broken' | 'unchecked';

interface Regulation {
  id: string;
  title: string;
  description: string;
  type: string;
  source: string;
  category: string;
  isoClause?: string;
  status: string;
  linkStatus: LinkStatus;
  lastVerifiedAt?: string;
  currentVersion: number;
  versions: any[];
  breakouts: any[];
  proofs: any[];
  createdAt: string;
  updatedAt: string;
}

// ── Constants ───────────────────────────────────────────────────

const LINK_STATUS_ICONS: Record<LinkStatus, React.ReactNode> = {
  verified: <CheckCircleIcon sx={{ fontSize: 16, color: '#4caf50' }} />,
  stale: <ScheduleIcon sx={{ fontSize: 16, color: '#ff9800' }} />,
  broken: <ErrorIcon sx={{ fontSize: 16, color: '#f44336' }} />,
  unchecked: <ScheduleIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />,
};

// ── Helpers ─────────────────────────────────────────────────────

function breakoutChip(breakouts: any[]): string {
  if (!breakouts || breakouts.length === 0) return '—';
  const pending = breakouts.filter((b: any) => b.understanding === 'pending').length;
  const needs = breakouts.filter((b: any) => b.understanding === 'needs-review').length;
  if (needs > 0) return `${needs} need review`;
  if (pending > 0) return `${breakouts.length} / ${pending} pending`;
  return `${breakouts.length} all done`;
}

// ── Main ────────────────────────────────────────────────────────

export const ComplianceList: React.FC = () => {
  const navigate = useNavigate();

  // Data
  const { data, loading, error, refetch } = useQuery(COMPLIANCE_REGULATIONS);
  const [inferRegulation, { loading: inferLoading }] = useMutation(INFER_REGULATION, {
    onCompleted: () => refetch(),
  });

  const regulations: Regulation[] = data?.complianceRegulations || [];

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formSource, setFormSource] = useState('');
  const [formTitle, setFormTitle] = useState('');

  const handleAdd = async () => {
    if (!formSource) return;
    try {
      await inferRegulation({
        variables: {
          source: formSource,
          title: formTitle || undefined,
        },
      });
      setDialogOpen(false);
      setFormSource('');
      setFormTitle('');
    } catch (err) {
      console.error('Failed to infer regulation:', err);
    }
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
            {row.type?.toUpperCase()} · {row.category}
          </Typography>
        </Box>
      ),
    },
    {
      header: 'Status',
      property: 'status' as const,
      width: '120px',
      render: (row: Regulation) => {
        const val = row.status;
        const colors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
          active: 'success',
          'under-review': 'warning',
          superseded: 'error',
          draft: 'default',
        };
        return <Chip label={val} size="small" color={colors[val] || 'default'} variant="outlined" />;
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
        row.lastVerifiedAt ? (
          <Typography variant="caption">{moment(row.lastVerifiedAt).format('D MMM YYYY')}</Typography>
        ) : (
          <Typography variant="caption" color="text.secondary">—</Typography>
        ),
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
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Typography color="error">Failed to load regulations: {error.message}</Typography>
            </Box>
          ) : (
            <DataTable
              order="asc"
              columns={columns}
              data={regulations}
              onClickRow={(row: Regulation) => navigate(row.id)}
            />
          )}
        </Box>
      </Paper>

      {/* ── Add Regulation Dialog ──────────────────────────────── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Regulation</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Source URL"
              value={formSource}
              onChange={(e) => setFormSource(e.target.value)}
              placeholder="https://legislation.govt.nz/..."
              helperText="Paste a link to the legislation — we'll fetch it and fill in the details automatically."
              size="small"
              fullWidth
              required
            />
            <TextField
              label="Title (optional)"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Leave blank to auto-detect"
              size="small"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!formSource || inferLoading}>
            {inferLoading ? <CircularProgress size={20} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
