import React, { useContext } from 'react';

export interface BatchSingleContextValue {
    batchId: string;
    projectId: string;
    batch: any;
    items: any[];
    refetch: () => void;
    /** Called by SplitView to register the save function */
    registerSave: (saveFn: (() => Promise<void>) | null) => void;
    /** Called by SplitView when pending-changes state changes */
    onPendingChange: (hasPending: boolean, saving: boolean) => void;
}

const noop = () => {};

export const BatchSingleContext = React.createContext<BatchSingleContextValue>({
    batchId: '',
    projectId: '',
    batch: null,
    items: [],
    refetch: () => {},
    registerSave: noop,
    onPendingChange: noop,
});

export const BatchSingleProvider = BatchSingleContext.Provider;
export const useBatchContext = () => useContext(BatchSingleContext);
