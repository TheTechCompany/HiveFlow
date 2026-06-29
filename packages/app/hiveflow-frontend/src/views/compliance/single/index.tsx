import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { PdfViewer } from './PdfViewer';

import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  Gavel as GavelIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  OpenInNew,
  Upload as UploadIcon,
  VerifiedUser,
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  ThumbUp as AcknowledgeIcon,
  RateReview as ReviewIcon,
  Person as PersonIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import moment from 'moment';

// ── Types (mirror list view) ─────────────────────────────────────

type RegulationType = 'act' | 'regulation' | 'code' | 'standard';
type LinkStatus = 'verified' | 'stale' | 'broken' | 'unchecked';
type Understanding = 'acknowledged' | 'pending' | 'needs-review';

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
  pageRef?: number;
  understanding: Understanding;
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
  pdfUrl?: string;
  storedPdf?: string;
  storedMarkdown?: string;
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

// ── Seed data (shared ref — same as list) ────────────────────────

const SEED_REGULATIONS: Regulation[] = [
  {
    id: 'r1',
    title: 'Health and Safety at Work Act 2015',
    description: 'Primary legislation governing workplace health and safety in New Zealand.',
    type: 'act',
    source: 'https://legislation.govt.nz/act/public/2015/0070/latest/DLM5976660.html',
    storedMarkdown: `## Health and Safety at Work Act 2015

### Part 1 — Preliminary provisions

The main purpose of this Act is to provide for a balanced framework to secure the health and safety of workers and workplaces.

### s.36 — Primary duty of care

A PCBU must ensure, so far as is reasonably practicable, the health and safety of workers who work for the PCBU, while the workers are at work in the business or undertaking.

This includes providing and maintaining a work environment that is without risks to health and safety, and ensuring safe plant and structures, safe systems of work, and adequate facilities.

### s.37 — Duty to notify of notifiable event

A PCBU must ensure that the regulator is notified immediately after becoming aware that a notifiable event arising out of the conduct of the business or undertaking has occurred.

### s.44 — Duty to consult workers

A PCBU must, so far as is reasonably practicable, consult with workers who carry out work for the business or undertaking who are directly affected by a health and safety matter.

### Part 2 — Health and safety duties

- (1) A person conducting a business or undertaking must ensure the health and safety of workers
- (2) Duty extends to other persons affected by the work
- (3) Multiple duties may apply concurrently

### s.58 — Requirement to preserve sites

A person with management or control of a workplace must ensure, so far as is reasonably practicable, that the site where a notifiable event has occurred is not disturbed until authorised by an inspector.`,
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
      { id: 'b1', regulationId: 'r1', sectionRef: 's.36', title: 'Primary duty of care', summary: 'PCBU must ensure health and safety of workers and others affected by work, so far as reasonably practicable.', pageRef: 24, understanding: 'acknowledged', reviewedBy: 'Alice Chang', reviewedAt: '2025-06-16T09:00:00Z' },
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

// ── Icons ────────────────────────────────────────────────────────

const UNDERSTANDING_ICONS: Record<Understanding, React.ReactNode> = {
  acknowledged: <CheckCircleIcon sx={{ fontSize: 18, color: '#4caf50' }} />,
  pending: <ScheduleIcon sx={{ fontSize: 18, color: '#ff9800' }} />,
  'needs-review': <ErrorIcon sx={{ fontSize: 18, color: '#f44336' }} />,
};

const UNDERSTANDING_LABELS: Record<Understanding, string> = {
  acknowledged: 'Acknowledged',
  pending: 'Pending',
  'needs-review': 'Needs Review',
};

const LINK_STATUS_LABELS: Record<LinkStatus, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  verified: { label: 'Verified', color: 'success' },
  stale: { label: 'Stale', color: 'warning' },
  broken: { label: 'Broken', color: 'error' },
  unchecked: { label: 'Unchecked', color: 'default' },
};

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  active: 'success',
  'under-review': 'warning',
  superseded: 'error',
  draft: 'default',
};

