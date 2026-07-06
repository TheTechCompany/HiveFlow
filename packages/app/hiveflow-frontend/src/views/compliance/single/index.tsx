import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import { PdfViewer } from './PdfViewer';

import {
  Autocomplete,
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
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as ViewIcon,
  ThumbUp as AcknowledgeIcon,
  ThumbDown as DeclineIcon,
  RateReview as ReviewIcon,
  Person as PersonIcon,
  PictureAsPdf as PdfIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AutoAwesome as AutoAwesomeIcon,
  PlayArrow as PlayArrowIcon,
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

interface Provision {
  kind: string;
  sectionRef: string;
  title: string;
  dlmId: string;
  heading?: string;
  text?: string;
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
  provisions: Provision[];
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
      provisions {
        kind
        sectionRef
        title
        dlmId
        heading
        text
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

  // ── Sort breakouts by sectionRef (natural sort: s.1 < s.10 < s.36) ──
  const sortedBreakouts = React.useMemo(() => {
    if (!regulation?.breakouts) return [];
    return [...regulation.breakouts].sort((a, b) =>
      a.sectionRef.localeCompare(b.sectionRef, undefined, { numeric: true, sensitivity: 'base' })
    );
  }, [regulation?.breakouts]);

  // ── Dialog state ─────────────────────────────────────────────
  const [breakoutDialogOpen, setBreakoutDialogOpen] = useState(false);
  const [editingBreakoutId, setEditingBreakoutId] = useState<string | null>(null);
  const [newSectionRef, setNewSectionRef] = useState('');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSummary, setNewSectionSummary] = useState('');
  const [newPageRef, setNewPageRef] = useState('');

  // ── Right pane tabs ──────────────────────────────────────────
  const [rightTab, setRightTab] = useState(0);

  // ── Provisions: collapsible parts ────────────────────────────
  const [expandedParts, setExpandedParts] = useState<Set<string>>(new Set());
  const togglePart = (label: string) => {
    setExpandedParts(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label); else next.add(label);
      return next;
    });
  };

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

  const CREATE_BREAKOUT_POINT = gql`
    mutation CreateBreakoutPoint($regulationId: ID!, $sectionRef: String!, $title: String!, $summary: String, $pageRef: Int) {
      createBreakoutPoint(regulationId: $regulationId, sectionRef: $sectionRef, title: $title, summary: $summary, pageRef: $pageRef) {
        id
        regulationId
        sectionRef
        title
        summary
        pageRef
        understanding
      }
    }
  `;

  const [ createBreakoutPoint ] = useMutation(CREATE_BREAKOUT_POINT);

  const UPDATE_BREAKOUT_POINT = gql`
    mutation UpdateBreakoutPoint($id: ID!, $sectionRef: String, $title: String, $summary: String, $pageRef: Int) {
      updateBreakoutPoint(id: $id, sectionRef: $sectionRef, title: $title, summary: $summary, pageRef: $pageRef) {
        id
        regulationId
        sectionRef
        title
        summary
        pageRef
        understanding
      }
    }
  `;

  const [ updateBreakoutPoint ] = useMutation(UPDATE_BREAKOUT_POINT);

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

  const EXPLAIN_PROVISION = gql`
    mutation ExplainProvision($sectionRef: String!, $title: String!, $text: String!, $heading: String) {
      explainProvision(sectionRef: $sectionRef, title: $title, text: $text, heading: $heading) {
        explanation
        example
      }
    }
  `;

  const [ explainProvision, { loading: explaining } ] = useMutation(EXPLAIN_PROVISION);

  // ── Review mode: step through provisions one at a time ───────
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [explanation, setExplanation] = useState<{ sectionRef: string; explanation: string; example?: string } | null>(null);

  const provisions = regulation?.provisions?.filter(p => p.kind === 'prov') || [];
  const currentProvision = provisions[reviewIndex];

  const handleExplain = async () => {
    if (!currentProvision || explaining) return;
    setExplanation(null);
    try {
      const { data } = await explainProvision({
        variables: {
          sectionRef: currentProvision.sectionRef,
          title: currentProvision.title,
          text: currentProvision.text || '',
          heading: currentProvision.heading || undefined,
        },
      });
      if (data?.explainProvision) {
        setExplanation({
          sectionRef: currentProvision.sectionRef,
          explanation: data.explainProvision.explanation,
          example: data.explainProvision.example,
        });
      }
    } catch (err: any) {
      console.warn('Explain failed:', err.message);
    }
  };

  const handleCreateBreakoutFromProvision = () => {
    if (!currentProvision) return;
    setEditingBreakoutId(null);
    setNewSectionRef(currentProvision.sectionRef);
    setNewSectionTitle(currentProvision.title);
    setNewSectionSummary(currentProvision.text?.slice(0, 200) || '');
    setNewPageRef('');
    setBreakoutDialogOpen(true);
  };

  const handleEditBreakout = (b: BreakoutPoint) => {
    setEditingBreakoutId(b.id);
    setNewSectionRef(b.sectionRef);
    setNewSectionTitle(b.title);
    setNewSectionSummary(b.summary || '');
    setNewPageRef(b.pageRef ? String(b.pageRef) : '');
    setBreakoutDialogOpen(true);
  };

  const handleSaveBreakout = async () => {
    if (!newSectionRef || !newSectionTitle) return;
    try {
      if (editingBreakoutId) {
        await updateBreakoutPoint({
          variables: {
            id: editingBreakoutId,
            sectionRef: newSectionRef,
            title: newSectionTitle,
            summary: newSectionSummary || undefined,
            pageRef: newPageRef ? parseInt(newPageRef) : null,
          },
        });
      } else {
        await createBreakoutPoint({
          variables: {
            regulationId: regulation.id,
            sectionRef: newSectionRef,
            title: newSectionTitle,
            summary: newSectionSummary || undefined,
            pageRef: newPageRef ? parseInt(newPageRef) : undefined,
          },
        });
      }
      refetch();
    } catch (err: any) {
      console.warn('Failed to save breakout point:', err.message);
    }
    setBreakoutDialogOpen(false);
    setEditingBreakoutId(null);
    setNewSectionRef('');
    setNewSectionTitle('');
    setNewSectionSummary('');
    setNewPageRef('');
  };

  const handleMarkViewed = async () => {
    if (!currentProvision || !regulation) return;
    // Create a quick proof entry via the acknowledgeBreakout pattern
    // For now, just advance — proof entries are created server-side
    if (reviewIndex < provisions.length - 1) {
      setReviewIndex(reviewIndex + 1);
      setExplanation(null);
    } else {
      setReviewMode(false);
    }
  };

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

  const handleSetUnderstanding = async (breakoutId: string, understanding: Understanding) => {
    try {
      await acknowledgeBreakout({
        variables: { id: breakoutId, understanding, userName: 'You' },
      });
      refetch();
    } catch (err: any) {
      console.warn('Failed to set understanding:', err.message);
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
                Breakout Points ({sortedBreakouts.length})
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" startIcon={<AddIcon />} onClick={() => { setEditingBreakoutId(null); setNewSectionRef(''); setNewSectionTitle(''); setNewSectionSummary(''); setNewPageRef(''); setBreakoutDialogOpen(true); }}>
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
            {sortedBreakouts.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No breakout points defined. Extract key sections to track understanding.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {sortedBreakouts.map((b) => (
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
                        <Tooltip title="Edit breakout point">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBreakout(b);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark as acknowledged">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetUnderstanding(b.id, 'acknowledged');
                            }}
                            sx={{ color: b.understanding === 'acknowledged' ? 'success.main' : 'action.disabled' }}
                          >
                            <AcknowledgeIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark as needs review">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetUnderstanding(b.id, 'needs-review');
                            }}
                            sx={{ color: b.understanding === 'needs-review' ? 'error.main' : 'action.disabled' }}
                          >
                            <DeclineIcon fontSize="small" />
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
            {/* ── Provisions (auto-extracted from legislation XML) ─── */}
            {regulation.provisions && regulation.provisions.length > 0 && (() => {
              const provCount = regulation.provisions.filter(p => p.kind === 'prov').length;
              const partCount = regulation.provisions.filter(p => p.kind === 'part').length;

              // Group provisions by part for collapsible sections
              const groups: Array<{ part: typeof regulation.provisions[0] | null; items: typeof regulation.provisions }> = [];
              let currentGroup: { part: typeof regulation.provisions[0] | null; items: typeof regulation.provisions } | null = null;
              for (const p of regulation.provisions) {
                if (p.kind === 'part') {
                  // Start a new part group
                  const group = { part: p, items: [] as typeof regulation.provisions };
                  groups.push(group);
                  currentGroup = group;
                } else {
                  if (!currentGroup) {
                    // Items before the first part
                    currentGroup = { part: null, items: [] };
                    groups.push(currentGroup);
                  }
                  currentGroup.items.push(p);
                }
              }

              return (
              <Box sx={{ mt: 1.5 }}>
                <Divider sx={{ mb: 1.5 }} />
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Provisions ({provCount} in {partCount} part{partCount !== 1 ? 's' : ''})
                  </Typography>
                  {provCount > 0 && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => { setReviewMode(true); setReviewIndex(0); setExplanation(null); }}
                    >
                      Start Review
                    </Button>
                  )}
                </Stack>
                <Stack spacing={0.5}>
                  {groups.map((group, gi) => {
                    if (group.part) {
                      const p = group.part;
                      const isExpanded = expandedParts.has(p.sectionRef);
                      // Count provisions in this part's items
                      const partProvs = group.items.filter(i => i.kind === 'prov').length;
                      return (
                        <Box key={`part-group-${p.sectionRef}`}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1,
                              cursor: 'pointer',
                              bgcolor: isExpanded ? 'primary.50' : 'background.paper',
                              borderColor: isExpanded ? 'primary.main' : 'divider',
                              '&:hover': { bgcolor: isExpanded ? 'primary.100' : 'grey.50' },
                            }}
                            onClick={() => togglePart(p.sectionRef)}
                          >
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {isExpanded ? <ExpandLessIcon fontSize="small" color="primary" /> : <ChevronRightIcon fontSize="small" color="action" />}
                              <Typography variant="subtitle2" fontWeight={700} color={isExpanded ? 'primary.main' : 'text.primary'}>
                                Part {p.sectionRef} — {p.title}
                              </Typography>
                              <Chip label={`${partProvs} provisions`} size="small" variant="outlined" sx={{ ml: 'auto' }} />
                            </Stack>
                          </Paper>
                          {isExpanded && group.items.length > 0 && (
                            <Box sx={{ ml: 2, mt: 0.5 }}>
                              <Stack spacing={0.5}>
                                {group.items.map((p) => {
                                  if (p.kind === 'subpart') {
                                    return (
                                      <Typography
                                        key={`subpart-${p.sectionRef}`}
                                        variant="body2"
                                        fontWeight={600}
                                        sx={{ mt: 0.5, mb: 0.25, color: 'text.primary' }}
                                      >
                                        Subpart {p.sectionRef} — {p.title}
                                      </Typography>
                                    );
                                  }
                                  if (p.kind === 'crosshead') {
                                    return (
                                      <Typography
                                        key={`crosshead-${p.title}`}
                                        variant="body2"
                                        fontStyle="italic"
                                        sx={{ mt: 0.5, mb: 0.25, color: 'text.secondary' }}
                                      >
                                        {p.title}
                                      </Typography>
                                    );
                                  }
                                  // provision card
                                  return (
                                  <Paper key={p.dlmId || `${p.sectionRef}-${p.title}`} variant="outlined" sx={{ p: 1.5 }}>
                                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                                      <Stack flex={1}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                          <Chip label={p.sectionRef} size="small" color="primary" variant="outlined" />
                                          <Typography variant="body2" fontWeight={600}>{p.title}</Typography>
                                        </Stack>
                                        {p.heading && (
                                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                                            {p.heading}
                                          </Typography>
                                        )}
                                        {p.text && (
                                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                                            {p.text.length > 280 ? p.text.slice(0, 280) + '…' : p.text}
                                          </Typography>
                                        )}
                                      </Stack>
                                    </Stack>
                                  </Paper>
                                  );
                                })}
                              </Stack>
                            </Box>
                          )}
                        </Box>
                      );
                    }
                    // Ungrouped items — wrap in collapsible section
                    const ungroupedProvs = group.items.filter(i => i.kind === 'prov').length;
                    const ungroupedLabel = partCount > 0
                      ? (gi === 0 ? 'Preliminary' : 'Schedules & Transitional')
                      : 'Provisions';
                    const ungroupedKey = `__ungrouped-${gi}`;
                    const ungroupedExpanded = expandedParts.has(ungroupedKey);
                    return (
                      <Box key={`ungrouped-${gi}`}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1, cursor: 'pointer',
                            bgcolor: ungroupedExpanded ? 'primary.50' : 'background.paper',
                            borderColor: ungroupedExpanded ? 'primary.main' : 'divider',
                            '&:hover': { bgcolor: ungroupedExpanded ? 'primary.100' : 'grey.50' },
                          }}
                          onClick={() => togglePart(ungroupedKey)}
                        >
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {ungroupedExpanded ? <ExpandLessIcon fontSize="small" color="primary" /> : <ChevronRightIcon fontSize="small" color="action" />}
                            <Typography variant="subtitle2" fontWeight={700} color={ungroupedExpanded ? 'primary.main' : 'text.primary'}>
                              {ungroupedLabel}
                            </Typography>
                            <Chip label={`${ungroupedProvs} provisions`} size="small" variant="outlined" sx={{ ml: 'auto' }} />
                          </Stack>
                        </Paper>
                        {ungroupedExpanded && group.items.length > 0 && (
                          <Box sx={{ ml: 2, mt: 0.5 }}>
                            <Stack spacing={0.5}>
                              {group.items.map((p) => {
                                if (p.kind === 'crosshead') {
                                  return (
                                    <Typography key={`ch-${p.title}`} variant="body2" fontStyle="italic" sx={{ color: 'text.secondary' }}>
                                      {p.title}
                                    </Typography>
                                  );
                                }
                                return (
                                  <Paper key={p.dlmId || `${p.sectionRef}-${p.title}`} variant="outlined" sx={{ p: 1.5 }}>
                                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                                      <Stack flex={1}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                          <Chip label={p.sectionRef} size="small" color="primary" variant="outlined" />
                                          <Typography variant="body2" fontWeight={600}>{p.title}</Typography>
                                        </Stack>
                                        {p.text && (
                                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                                            {p.text.length > 280 ? p.text.slice(0, 280) + '…' : p.text}
                                          </Typography>
                                        )}
                                      </Stack>
                                    </Stack>
                                  </Paper>
                                );
                              })}
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
              );
            })()}
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

      {/* ── Add/Edit Breakout Dialog ──────────────────────────────── */}
      <Dialog open={breakoutDialogOpen} onClose={() => { setBreakoutDialogOpen(false); setEditingBreakoutId(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBreakoutId ? 'Edit Breakout Point' : 'Add Breakout Point'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {regulation.provisions && regulation.provisions.length > 0 && (() => {
                const selectedProvision = regulation.provisions.find(
                  p => p.sectionRef === newSectionRef && p.title === newSectionTitle
                ) || null;
                return (
              <Autocomplete
                size="small"
                value={selectedProvision}
                options={regulation.provisions}
                getOptionLabel={(p) => `${p.sectionRef} — ${p.title}`}
                groupBy={(p) => p.kind === 'part' ? 'Parts' : 'Provisions'}
                isOptionEqualToValue={(opt, val) => opt.dlmId === val.dlmId}
                onChange={(_, val) => {
                  if (val) {
                    setNewSectionRef(val.sectionRef);
                    setNewSectionTitle(val.title);
                    if (!editingBreakoutId && val.text) {
                      setNewSectionSummary(val.text.slice(0, 200));
                    }
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Link to Provision (optional)" placeholder="Search provisions..." />
                )}
                renderOption={(props, opt) => (
                  <li {...props} key={opt.dlmId}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2" fontWeight={600}>{opt.sectionRef} — {opt.title}</Typography>
                      {opt.text && (
                        <Typography variant="caption" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 400 }}>
                          {opt.text.slice(0, 120)}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
              />
                );
              })()}
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
          <Button onClick={() => { setBreakoutDialogOpen(false); setEditingBreakoutId(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveBreakout} disabled={!newSectionRef || !newSectionTitle}>
            {editingBreakoutId ? 'Save Changes' : 'Add Breakout Point'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Review Mode Dialog ─────────────────────────────────── */}
      <Dialog
        open={reviewMode}
        onClose={() => setReviewMode(false)}
        maxWidth="md"
        fullWidth
      >
        {currentProvision ? (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip label={currentProvision.sectionRef} size="small" color="primary" variant="outlined" />
                <Typography variant="h6" sx={{ flex: 1 }}>{currentProvision.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {reviewIndex + 1} of {provisions.length}
                </Typography>
              </Stack>
              {currentProvision.heading && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {currentProvision.heading}
                </Typography>
              )}
            </DialogTitle>
            <DialogContent dividers>
              {/* Provision text */}
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                {currentProvision.text || 'No text available.'}
              </Typography>

              {/* Action buttons */}
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={handleExplain}
                  disabled={explaining}
                >
                  {explaining ? 'Explaining...' : 'Explain This'}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleCreateBreakoutFromProvision}
                >
                  + Breakout
                </Button>
              </Stack>

              {/* AI Explanation result */}
              {explanation && explanation.sectionRef === currentProvision.sectionRef && (
                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'info.50', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Plain-English Explanation
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {explanation.explanation}
                  </Typography>
                  {explanation.example && (
                    <>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Real-World Example
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {explanation.example}
                      </Typography>
                    </>
                  )}
                </Paper>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<ChevronLeftIcon />}
                disabled={reviewIndex === 0}
                onClick={() => { setReviewIndex(reviewIndex - 1); setExplanation(null); }}
              >
                Previous
              </Button>
              <Box sx={{ flex: 1 }} />
              <Button
                variant="outlined"
                color="success"
                onClick={handleMarkViewed}
              >
                ✓ Viewed
              </Button>
              <Button
                endIcon={<ChevronRightIcon />}
                variant="contained"
                disabled={reviewIndex >= provisions.length - 1}
                onClick={() => { setReviewIndex(reviewIndex + 1); setExplanation(null); }}
              >
                Next
              </Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent>
            <Typography variant="body1">No provisions available. Refresh the document first.</Typography>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};
