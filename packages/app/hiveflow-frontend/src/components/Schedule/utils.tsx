import moment from "moment";
import { useSchedule } from "./context";

export const useScreenToDate = () => {
    const { horizon, step, stepCount, timelineSize, timelinePosition } = useSchedule();

    return (pos: { x: number, y?: number }) => {

        const multiplyFactor = moment.duration(1, step as any).as('minutes');

        let stepSize = timelineSize?.width / (stepCount * multiplyFactor);

        let x = (pos.x) / stepSize;
        
        return moment(horizon.start).add(x, 'minutes').toDate();
    }
}

export const useDateToScreen = () => {
    const { horizon, stepCount, step, timelinePosition, timelineSize } = useSchedule();
    
    return (date: Date): { x: number, y?: number } => {

        const multiplyFactor = moment.duration(1, step as any).as('minutes');

        let diff = moment(date).diff(moment(horizon.start), 'minutes')
        // let diff = moment(date).diff(moment(horizon), step as any)

        const stepSize = timelineSize?.width / (stepCount * multiplyFactor);

        return { x: stepSize * diff }
    }
}