import React, { useContext } from "react";

export interface IProjectSingle {
    projectId?: string;
}

export const ProjectSingleContext = React.createContext<IProjectSingle>({
});

export const ProjectSingleProvider = ProjectSingleContext.Provider;

export const useProjectInfo = () => useContext(ProjectSingleContext)