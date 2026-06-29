import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Paper, Typography, Button, TextField, IconButton } from '@mui/material';
import { Edit, Save } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import { BatchSingleProvider } from './context';
import { BatchSplitView } from './panes/SplitView';

const BATCH_QUERY = gql`
    query GetBatchDetail($id: ID!) {
        planBatch(id: $id) {
            id
            displayId
            title
            description
            status
            project {
                id
                displayId
                name
            }
            items {
                id
                parentItemId
                scheduledStart
                scheduledEnd
                estimatedHours
                rank
                notes
                task {
                    id
                    title
                    description
                    status
                    startDate
                    endDate
                }
                children {
                    id
                    parentItemId
                    scheduledStart
                    scheduledEnd
                    estimatedHours
                    rank
                    notes
                    task {
                        id
                        title
                        description
                        status
                        startDate
                        endDate
                    }
                    children {
                        id
                        parentItemId
                        scheduledStart
                        scheduledEnd
                        estimatedHours
                        rank
                        notes
                        task {
                            id
                            title
                            description
                            status
                            startDate
                            endDate
                        }
                        children {
                            id
                            parentItemId
                            scheduledStart
                            scheduledEnd
                            estimatedHours
                            rank
                            notes
                            task {
                                id
                                title
                                description
                                status
                                startDate
                                endDate
                            }
                        }
                    }
                }
            }
        }
    }
`;

const CHANGE_STATUS = gql`
    mutation UpdateBatchStatus($id: ID!, $input: PlanBatchUpdateInput!) {
        updatePlanBatch(id: $id, input: $input) {
            id
            status
        }
    }
`;

const UPDATE_BATCH = gql`
    mutation UpdateBatchTitle($id: ID!, $input: PlanBatchUpdateInput!) {
        updatePlanBatch(id: $id, input: $input) {
            id
            title
        }
    }
`;

const STATUS_FLOW: Record<string, { label: string; next?: string; color: string }> = {
    draft: { label: 'Draft', next: 'in_review', color: '#888' },
    in_review: { label: 'In Review', next: 'approved', color: '#f0ad4e' },
    approved: { label: 'Approved', next: 'released', color: '#5cb85c' },
    released: { label: 'Released', color: '#337ab7' },
};

export const BatchSingle: React.FC = () => {
    const { id: batchId } = useParams();

    const { data, refetch } = useQuery(BATCH_QUERY, {
        variables: { id: batchId },
        skip: !batchId,
    });

    const batch = data?.planBatch;
    const items = batch?.items || [];
    const loading = !batch && !data;

    const [changeStatus] = useMutation(CHANGE_STATUS);
    const [updateBatch] = useMutation(UPDATE_BATCH);

    const [editingTitle, setEditingTitle] = useState(false);
    const [titleDraft, setTitleDraft] = useState('');
    const hasAutoEdited = useRef(false);

    // ── Save-from-header state ───────────────────────────────────
    const saveFnRef = useRef<(() => Promise<void>) | null>(null);
    const [hasPending, setHasPending] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const registerSave = useCallback((fn: (() => Promise<void>) | null) => {
        saveFnRef.current = fn;
    }, []);

    const onPendingChange = useCallback((pending: boolean, saving: boolean) => {
        setHasPending(pending);
        setIsSaving(saving);
    }, []);

    const handleSave = useCallback(async () => {
        if (saveFnRef.current) {
            setIsSaving(true);
            try { await saveFnRef.current(); } catch {}
            setIsSaving(false);
        }
    }, []);

    // Auto-enable edit mode for freshly-created batches ("Untitled Batch")
    useEffect(() => {
        if (!hasAutoEdited.current && batch?.title === 'Untitled Batch') {
            setTitleDraft(batch.title);
            setEditingTitle(true);
            hasAutoEdited.current = true;
        }
    }, [batch?.title]);

    const advanceStatus = () => {
        const current = STATUS_FLOW[batch?.status];
        if (current?.next) {
            changeStatus({
                variables: {
                    id: batchId,
                    input: { status: current.next },
                },
            }).then(() => refetch());
        }
    };

    const handleSaveTitle = () => {
        if (titleDraft.trim() && titleDraft.trim() !== batch?.title) {
            updateBatch({
                variables: {
                    id: batchId,
                    input: { title: titleDraft.trim() },
                },
            }).then(() => refetch());
        }
        setEditingTitle(false);
    };

    const statusCfg = STATUS_FLOW[batch?.status] || STATUS_FLOW.draft;

    return (
        <BatchSingleProvider
            value={{
                batchId: batchId || '',
                projectId: batch?.project?.displayId || batch?.project?.id,
                batch,
                items,
                refetch,
                registerSave,
                onPendingChange,
            }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header bar */}
                <Paper
                    sx={{
                        display: 'flex',
                        bgcolor: 'secondary.main',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px', padding: '6px' }}>
                        {batch ? (
                            editingTitle ? (
                                <TextField
                                    size="small"
                                    variant="standard"
                                    autoFocus
                                    defaultValue={batch.title}
                                    onChange={(e) => setTitleDraft(e.target.value)}
                                    onBlur={handleSaveTitle}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveTitle();
                                        if (e.key === 'Escape') setEditingTitle(false);
                                    }}
                                    inputProps={{ style: { color: 'inherit', fontWeight: 'bold' } }}
                                />
                            ) : (
                                <>
                                    <Box
                                        sx={{
                                            background: statusCfg.color,
                                            color: 'white',
                                            padding: '1px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            flexShrink: 0,
                                        }}>
                                        {statusCfg.label}
                                    </Box>
                                    <Typography color="navigation.main" fontWeight="bold">
                                        {batch.project?.displayId} / Batch — {batch.title}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setTitleDraft(batch.title);
                                            setEditingTitle(true);
                                        }}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </>
                            )
                        ) : (
                            <Typography color="navigation.main" fontWeight="bold">
                                New Batch
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '6px' }}>
                        {hasPending && (
                            <Button
                                size="small"
                                variant="contained"
                                color="warning"
                                startIcon={<Save />}
                                disabled={isSaving}
                                onClick={handleSave}
                            >
                                {isSaving ? 'Saving…' : 'Save All'}
                            </Button>
                        )}
                    </Box>
                </Paper>

                {/* Split view: tree + Gantt */}
                <Paper sx={{ flex: 1, display: 'flex', marginTop: '4px', overflow: 'hidden' }}>
                    <BatchSplitView />
                </Paper>
            </Box>
        </BatchSingleProvider>
    );
};