const PROOF_ICONS: Record<ProofEntry['action'], React.ReactNode> = {
  viewed: <ViewIcon sx={{ fontSize: 16, color: '#1976d2' }} />,
  acknowledged: <AcknowledgeIcon sx={{ fontSize: 16, color: '#4caf50' }} />,
  reviewed: <ReviewIcon sx={{ fontSize: 16, color: '#9c27b0' }} />,
};

// ── Main ────────────────────────────────────────────────────────

export const ComplianceSingle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [regulations, setRegulations] = useState<Regulation[]>(SEED_REGULATIONS);

  const regulation = regulations.find((r) => r.id === id);

  // ── Dialog state ─────────────────────────────────────────────
  const [breakoutDialogOpen, setBreakoutDialogOpen] = useState(false);
  const [newSectionRef, setNewSectionRef] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSummary, setNewSectionSummary] = useState('');
  const [newPageRef, setNewPageRef] = useState('');

  // ── Right pane tabs ──────────────────────────────────────────
  const [rightTab, setRightTab] = useState(0);

  // ── Fetch versions from legislation API ──────────────────────
  const [fetchingVersions, setFetchingVersions] = useState(false);
  const handleFetchVersions = useCallback(async () => {
    if (!regulation) return;
    setFetchingVersions(true);
    try {
      // Parse source URL: /act/public/2015/0070/latest/DLM5976660.html
      const match = regulation.source.match(/\/(act|regulation|bill)\/public\/(\d+)\/(\d+)\//);
      if (!match) throw new Error('Cannot parse legislation URL');
      const [, legType, year, number] = match;
      const apiUrl = `https://www.legislation.govt.nz/${legType}/public/${year}/${number}/versions.json`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      const fetchedVersions: RegulationVersion[] = (data.versions || []).map((v: any, i: number) => ({
        id: `api-v-${i}`,
        regulationId: regulation.id,
        version: v.version || i + 1,
        changes: v.title || `Version as at ${v.date || 'unknown date'}`,
        createdAt: v.date || new Date().toISOString(),
      }));
      if (fetchedVersions.length > 0) {
        setRegulations((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, versions: fetchedVersions, currentVersion: fetchedVersions.length } : r,
          ),
        );
      }
    } catch (err: any) {
      console.warn('Failed to fetch versions:', err.message);
    } finally {
      setFetchingVersions(false);
    }
  }, [regulation, id]);

  // ── PDF viewer ───────────────────────────────────────────────
  const [showPdf, setShowPdf] = useState(false);
  const [pdfPage, setPdfPage] = useState<number | null>(null);
  const [caching, setCaching] = useState(false);

  const pdfUrl = regulation?.storedPdf || regulation?.source.replace(/DLM\d+\.html$/, 'whole.pdf');

  const CACHE_REGULATION_PDF = gql`
    mutation CacheRegulationPdf($id: ID!, $url: String!) {
      cacheRegulationPdf(id: $id, url: $url) {
        pdfUrl
        markdown
      }
    }
  `;

  const [ cacheRegulationPdf ] = useMutation(CACHE_REGULATION_PDF);

  const GENERATE_BREAKOUTS = gql`
    mutation GenerateBreakoutPoints($id: ID!) {
      generateBreakoutPoints(id: $id) {
        id
        regulationId
        sectionRef
        title
        summary
        understanding
      }
    }
  `;

  const [ generateBreakouts, { loading: generating } ] = useMutation(GENERATE_BREAKOUTS);

  const handleCachePdf = async () => {
    if (!regulation || regulation.storedPdf) return;
    setCaching(true);
    try {
      const url = regulation.source.replace(/DLM\d+\.html$/, 'whole.pdf');
      const { data } = await cacheRegulationPdf({
        variables: { id: regulation.id, url },
      });
      if (data?.cacheRegulationPdf) {
        setRegulations((prev) =>
          prev.map((r) =>
            r.id === id ? {
              ...r,
              storedPdf: data.cacheRegulationPdf.pdfUrl,
              storedMarkdown: data.cacheRegulationPdf.markdown,
            } : r,
          ),
        );
      }
    } catch (err: any) {
      console.warn('Failed to cache PDF:', err.message);
    } finally {
      setCaching(false);
    }
  };

  // ── Simulate verifying link ──────────────────────────────────
  const [verifying, setVerifying] = useState(false);
  const handleVerify = useCallback(() => {
    setVerifying(true);
    setTimeout(() => {
      setRegulations((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, linkStatus: 'verified' as LinkStatus, lastVerifiedAt: new Date().toISOString() }
            : r,
        ),
      );
      setVerifying(false);
    }, 800);
  }, [id]);

  if (!regulation) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Regulation not found</Typography>
        <Button onClick={() => navigate('/compliance')} sx={{ mt: 2 }}>Back to Compliance</Button>
      </Box>
    );
  }

  const handleAddBreakout = () => {
    if (!newSectionRef || !newSectionTitle) return;
    const breakout: BreakoutPoint = {
      id: `b-${Date.now()}`,
      regulationId: regulation.id,
      sectionRef: newSectionRef,
      title: newSectionTitle,
      summary: newSectionSummary,
      pageRef: newPageRef ? parseInt(newPageRef) : undefined,
      understanding: 'pending',
    };
    setRegulations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, breakouts: [...r.breakouts, breakout] } : r,
      ),
    );
    setBreakoutDialogOpen(false);
    setNewSectionRef('');
    setNewSectionTitle('');
    setNewSectionSummary('');
    setNewPageRef('');
  };

  const handleToggleUnderstanding = (breakoutId: string) => {
    setRegulations((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          breakouts: r.breakouts.map((b) => {
            if (b.id !== breakoutId) return b;
            const cycle: Understanding[] = ['pending', 'acknowledged', 'needs-review'];
            const next = cycle[(cycle.indexOf(b.understanding) + 1) % cycle.length];
            return {
              ...b,
              understanding: next,
              ...(next === 'acknowledged' ? { reviewedBy: 'You', reviewedAt: new Date().toISOString() } : {}),
            };
          }),
        };
      }),
    );
  };

  const handleAddProof = (action: ProofEntry['action']) => {
    setRegulations((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return {
          ...r,
          proofs: [
            ...r.proofs,
            { id: `p-${Date.now()}`, regulationId: r.id, userName: 'You', action, timestamp: new Date().toISOString() },
          ],
        };
      }),
    );
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, overflow: 'auto' }}>
      <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'auto', minHeight: 0 }}>
          {/* ── Left: Header, Source, Breakout Points ────────────── */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 2, borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ flexShrink: 0 }}>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <IconButton onClick={() => navigate('/compliance')} size="small">
                <ArrowBack />
              </IconButton>
              <Stack flex={1} spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GavelIcon color="primary" />
                  <Typography variant="h6">{regulation.title}</Typography>
                  <Chip label={regulation.status} size="small" color={STATUS_COLORS[regulation.status]} variant="outlined" />
                  <Chip label={regulation.type.toUpperCase()} size="small" variant="outlined" />
                </Stack>
                <Typography variant="body2" color="text.secondary">{regulation.description}</Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip icon={<ScheduleIcon />} label={`Category: ${regulation.category}`} size="small" variant="outlined" />
                  {regulation.isoClause && <Chip label={regulation.isoClause} size="small" variant="outlined" />}
                </Stack>
              </Stack>
            </Stack>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="subtitle2" fontWeight={600} gutterBottom>Source</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Link href={regulation.source} target="_blank" underline="hover" sx={{ flex: 1, wordBreak: 'break-all' }}>
                <Typography variant="body2">{regulation.source}</Typography>
              </Link>
              <Tooltip title="Open legislation.govt.nz">
                <IconButton size="small" onClick={() => window.open(regulation.source, '_blank')}>
                  <OpenInNew fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
              <Chip
                label={LINK_STATUS_LABELS[regulation.linkStatus].label}
                size="small"
                color={LINK_STATUS_LABELS[regulation.linkStatus].color}
              />
              {regulation.lastVerifiedAt && (
                <Typography variant="caption" color="text.secondary">
                  Last verified: {moment(regulation.lastVerifiedAt).format('D MMM YYYY, h:mm a')}
                </Typography>
              )}
              <Button
                size="small"
                variant="outlined"
                startIcon={verifying ? <CircularProgress size={14} /> : <RefreshIcon />}
                onClick={handleVerify}
                disabled={verifying}
              >
                {verifying ? 'Verifying...' : 'Verify Link'}
              </Button>
              <Button size="small" variant="outlined" startIcon={<UploadIcon />} component="label">
                Upload PDF
                <input type="file" accept="application/pdf" hidden onChange={() => {}} />
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={regulation.storedMarkdown ? <VerifiedUser /> : <PdfIcon />}
                onClick={() => setShowPdf(!showPdf)}
                color={showPdf ? 'primary' : 'inherit'}
                disabled={!regulation.storedPdf && !regulation.storedMarkdown}
              >
                {showPdf ? 'Hide' : regulation.storedMarkdown ? 'View Legislation' : 'View PDF'}
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={caching ? <CircularProgress size={14} /> : <VerifiedUser />}
                onClick={handleCachePdf}
                disabled={caching || !!regulation.storedPdf}
                color={regulation.storedPdf ? 'success' : 'inherit'}
              >
                {regulation.storedPdf ? 'PDF Cached' : caching ? 'Caching...' : 'Cache PDF'}
              </Button>
            </Stack>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>

            <Divider sx={{ my: 1.5 }} />

            {showPdf && regulation.storedMarkdown && (
              <Box sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, p: 2, maxHeight: 250, overflow: 'auto', bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>Legislation Content</Typography>
                {regulation.storedMarkdown.split('\n\n').map((block, i) => {
                  const trimmed = block.trim();
                  if (!trimmed) return null;
                  if (trimmed.startsWith('## ')) {
                    return <Typography key={i} variant="h6" sx={{ mt: 2, mb: 1 }}>{trimmed.slice(3)}</Typography>;
                  }
                  if (trimmed.startsWith('### ')) {
                    return <Typography key={i} variant="subtitle1" fontWeight={600} sx={{ mt: 1.5, mb: 0.5 }}>{trimmed.slice(4)}</Typography>;
                  }
                  if (trimmed.startsWith('- ')) {
                    return <Typography key={i} variant="body2" sx={{ pl: 2, py: 0.25 }}>• {trimmed.slice(2)}</Typography>;
                  }
                  return <Typography key={i} variant="body2" sx={{ mb: 1 }}>{trimmed}</Typography>;
                })}
              </Box>
            )}
            {showPdf && !regulation.storedMarkdown && regulation.storedPdf && (
              <Box sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden', height: 500 }}>
                <PdfViewer
                  pdfUrl={pdfUrl}
                  initialPage={pdfPage}
                  height={500}
                />
              </Box>
            )}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Breakout Points ({regulation.breakouts.length})
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" startIcon={<AddIcon />} onClick={() => setBreakoutDialogOpen(true)}>
                  Add Point
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  disabled={generating || !regulation.storedMarkdown}
                  onClick={async () => {
                    try {
                      const { data } = await generateBreakouts({
                        variables: { id: regulation.id },
                      });
                      if (data?.generateBreakoutPoints) {
                        setRegulations((prev) =>
                          prev.map((r) =>
                            r.id === id
                              ? { ...r, breakouts: [...r.breakouts, ...data.generateBreakoutPoints] }
                              : r,
                          ),
                        );
                      }
                    } catch (err: any) {
                      console.warn('Failed to generate breakouts:', err.message);
                    }
                  }}
                >
                  {generating ? 'Generating...' : 'AI Generate'}
                </Button>
              </Stack>
            </Stack>
            {regulation.breakouts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No breakout points defined. Extract key sections to track understanding.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {regulation.breakouts.map((b) => (
                  <Paper
                    key={b.id}
                    variant="outlined"
                    sx={{ p: 1.5, cursor: 'pointer' }}
                    onClick={() => handleToggleUnderstanding(b.id)}
                  >
                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                      <Box sx={{ mt: 0.3 }}>{UNDERSTANDING_ICONS[b.understanding]}</Box>
                      <Stack flex={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip label={b.sectionRef} size="small" color="primary" variant="outlined" />
                          <Typography variant="body2" fontWeight={600}>{b.title}</Typography>
                          {b.pageRef && (
                            <Chip label={`p.${b.pageRef}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                          )}
                          <Chip
                            label={UNDERSTANDING_LABELS[b.understanding]}
                            size="small"
                            color={b.understanding === 'acknowledged' ? 'success' : b.understanding === 'needs-review' ? 'error' : 'warning'}
                            variant="outlined"
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{b.summary}</Typography>
                        {b.reviewedBy && (
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                            <PersonIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                              {b.reviewedBy} — {b.reviewedAt ? moment(b.reviewedAt).format('D MMM YYYY') : ''}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                      <Tooltip title={b.pageRef ? `Jump to page ${b.pageRef} in PDF` : 'Jump to legislation section'}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (b.pageRef) {
                              setShowPdf(true);
                              setPdfPage(b.pageRef);
                            } else {
                              window.open(regulation.source, '_blank');
                            }
                          }}
                        >
                          <OpenInNew fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
            </Box>
          </Box>

          {/* ── Right: Tabs (Versions / Understanding Log) ─────────── */}
          <Box sx={{ width: 320, overflow: 'auto', p: 2, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            <Tabs value={rightTab} onChange={(_, v) => setRightTab(v)} sx={{ mb: 1, minHeight: 36 }}>
              <Tab label="Versions" sx={{ minHeight: 36, py: 0 }} />
              <Tab label="Log" sx={{ minHeight: 36, py: 0 }} />
            </Tabs>
            {rightTab === 0 && (
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>Versions</Typography>
                  <Chip label={`v${regulation.currentVersion} current`} size="small" color="primary" variant="outlined" />
                </Stack>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleFetchVersions}
                  disabled={fetchingVersions}
                  startIcon={fetchingVersions ? <CircularProgress size={14} /> : <RefreshIcon />}
                  sx={{ mb: 1 }}
                  fullWidth
                >
                  {fetchingVersions ? 'Fetching...' : 'Fetch from legislation.govt'}
                </Button>
                {regulation.versions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No version history.</Typography>
                ) : (
                  <List dense disablePadding>
                    {regulation.versions.map((v) => (
                      <ListItem key={v.id} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <VerifiedUser sx={{ fontSize: 18, color: v.version === regulation.currentVersion ? '#4caf50' : '#9e9e9e' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Version ${v.version} — ${v.changes}`}
                          secondary={moment(v.createdAt).format('D MMM YYYY, h:mm a')}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
            {rightTab === 1 && (
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Understanding Log ({regulation.proofs.length})
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                  <Button size="small" startIcon={<ViewIcon />} onClick={() => handleAddProof('viewed')}>
                    Viewed
                  </Button>
                  <Button size="small" startIcon={<AcknowledgeIcon />} onClick={() => handleAddProof('acknowledged')}>
                    Understand
                  </Button>
                </Stack>
                {regulation.proofs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No viewing proofs recorded.
                  </Typography>
                ) : (
                  <List dense disablePadding>
                    {regulation.proofs.map((p) => (
                      <ListItem key={p.id} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>{PROOF_ICONS[p.action]}</ListItemIcon>
                        <ListItemText
                          primary={`${p.userName} ${p.action}`}
                          secondary={moment(p.timestamp).format('D MMM YYYY, h:mm a')}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Paper>

      {/* ── Add Breakout Dialog ──────────────────────────────────── */}
      <Dialog open={breakoutDialogOpen} onClose={() => setBreakoutDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Breakout Point</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Section Reference"
              value={newSectionRef}
              onChange={(e) => setNewSectionRef(e.target.value)}
              placeholder="e.g. s.36 or IPP 5"
              size="small"
              fullWidth
            />
            <TextField
              label="Title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="e.g. Primary duty of care"
              size="small"
              fullWidth
            />
            <TextField
              label="Summary / What we need to know"
              value={newSectionSummary}
              onChange={(e) => setNewSectionSummary(e.target.value)}
              placeholder="Key requirements and practical implications..."
              size="small"
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="PDF Page (optional)"
              value={newPageRef}
              onChange={(e) => setNewPageRef(e.target.value)}
              placeholder="e.g. 42"
              size="small"
              type="number"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBreakoutDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBreakout} disabled={!newSectionRef || !newSectionTitle}>
            Add Breakout Point
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
