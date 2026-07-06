import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import { gql, useQuery, useMutation } from '@apollo/client';
import { DataTable } from '@hive-flow/ui';
import { BatchHeader } from './header';
import { BatchModal, BatchFormData } from '../../../modals/batch';

export interface BatchListProps {
    projectId?: string;
}

export const BatchList: React.FC<BatchListProps> = ({ projectId }) => {
    const [modalOpen, openModal] = useState(false);
    const [selected, setSelected] = useState<BatchFormData>();
    const [filter, setFilter] = useState<any>({});
    const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
    const [property, setProperty] = useState<string>('createdAt');

    const navigate = useNavigate();

    const { data, refetch } = useQuery(
        gql`
            query GetBatches($projectId: String) {
                planBatches(projectId: $projectId) {
                    id
                    displayId
                    title
                    description
                    status
                    createdAt
                    items {
                        id
                    }
                }
            }
        `,
        {
            variables: { projectId },
            fetchPolicy: 'cache-and-network',
        },
    );

    const batches = data?.planBatches || [];

    const [createBatch] = useMutation(
        gql`
            mutation CreateBatch($input: PlanBatchInput!) {
                createPlanBatch(input: $input) {
                    id
                    title
                    status
                }
            }
        `,
        { refetchQueries: ['GetBatches'] },
    );

    const [updateBatch] = useMutation(
        gql`
            mutation UpdateBatch($id: ID!, $input: PlanBatchUpdateInput!) {
                updatePlanBatch(id: $id, input: $input) {
                    id
                }
            }
        `,
        { refetchQueries: ['GetBatches'] },
    );

    const [deleteBatch] = useMutation(
        gql`
            mutation DeleteBatch($id: ID!) {
                deletePlanBatch(id: $id) {
                    id
                }
            }
        `,
        { refetchQueries: ['GetBatches'] },
    );

    const handleCreate = async () => {
        const result = await createBatch({
            variables: {
                input: {
                    title: 'Untitled Batch',
                    projectId,
                },
            },
        });
        const newId = result?.data?.createPlanBatch?.id;
        if (newId) {
            navigate(`${newId}`);
        }
    };

    const getFiltered = () => {
        let items = batches.map((b: any) => ({
            id: b.id,
            displayId: b.displayId || b.id?.slice(0, 8),
            title: b.title,
            description: b.description,
            status: b.status,
            taskCount: b.items?.length || 0,
            createdAt: b.createdAt,
        }));

        if (filter.status) {
            items = items.filter((i: any) => i.status === filter.status);
        }
        if (filter.search) {
            const s = filter.search.toLowerCase();
            items = items.filter((i: any) =>
                i.title?.toLowerCase().includes(s),
            );
        }

        if (property && direction) {
            items = items.sort((a: any, b: any) => {
                const va = a[property] ?? '';
                const vb = b[property] ?? '';
                return direction === 'asc'
                    ? String(va).localeCompare(String(vb), undefined, { numeric: true })
                    : String(vb).localeCompare(String(va), undefined, { numeric: true });
            });
        }

        return items;
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'draft': return '#888';
            case 'in_review': return '#f0ad4e';
            case 'approved': return '#5cb85c';
            case 'released': return '#337ab7';
            default: return '#888';
        }
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <BatchModal
                open={modalOpen}
                selected={selected}
                onClose={() => {
                    openModal(false);
                    setSelected(undefined);
                }}
                onDelete={() => {
                    if (selected?.id) {
                        deleteBatch({ variables: { id: selected.id } }).then(() => {
                            openModal(false);
                            setSelected(undefined);
                        });
                    }
                }}
                onSubmit={(batch) => {
                    if (!batch.id) return;
                    updateBatch({
                        variables: {
                            id: batch.id,
                            input: {
                                title: batch.title,
                                description: batch.description,
                                reviewer: batch.reviewer,
                            },
                        },
                    }).then(() => {
                        openModal(false);
                        setSelected(undefined);
                    });
                }}
            />

            <BatchHeader
                onCreate={handleCreate}
                filter={filter}
                onFilterChange={setFilter}
            />

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
                        { property: 'displayId', header: 'ID', size: 'xsmall', sortable: true },
                        { property: 'title', header: 'Title', width: '40%', sortable: true },
                        {
                            property: 'status',
                            header: 'Status',
                            size: 'small',
                            align: 'center',
                            render: (item: any) => (
                                <span
                                    style={{
                                        background: statusColor(item.status),
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        fontSize: '0.75rem',
                                    }}>
                                    {item.status?.replace('_', ' ')}
                                </span>
                            ),
                        },
                        { property: 'taskCount', header: 'Tasks', size: 'xsmall', align: 'center' },
                    ]}
                    onEditRow={(batch) => {
                        setSelected(batch);
                        openModal(true);
                    }}
                    onClickRow={(batch) => navigate(`${batch.id}`)}
                    data={getFiltered()}
                />
            </Paper>
        </Box>
    );
};
