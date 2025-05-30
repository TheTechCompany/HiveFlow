import { createContext, useContext, useState } from "react";

export const ScheduleContext = createContext<{
    timelineSize?: any;
    timelinePosition?: any;

    tool?: any,
    changeTool?: (tool: any) => void;

    horizon?: Date;

    step?: string;
    stepCount?: number;

    selected?: any[];
    changeSelection?: (selected: any[]) => void;

    createEvent?: (event: any) => void;
    updateEvent?: (event: any, uiUpdate?: boolean) => void;


    onClickEvent?: (event: any) => void;
    onDoubleClickEvent?: (event: any) => void;
}>({

})

const Provider: any = ScheduleContext.Provider

export const ScheduleProvider = (props: any) =>
    <Provider value={props.value}>
        {props.children}
    </Provider>;

export const useSchedule = () => useContext(ScheduleContext)


export const ToolContext = createContext<{
    activeTool?: any
}>({

})

export const ToolProvider = ({ tool, value, children }: any) => {

    const activeTool = tool?.use?.();

    const Provider: any = ToolContext.Provider

    return (
        <Provider value={{ activeTool }} children={children as any} />
    );
}

export const useTool = () => useContext(ToolContext)


export const RowHeightContext = createContext<{
    rowHeights?: any[], 
    updateRowHeight?: (row: string, height: number) => void,
    headerHeight?: number,
    updateHeaderHeight?: (height: number) => void;
    scrollTop?: number;
    setScrollTop?: (top: number) => void;
}>({

})

export const RowHeightProivder : any = (props: any) => {

    const [ rowHeights, setRowHeights ] = useState<any>({});
    const [ headerHeight, setHeaderHeight ] = useState<any>(0);
    const [ scrollTop, setScrollTop ] = useState(0);

    const updateRowHeight = (rowId, height) => {
      setRowHeights((prev) => ({ ...prev, [rowId]: height }));
    };
  
    const Provider : any = RowHeightContext.Provider;
    return <Provider value={{
        rowHeights,
        updateRowHeight,
        headerHeight,
        updateHeaderHeight: setHeaderHeight,
        scrollTop,
        setScrollTop
    }}>
        {props.children}
    </Provider>
};

export const useRowHeights = () => useContext(RowHeightContext);