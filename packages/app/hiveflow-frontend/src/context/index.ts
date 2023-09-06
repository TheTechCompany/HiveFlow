import React from 'react';

export interface HiveFlowConfiguration {
    type: string;
    create: boolean;
    update: boolean;
    read: boolean;
    delete: boolean;
}
export const HiveFlowContext = React.createContext<{
    config?: HiveFlowConfiguration[];
}>({})


export const HiveFlowProvider = HiveFlowContext.Provider

export const useConfiguration = () => React.useContext(HiveFlowContext)

export const useTypeConfiguration = (type: string) => {
    const conf = useConfiguration();
    return conf?.config?.find((a) => a.type == type);
}