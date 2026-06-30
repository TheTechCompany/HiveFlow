import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
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
  markdownSnippet?: string | null;
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

const GET_REGULATION = gql`
  query GetRegulation($id: ID!) {
    complianceRegulation(id: $id) {
      id
      title
      description
      type
      source
      storedPdf
      storedMarkdown
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
        pageRef
        markdownSnippet
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

export const ComplianceSingle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, refetch } = useQuery(GET_REGULATION, {
    variables: { id },
    skip: !id,
  });

  const regulation: Regulation | undefined = data?.complianceRegulation;

  // ── Dialog state ─────────────────────────────────────────────
  const [breakoutDialogOpen, setBreakoutDialogOpen] = useState(false);
  const [newSectionRef, setNewSectionRef] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSummary, setNewSectionSummary] = useState('');
  const [newPageRef, setNewPageRef] = useState('');

  // ── Right pane tabs ──────────────────────────────────────────
  const [rightTab, setRightTab] = useState(0);

  // ── Selected breakout for snippet display ────────────────────
  const [selectedBreakout, setSelectedBreakout] = useState<string | null>(null);

  // ── Fetch versions from legislation API ──────────────────────
  // ── PDF viewer ───────────────────────────────────────────────
  const [showPdf, setShowPdf] = useState(false);
  const [pdfPage, setPdfPage] = useState<number | null>(null);

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

  const ACKNOWLEDGE_BREAKOUT = gql`
    mutation AcknowledgeBreakout($id: ID!, $understanding: String!, $userName: String!) {
      acknowledgeBreakout(id: $id, understanding: $understanding, userName: $userName) {
        id
        understanding
        reviewedBy
        reviewedAt
      }
    }
  `;

  const [ acknowledgeBreakout ] = useMutation(ACKNOWLEDGE_BREAKOUT);

  const FETCH_REGULATION_VERSIONS = gql`
    mutation FetchRegulationVersions($id: ID!, $source: String!) {
      fetchRegulationVersions(id: $id, source: $source) {
        id
        version
        changes
        createdAt
      }
    }
  `;

  const [ fetchRegulationVersions ] = useMutation(FETCH_REGULATION_VERSIONS);

  // ── Refresh: re-fetch PDF + versions + verify link ────────────
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(async () => {
    if (!regulation) return;
    setRefreshing(true);
    try {
      await cacheRegulationPdf({
        variables: { id: regulation.id, url: regulation.source },
      });
      // Also fetch version history from the legislation API
      await fetchRegulationVersions({
        variables: { id: regulation.id, source: regulation.source },
      });
      refetch();
    } catch (err: any) {
      console.warn('Refresh failed:', err.message);
    } finally {
      setRefreshing(false);
    }
  }, [regulation, cacheRegulationPdf, refetch]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

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
    refetch();
    setBreakoutDialogOpen(false);
    setNewSectionRef('');
    setNewSectionTitle('');
    setNewSectionSummary('');
    setNewPageRef('');
  };

  const handleToggleUnderstanding = async (breakoutId: string) => {
    const breakout = regulation?.breakouts?.find((b: any) => b.id === breakoutId);
    if (!breakout) return;
    const cycle: Understanding[] = ['pending', 'acknowledged', 'needs-review'];
    const next = cycle[(cycle.indexOf(breakout.understanding) + 1) % cycle.length];
    try {
      await acknowledgeBreakout({
        variables: { id: breakoutId, understanding: next, userName: 'You' },
      });
      refetch();
    } catch (err: any) {
      console.warn('Failed to acknowledge breakout:', err.message);
    }
  };

  const handleAddProof = (_action: ProofEntry['action']) => {
    // Proof entries are created server-side via acknowledgeBreakout.
    // For standalone proof creation, a dedicated mutation is needed (future).
    refetch();
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
                startIcon={refreshing ? <CircularProgress size={14} /> : <RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
                color={regulation.storedPdf ? 'success' : 'inherit'}
              >
                {refreshing ? 'Refreshing...' : regulation.storedPdf ? 'Refresh' : 'Cache & Verify'}
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
                        refetch();
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
                  <Box key={b.id}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 1.5, cursor: 'pointer' }}
                      onClick={() => setSelectedBreakout(selectedBreakout === b.id ? null : b.id)}
                    >
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <Box sx={{ mt: 0.3 }}>{UNDERSTANDING_ICONS[b.understanding]}</Box>
                        <Stack flex={1}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Chip label={b.sectionRef} size="small" color="primary" variant="outlined" />
                            <Typography variant="body2" fontWeight={600}>{b.title}</Typography>
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
                        <Tooltip title="Toggle understanding">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleUnderstanding(b.id);
                            }}
                          >
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                    {/* ── Markdown snippet ──────────────────────── */}
                    {selectedBreakout === b.id && b.markdownSnippet && (
                      <Paper
                        variant="outlined"
                        sx={{
                          mt: 0.5,
                          p: 1.5,
                          bgcolor: 'grey.50',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          whiteSpace: 'pre-wrap',
                          maxHeight: 200,
                          overflow: 'auto',
                          borderColor: 'primary.light',
                        }}
                      >
                        {b.markdownSnippet}
                      </Paper>
                    )}
                  </Box>
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
