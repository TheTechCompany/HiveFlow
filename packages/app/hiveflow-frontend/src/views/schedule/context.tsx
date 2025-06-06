import { createContext, useContext } from "react";
import { Horizon } from "../../components/Schedule";

export const ScheduleRootContext = createContext<{
    events?: any[];
    rowOptions?: any[];
    
    people?: any[];
    horizon?: Horizon;

    graphType?: string;
}>({

})

export const ScheduleRootProvider : any = ScheduleRootContext.Provider;

export const useRootSchedule = () => useContext(ScheduleRootContext);