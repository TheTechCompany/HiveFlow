import React, { useContext } from "react";

export interface IEstimateSingle {
    projectId?: string;
    finishTtl?: number;
    
    tasks?: any[];
    refetch?: () => void;
    createTask?: any;
    updateTask?: any;
    updateTaskStatus?: (taskId: string, index: number, status: string) => void;
    deleteTask?: any;
    createDependency?: any;
    deleteDependency?: any;
}

export const EstimateSingleContext = React.createContext<IEstimateSingle>({
});

export const EstimateSingleProvider = EstimateSingleContext.Provider;

export const useProjectInfo = () => useContext(EstimateSingleContext)