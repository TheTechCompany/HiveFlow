import React, { useContext } from 'react';

export interface BatchSingleContextValue {
    batchId: string;
    projectId: string;
    batch: any;
    items: any[];
    refetch: () => void;
}

export const BatchSingleContext = React.createContext<BatchSingleContextValue>({
    batchId: '',
    projectId: '',
    batch: null,
    items: [],
    refetch: () => {},
});

export const BatchSingleProvider = BatchSingleContext.Provider;
export const useBatchContext = () => useContext(BatchSingleContext);
