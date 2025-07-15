

export interface Horizon {
    start: Date;
    end: Date;
}

export interface ScheduleEvent {
    id: string;
    
    groupBy: { id: string };
    zIndex?: number;

    start: Date;
    end: Date;

    data?: any;

    resizable?: boolean;
    selectable?: boolean;
}