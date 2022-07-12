import React, { useContext } from "react";

export interface IProjectSingle {
    projectId?: string;
    tasks?: any[];
    refetch?: () => void;
    createTask?: any;
    updateTask?: any;
    updateTaskStatus?: (taskId: string, status: string) => void;
    deleteTask?: any;
    createDependency?: any;
    deleteDependency?: any;
}

export const ProjectSingleContext = React.createContext<IProjectSingle>({
});

export const ProjectSingleProvider = ProjectSingleContext.Provider;

export const useProjectInfo = () => useContext(ProjectSingleContext)