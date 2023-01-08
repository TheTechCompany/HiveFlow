import React, { useEffect, useState } from 'react';
import { ColorDot, Timeline } from '@hexhive/ui'
//import utils from '../../utils';
import moment from 'moment';
import { stringToColor } from '@hexhive/utils';
import { Box, Typography } from '@mui/material';
import { Add } from 'grommet-icons';
import { TimelineItem, TimelineItemItems, useMutation } from '@hive-flow/api';
import { TimelineHeader, TimelineView } from './Header';
import _, { filter, toUpper } from 'lodash';
import { useQuery, useMutation as useApolloMutation, useApolloClient, gql } from '@apollo/client';
import { TimelineModal } from '../../modals/timeline';
import { CreateTimelineModal } from '../../modals/create-timeline';
import { Paper } from '@mui/material';

interface TimelineProps {

}

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

const HourTypes: any = {
    Welder: stringToColor('Welder'), // "#7fc721",
    TA: "#a3439b",
    Fabricator: "#43a3a3",
    "Skilled Labourer": "#734ab5",
    "Civil Subcontractor": "#c9900a"
}

const StatusTypes: any = {
    Won: 'green',
    Lost: 'red',
    "Customer has quote": '#8fb7cf',
    "Open": '#EEBC1D'
}

const sampleDate = new Date()

sampleDate.setDate(sampleDate.getDate() - 14)

const BaseTimeline: React.FC<TimelineProps> = (props) => {

    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    const [filter, setFilter] = useState<string[]>([])
    const [filters, setFilters] = useState<string[]>([])

    const client = useApolloClient()

    const [selected, setSelected] = useState<any | undefined>()

    const [selectedItem, setSelectedItem] = useState<any | undefined>()

    const [createModalOpen, openCreateModal] = useState(false)
    const [erpModal, openERP] = useState<boolean>(false);

    const [view, setView] = useState<string>('Project');

    const [date, setDate] = useState<Date>(sampleDate)
    const [horizon, setHorizon] = useState<{ start: Date, end: Date } | undefined>()

    const [timelineItems, setTimelineItems] = useState<any[]>([]);
    const [timelineLinks, setTimelineLinks] = useState<any[]>([]);

    // const query = useQuery({
    //     suspense: false,
    //     staleWhileRevalidate: true
    // })

    const { data: timelineData } = useQuery(gql`
        query Timelines {
            timelines {
                id
                name
            }
        }
    `)

    const { timelines = [] } = timelineData || {}

    const { data } = useQuery(gql`
        query TimelineData($timeline: String, $startDate: DateTime, $endDate: DateTime){
      

            timelineItems(where: {timeline: $timeline, startDate_LTE: $endDate, endDate_GTE: $startDate}) {
                id

                blocks {
                    id
                }

                below {
                    id
                }

                startDate
                endDate
                notes

                timeline 

                project {
                    id
                    displayId
                    name
                }
                estimate {
                    id
                    displayId
                    name
                }

                data {
                    item
                    location
                    quantity
                }
           
            }
        }
    `, {
        fetchPolicy: 'cache-and-network',
        variables: {
            timeline: view,
            startDate: horizon?.start?.toISOString(),
            endDate: horizon?.end?.toISOString(),
        }
    })

    // ($start: DateTime, $end: DateTime) 
    //(where: {date_GTE: $start, date_LTE: $end})
    const { data: projectInfo } = useQuery(gql`
        query ProjectInfo{
            projects {
                id
                displayId
                name

            }
            estimates {
                id
                displayId
                name
                status
                date
                price
            }
        }
    `, {
        variables: {
            start: horizon?.start.toISOString(),
            end: horizon?.end.toISOString()
        }
    })

    useEffect(() => {
        setTimelineLinks((data?.timelineItems || []).map((x) => x.blocks.map((a) => ({ id: `${x.id}-${a.id}`, source: x.id, target: a.id })) || [])?.reduce((a, b) => a.concat(b), []));
        setTimelineItems(data?.timelineItems?.map(mapItems))
    }, [data?.timelineItems])

    // const peopleData = useApollo(gql`
    //     query People {
    //         timelineItems(where: {timeline: "People"}){
    //             id
    //             startDate
    //             endDate
    //             notes
    //             project {
    //                 ... on Project {
    //                     id
    //                     name
    //                 }

    //                 ... on Estimate {
    //                     id
    //                     name
    //                 }
    //             }

    //             items {
    //                 id
    //                 type
    //                 location
    //                 estimate
    //             }

    //         }
    //     }
    // `, {

    // })

    const refetchTimeline = () => {
        client.refetchQueries({ include: ['TimelineData'] })
    }

    // const timelines = data?.timelines || [];

    const capacity = data?.timelineItems || []

    console.log(data)

    const [createTimeline] = useMutation((mutation, args: {
        name: string

    }) => {
        const item = mutation.createTimeline({ input: { name: args.name } })

        return {
            item: {
                ...item,
            }
        }
    })

    const [createTimelineItem, createInfo] = useMutation((mutation, args: {
        item: {
            timeline: string,
            project?: any,
            estimate?: any,
            notes?: string,
            items?: any[],
            startDate?: string,
            endDate?: string
        }
    }) => {
        const item = mutation.createTimelineItem({
            input: {
                timelineId: args.item.timeline,
                project: args.item.project,
                estimate: args.item.estimate,
                notes: args.item.notes,
                startDate: args.item.startDate,
                endDate: args.item.endDate,
                data: args.item?.items || []
            }
        })
        return {
            item: {
                ...item
            },
            error: null
        }
    }, {
        onCompleted(data) { },
        onError(error) { },
        refetchQueries: [],
        awaitRefetchQueries: true,
        suspense: false,
    })

    const [deleteTimelineItem, deleteInfo] = useMutation((mutation, args: { id: string }) => {
        if (!args.id) return { err: "No ID Supplied" }
        const result = mutation.deleteTimelineItem({
            id: args.id

        })
        return {
            item: {
                ...result
            },
            error: null
        }
    }, {
        onCompleted(data) { },
        onError(error) { },
        refetchQueries: [],
        awaitRefetchQueries: true,
        suspense: false,
    })

    const [updateTimelineItem, updateInfo] = useMutation((mutation, args: {
        id: string, item: {
            project?: string,
            estimate?: string,
            notes?: string,
            items?: any[],
            startDate?: string,
            endDate?: string
        }
    }) => {

        if (!args.id) return;

        let update: any = {};

        if (args.item.project) update.project = args.item.project;
        if (args.item.estimate) update.estimate = args.item.estimate;

        if (args.item.startDate) update.startDate = args.item.startDate;
        if (args.item.endDate) update.endDate = args.item.endDate;

        if (args.item.notes) update.notes = args.item.notes;
        if (args.item.items) update.data = args.item.items;
        // if(args.item.items){
        //     let items = args.item.items?.map((x) => ({
        //         id: x?.id,
        //         type: x?.type,
        //         location: x?.location,
        //         estimate: x?.estimate
        //     }))

        //     let old_item = capacity.find((a: { id: string; }) => a.id == args.id)

        //     let delete_items = old_item.items?.filter((a: { id: any; }) => items?.map((x) => x.id).indexOf(a.id) < 0)
        //     let update_items = items?.filter((a) => a.id)
        //     let create_items = items?.filter((a) => !a.id)

        //     update = {
        //         ...update,
        //         items: (delete_items?.map((item: { id: any; }) => ({
        //             delete: {
        //                 where: {node: {id: item.id}}
        //             }
        //         }))).concat((create_items?.map((item) => ({
        //             create: [{node: item}]
        //         })) as any[]).concat(update_items?.map((item) => ({
        //             where: {node: {id: item.id}}, update: {node: {
        //                 location: item.location,
        //                 type: item.type,
        //                 estimate: item.estimate
        //             }}
        //         }))
        //         )
        //         )
        //     }
        // }

        const item = mutation.updateTimelineItem({
            id: args.id,
            input: {
                ...update
            }
        });
        // const item = mutation.updateHiveOrganisations({
        //     update: {
        //         timeline: [{
        //             where: {node: {id: args.id}}, 
        //             update: {
        //                 node: {
        //                     ...update,
        //                 }
        //         }}]
        //     }
        // })

        return {
            item: {
                ...item
            }
        }
    }, {
        onCompleted(data) { },
        onError(error) { },
        refetchQueries: [],
        awaitRefetchQueries: true,
        suspense: false,
    })


    const [createTimelineItemDependency] = useApolloMutation(gql`
        mutation CreateDependency ($source: ID, $target: ID){
            createTimelineItemDependency(source: $source, target: $target){
                id
            }
        }
    `, {
        refetchQueries: ['TimelineData']
    })

    const [deleteTimelineItemDependency] = useApolloMutation(gql`
        mutation DeleteDependency ($source: ID, $target: ID){
            deleteTimelineItemDependency(source: $source, target: $target){
                id
            }
        }
    `, {
        refetchQueries: ['TimelineData']
    })

    // console.log("QUOTE DATA", quoteData)

    // const quotes = (quoteData.data?.estimates || []).map((quote: { date: moment.MomentInput; status: any; name: any; }) => ({
    //     start: new Date(moment(quote?.date).startOf('isoWeek').valueOf()),
    //     end: new Date(moment(quote?.date).endOf('isoWeek').valueOf()),
    //     ...quote,
    //     status: quote.status,
    //     showLabel: formatter.format((quote as any).price),
    //     color: stringToColor(quote?.name || '')
    // }))

    //where: {status: ["Job Open", "Handover"] }
    const projects = projectInfo?.projects || [] // query.projects({ })?.map((x) => ({ ...x }))
    const estimates = projectInfo?.estimates || [] // query.estimates({ where:})?.map((x) => ({ ...x }))

    // const capacity = query.timelineItems({ where: {timeline: view}});

    const people: any[] = [] //peopleData?.data?.timelineItems;

    // const [timeline, setTimeline] = useState<any[]>([])



    const getColorBars = (plan: { hatched?: boolean, items?: any[] }) => {
        let total = plan.items?.reduce((previous: any, current: any) => previous += current.quantity, 0)

        let sum = plan.items?.reduce((previous, current) => {

            if (!previous[current.item]) previous[current.item] = 0
            previous[current.item] += current.quantity
            return previous
        }, {})

        let gradient = Object.keys(sum).map((key) => {
            return {
                color: HourTypes[key],
                percent: sum[key] / total
            }
        })

        return generateStripes(gradient, plan.hatched);
    }


    const generateStripes = (colors: { color: string, percent: number }[], hatched?: boolean) => {
        let c = colors.sort((a, b) => b.percent - a.percent)

        if (c.length <= 0) return 'gray' //stringToColor(`${props.item?.name}`)

        let gradient: any[] = [];
        let current_stop = 0;

        c.forEach((x, ix) => {
            let start_pos = current_stop * 100
            let end_pos = start_pos + (x.percent * 100)
            gradient.push(`${x.color} ${start_pos}%`) //First stop

            if (hatched) {
                let diff = (end_pos - start_pos) / 10

                for (var i = 0; i < diff; i++) {
                    let hatch_start = start_pos + (i * 10);
                    let hatch_end = hatch_start + 10;

                    // gradient.push(`${i % 2 ? 'gray' : x.color} ${hatch_start}%`)
                    // gradient.push(`${i % 2 ? 'gray' : x.color} ${hatch_end}%`)
                }

            }

            gradient.push(`${x.color} ${end_pos}%`) //End stop
            current_stop += x.percent;
        })

        let hatched_output = `
            repeating-linear-gradient(45deg, #ffffff42, #ffffff42 10px, transparent 10px, transparent 20px)
        `
        let output = `linear-gradient(${hatched ? '45deg' : '90deg'}, ${gradient.join(', ')})`

        if (hatched) {
            return `${hatched_output}, ${output}`
        } else {
            return output;
        }
        console.log(output)
    }

    //Turn initial load off


    const mapItems = (item: any) => {
        return {
            id: item?.id,
            name: `${item?.estimate?.displayId || item?.project?.displayId} - ${item?.estimate?.name || item?.project?.name}`,
            start: new Date(item?.startDate),
            end: new Date(item?.endDate),

            below: item?.below,

            color: getColorBars({ hatched: Boolean(item?.esimate), items: item?.data || [] }),
            showLabel: `${item?.data?.reduce((previous: any, current: any) => {
                return previous += (current?.quantity || 0)
            }, 0)}hrs`,
            hoverInfo: item.data.length > 0 || item.notes.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ bgcolor: 'secondary.main', display: 'flex', justifyContent: 'space-between' }}>
                        {/* <Text weight="bold">{capacity_plan?.project?.name?.substring(0, 15)}</Text> */}
                        <Typography fontWeight="bold">Total Hours: </Typography>
                        <Typography>{
                            item?.data?.reduce((previous: any, current: any) => {
                                return previous += (current?.quantity || 0)
                            }, 0)}hrs
                        </Typography>
                    </Box>
                    <Box>
                        {item?.data?.slice().sort((a: { location: any; }, b: { location: any; }) => (a?.location || '') > (b?.location || '') ? -1 : 1).map((x: { item: string, location: string, quantity: number }) => (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {<ColorDot color={HourTypes[x?.item as any || '']} size={10} />}
                                    <Typography>{x?.item}{x?.location ? ` - ${x?.location}` : ''} :</Typography>
                                </Box>
                                <Typography sx={{ marginLeft: '4px' }}>{x?.quantity}hrs</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Typography>
                        {item?.notes || ''}
                    </Typography>
                </Box>
            )
        }
    }
    //stringToColor(`${capacity_plan?.project?.id} - ${capacity_plan?.project?.name}` || ''),

    //TODO add capacity information
    // useEffect(() => {
    //     if (capacity && view == "Projects") {
    //         setTimeline(capacity.map((capacity_plan: { project: any; id: any; notes: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; startDate: string | number | Date; endDate: string | number | Date; items: any[]; }, ix: any) => {
    //             let project = capacity_plan?.project
    //             console.log(project)

    //             return {
    //             id: capacity_plan?.id || `capacity-${ix}`,
    //             name: `${project?.id} - ${project?.name}`.substring(0, 20) || '',
    //             notes: capacity_plan.notes,
    //             start: new Date(capacity_plan?.startDate),
    //             end: new Date(capacity_plan?.endDate),
    //             color: getColorBars({ hatched: (project || {})?.__type == "Estimate", items: capacity_plan?.items || [] }),
    //             hoverInfo: (
    //                 <Box round="xsmall" overflow="hidden"  direction="column">
    //                     <Box pad="xsmall" background="accent-2" margin={{bottom: 'xsmall'}} direction="row" justify="between">
    //                         {/* <Text weight="bold">{capacity_plan?.project?.name?.substring(0, 15)}</Text> */}
    //                         <Text weight="bold">Total Hours: </Text>
    //                         <Text>{
    //                             capacity_plan?.items?.reduce((previous: any, current: any) => {
    //                                 return previous += (current?.estimate || 0)
    //                             }, 0)}hrs
    //                         </Text>
    //                     </Box>
    //                     <Box pad="xsmall">
    //                         {capacity_plan?.items?.slice().sort((a: { location: any; }, b: { location: any; }) => (a?.location || '') > (b?.location || '') ? -1 : 1).map((x: { type: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; location: any; estimate: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
    //                             <Box align="center" direction="row" justify="between">
    //                                     <Box direction="row" align="center">
    //                                         <ColorDot color={HourTypes[x?.type  as any || '']} size={10}/>
    //                                         <Text>{x?.type}{x?.location ? ` - ${x?.location}` : ''} :</Text>
    //                                     </Box>
    //                                 <Text margin={{left: 'small'}}>{x?.estimate}hrs</Text>
    //                             </Box>
    //                         ))}
    //                     </Box>
    //                     <Text size="small">
    //                         {capacity_plan?.notes}
    //                     </Text>
    //                 </Box>
    //             ),
    //             showLabel: `${capacity_plan?.items?.reduce((previous: any, current: any) => {
    //                 return previous += (current?.estimate || 0)
    //             }, 0)}hrs`,
    //             collapsibleContent: (
    //                 <Text>More</Text>
    //             )
    //         }}))
    //     } else if (capacity && view == "People") {
    //         setTimeline(capacity.map((capacity_plan: { project: any; endDate: Date; startDate: Date; id: any; notes: any; items: any[]; }, ix: any) => {
    //             let project = capacity_plan?.project

    //             let weeks = moment(capacity_plan?.endDate).diff(moment(capacity_plan?.startDate), 'weeks')
    //             return {
    //                 id: capacity_plan?.id || `capacity-${ix}`,
    //                 name: `${moment(capacity_plan?.startDate).format("DD/MM/YY")} - ${moment(capacity_plan?.endDate).format("DD/MM/YY")}`.substring(0, 20) || '',
    //                 start: new Date(capacity_plan?.startDate),
    //                 end: new Date(capacity_plan?.endDate),
    //                 notes: capacity_plan.notes,
    //                 hoverInfo: (
    //                     <Box round="xsmall" overflow="hidden"  direction="column">
    //                         <Box pad="xsmall" background="accent-2" margin={{bottom: 'xsmall'}} direction="row" justify="between">
    //                             {/* <Text weight="bold">{capacity_plan?.project?.name?.substring(0, 15)}</Text> */}
    //                             <Text weight="bold">Total People: </Text>
    //                             <Text>{
    //                                 capacity_plan?.items?.reduce((previous: any, current: any) => {
    //                                     return previous += (current?.estimate || 0)
    //                                 }, 0)}
    //                             </Text>
    //                         </Box>

    //                         <Box pad="xsmall">
    //                             {capacity_plan?.items?.slice().sort((a: { location: any; }, b: { location: any; }) => (a?.location || '') > (b?.location || '') ? -1 : 1).map((x: { type: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; location: any; estimate: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => (
    //                                 <Box align="center" direction="row" justify="between">
    //                                     <Box direction="row" align="center">
    //                                     <ColorDot color={HourTypes[x?.type as any || '']} size={10}/>
    //                                     <Text>{x?.type}{x?.location ? ` - ${x?.location}` : ''} :</Text>
    //                                     </Box>
    //                                     <Text margin={{left: 'small'}}>{x?.estimate}</Text>
    //                                 </Box>
    //                             ))}
    //                         </Box>
    //                         <Box pad="xsmall" margin={{bottom: 'xsmall'}} direction="row" justify="between">
    //                             {/* <Text weight="bold">{capacity_plan?.project?.name?.substring(0, 15)}</Text> */}
    //                             <Text weight="bold">Total Hours: </Text>
    //                             <Text>{
    //                                 capacity_plan?.items?.reduce((previous: any, current: any) => {
    //                                     return previous += (current?.estimate || 0)
    //                                 }, 0) * 45}hrs
    //                             </Text>
    //                         </Box>
    //                     </Box>
    //                 ),
    //                 color: getColorBars({ hatched: (project || {}).__type == "Estimate", items: capacity_plan?.items || [] }),
    //                 showLabel: `${(capacity_plan?.items?.reduce((previous: any, current: any) => {
    //                     return previous += (current?.estimate || 0)
    //                 }, 0) * 45)}hrs/week`,
    //                 collapsibleContent: (
    //                     <Text>More</Text>
    //                 )
    //             }
    //         }))
    //     }
    // }, [JSON.stringify(capacity), view])

    // useEffect(() => {
    //     if (quotes && view == 'Estimates') {
    //         let status = [...new Set<string>(quotes?.map((x: { status: any; }) => x.status))]
    //         if(filter.length == 0){
    //             setFilter(status)
    //         }
    //         setFilters(status)

    //         parseEstimates()

    //     }
    // }, [JSON.stringify(quotes), view])

    // useEffect(() => {
    //     parseEstimates()
    // }, [filter])        

    useEffect(() => {
        let year = moment(horizon?.start).get('year')
        let oldYear = moment(date).get('year')
        if (year != oldYear) {
            if (horizon?.start) setDate(horizon?.start)

        }
    }, [horizon?.start])


    const onHorizonChange = (start: Date, end: Date) => {
        //TODO BUFFER DAY Var

        console.log("Horizon", start, end)
        setHorizon({ start, end })
    };

    const sortTimeline = (arr: any[] = []) => {
        let i, j;
        let len = arr.length;

        let isSwapped = false;

        console.log({arr});

        for (i = 0; i < len; i++) {

            isSwapped = false;

            let curr = arr[i];

            for (j = 0; j < len -1; j++) {
                // let curr = arr[j];
                let next = arr[j + 1];

                console.log({curr, next});

                if (curr.below?.id == next.id) {
                    var temp = arr[j]
                    arr[i + 1] = curr //arr[j + 1];
                    arr[i] =  next;
                    isSwapped = true;
                }
            }

            // IF no two elements were swapped by inner loop, then break

            if (!isSwapped) {
                break;
            }
        }
        console.log({arr});

        return arr;
    }
    const bubbleSort = (arr: any[] = []) => {

        let timeline = arr.slice();
        console.log({ timeline });

        let swapped;

        do {
            console.log("Check");

            swapped = false;

            for (let i = 0; i < timeline.length - 1; i++) {

                console.log("Checked,");

                let current = timeline[i];
                let next = timeline[i + 1];

                console.log({ current, next })

                if (current.below && next.id === current.below.id) {
                    timeline[i] = next;
                    timeline[i + 1] = current;
                    console.log({ timeline, next, current })
                    swapped = true;
                }

                /*
 if (!current.below && next.below) { 
                    timeline[i] = next;
                    timeline[i + 1] = current;
                    swapped = true;
                } else 
                */
            }

        } while (swapped);

        console.log({ timeline });

        return timeline;

        // return timeline?.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

    }

    const filterData = (item: { start?: Date, end?: Date }) => {
        if (horizon && horizon.start && horizon.end) {
            let horizonStart = horizon.start.getTime();
            let horizonEnd = horizon.end.getTime();


            return (horizonEnd > (item.start?.getTime() || 0) && horizonStart < (item.end?.getTime() || 0))
            // return (item.start < horizon.start && item.end > horizon.end) || (item.start > horizon.start && item.start < horizon.end) || (item.end > horizon.start && item.end < horizon.end);

        } else {
            return true;
        }
    }



    const createTimelinePlan = (plan: { id?: string, project?: { id?: string, type?: string }, notes?: string, data?: any[], startDate?: Date, endDate?: Date }) => {
        console.log({ plan })
        plan.data = (plan.data || []).map((x) => ({ item: x.item, location: x.location, quantity: x.quantity }))

        let attachUpdate: any = {};

        if (plan.project.type == "Estimate") {
            attachUpdate.estimate = plan.project?.id
        } else {
            attachUpdate.project = plan.project?.id
        }
        if (plan.id) {
            console.log("Update", plan)

            let endDate = plan.endDate;
            endDate?.setDate(endDate.getDate() - 1)

            updateTimelineItem({
                args: {
                    id: plan.id,
                    item: {
                        ...attachUpdate,
                        startDate: plan.startDate?.toISOString(),
                        endDate: endDate?.toISOString(),
                        notes: plan.notes,
                        items: plan.data || []
                    }
                }
            }).then(() => {

                // setTimeout(() => {
                let items = timelineItems.slice();
                let ix = items.map((x) => x.id).indexOf(plan.id);
                if (ix > -1) {
                    items[ix] = {
                        ...items[ix],
                        ...plan
                    }
                    setTimelineItems(items)
                }
                // }, 2000);

                // setTimelineItems(items)
                refetchTimeline()
                openERP(false)
            })
        } else {
            console.log(plan)
            createTimelineItem({
                args: {
                    item: {
                        ...attachUpdate,
                        startDate: plan.startDate?.toISOString(),
                        endDate: plan.endDate?.toISOString(),
                        timeline: view || plan.project?.type,
                        notes: plan.notes,
                        items: plan.data || []
                    }
                }
            }).then((data) => {
                openERP(false);
                refetchTimeline()
                console.log("Create timeline view", data)
            })
        }
    }

    const createTimelineDependency = () => {

    }

    const deleteTimelineDependency = () => {

    }

    const updateTimelinePlan = async (id: string, item: { notes?: string, start: Date, end: Date }) => {

        try {
            const result = await updateTimelineItem({
                args: {
                    id: id?.toString() || '',
                    item: {
                        startDate: item.start?.toISOString(),
                        endDate: item.end?.toISOString(),
                        notes: item.notes
                    }
                }
            })
            refetchTimeline()
        } catch (e) {
            console.log({ e })
        }
        return true;

    }

    return (
        <Box
            sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
            <CreateTimelineModal
                open={createModalOpen}
                onClose={() => openCreateModal(false)}
                onSubmit={(timeline) => {
                    createTimeline({
                        args: {
                            name: timeline.name
                        }
                    }).then(() => {
                        refetchTimeline()
                        openCreateModal(false)
                    })
                }}
            />
            <TimelineModal
                type={view == "Project" ? "Projects" : "Estimates"}
                selected={selected}
                onClose={() => {
                    openERP(false)
                    setSelected(undefined)
                }}
                onDelete={() => {
                    openERP(false);
                    if (!selected) return;
                    deleteTimelineItem({ args: { id: selected.id } }).then(() => {
                        refetchTimeline()
                        setSelected(undefined)
                    })
                }}
                onSubmit={createTimelinePlan}
                projects={view == "Project" ?
                    projects?.map((x) => ({ id: x.id, displayId: x.displayId, name: x.name, type: "Project" })) || [] :
                    estimates?.map((x) => ({ id: x.id, displayId: x.displayId, name: x.name, type: "Estimate" })) || []
                }
                open={erpModal} />
            <TimelineHeader
                timelines={[{ id: 'Project', name: "Projects" }, { id: 'People', name: "People" }, { id: 'Estimate', name: "Estimates" }]}
                filter={filter}
                filters={filters}
                onCreateTimeline={() => {
                    openCreateModal(true);
                }}
                onFilterChanged={(filter: React.SetStateAction<string[]>) => {
                    setFilter(filter)
                }}
                onAdd={() => openERP(true)}
                view={view || timelines?.[0]?.id || 'Project'}
                onViewChange={(view) => setView(view)} />

            <Paper
                tabIndex={1}
                onKeyDown={(e) => {
                    if (selectedItem && (e.key == "Delete" || e.key == "Backspace")) {
                        const [source, target] = selectedItem?.split('-');

                        if (!source || !target) return;

                        deleteTimelineItemDependency({
                            variables: {
                                source: source,
                                target: target,
                            }
                        }).then(() => {
                            setSelectedItem(null);
                        })

                    }
                    // console.log(e.key)
                }}
                sx={{
                    flex: 1,
                    marginTop: '3px',
                    display: 'flex'
                }}>

                <Timeline
                    onCreateTask={async (task) => {
                        setSelected({ startDate: task.start, endDate: task.end })
                        openERP(true);
                    }}
                    dayInfo={(day) => {

                        let horizonStart = (day || moment()).clone().startOf('isoWeek').valueOf()
                        let horizonEnd = (day || moment()).clone().endOf('isoWeek').valueOf()

                        // console.log(day, people, horizonStart, horizonEnd)
                        let people_power = people?.filter((a) => {
                            // console.log(horizonEnd, new Date(a.startDate).getTime(), horizonStart < (new Date(a.endDate).getTime()))
                            return (horizonEnd > (new Date(a?.startDate).getTime() || 0) && horizonStart < (new Date(a?.endDate).getTime() || 0))
                        })

                        let job_power = capacity?.filter((a: { startDate: string | number | Date; endDate: string | number | Date; }) => {
                            return (horizonEnd > (new Date(a?.startDate).getTime() || 0) && horizonStart < (new Date(a?.endDate).getTime() || 0))
                        })
                        // console.log(people_power)

                        let week_power = people_power?.reduce((previous, current) => {
                            let weeks = moment(current?.endDate).diff(moment(current?.startDate), 'weeks')
                            // console.log(current.items({}))
                            let week = current?.items?.reduce((prev: any, cur: { estimate: any; }) => {
                                return prev + (cur?.estimate || 0)
                            }, 0)

                            return previous + ((week || 0) * 45) //((week || 0) / weeks)
                        }, 0)

                        let job_week = job_power?.reduce((previous: number, current: { endDate: Date; startDate: Date; items: any[] | null | undefined; }) => {
                            let weeks = moment(current?.endDate).diff(moment(current?.startDate), 'weeks') || 1

                            let week = _.reduce(current?.items, (prev, curr) => prev + (curr?.estimate || 0), 0)
                            // let week = (current?.items && current?.items.length > 0) ? (current?.items || []).reduce((prev, cur) => {
                            //     return prev + (cur?.estimate && !isNaN(cur?.estimate) ? cur?.estimate : 0)
                            // }, 0) : 0;

                            // if(week != undefined && week > 0) week = week / weeks;

                            return previous + (week && week > 0 ? (week) / weeks : 0) //((week || 0) / weeks)
                        }, 0)

                        // console.log(job_week, week_power)

                        let alarm_level = (job_week || 0) > (week_power || 0) ? ((job_week || 0) / (week_power || 0)) : 0;

                        return (alarm_level > 0) && (
                            <Typography
                                color={alarm_level == Infinity ? 'error' : undefined}
                            >{alarm_level != Infinity ? `${(alarm_level * 100).toFixed(2)}%` : "No people available"}</Typography>
                        )
                    }}
                    dayStatus={(day) => {
                        let horizonStart = day.clone().startOf('isoWeek').valueOf()
                        let horizonEnd = day.clone().endOf('isoWeek').valueOf()

                        let people_power = people?.filter((a) => {
                            return (horizonEnd > (new Date(a?.startDate).getTime() || 0) && horizonStart < (new Date(a?.endDate).getTime() || 0))
                        })

                        let job_power = capacity?.filter((a: { startDate: string | number | Date; endDate: string | number | Date; }) => {
                            return (horizonEnd > (new Date(a?.startDate).getTime() || 0) && horizonStart < (new Date(a?.endDate).getTime() || 0))
                        })

                        let week_power = people_power?.reduce((previous, current) => {
                            let weeks = moment(current?.endDate).diff(moment(current?.startDate), 'weeks')
                            // console.log(current.items({}))
                            let week = current?.items?.reduce((prev: any, cur: { estimate: any; }) => {
                                return prev + (cur?.estimate || 0)
                            }, 0)

                            return previous + ((week || 0) * 45) //((week || 0) / weeks)
                        }, 0)

                        let job_week = job_power?.reduce((previous: number, current: { endDate: moment.MomentInput; startDate: moment.MomentInput; items: any[] | null | undefined; }) => {
                            let weeks = moment(current?.endDate).diff(moment(current?.startDate), 'weeks') || 1

                            let week = _.reduce(current?.items, (prev, curr) => prev + (curr?.estimate || 0), 0)

                            return previous + (week && week > 0 ? (week) / weeks : 0) //((week || 0) / weeks)
                        }, 0)

                        let alarm_level = (job_week || 0) > (week_power || 0) ? ((job_week || 0) / (week_power || 0)) : 0;
                        let alarm_color = alarm_level < 2 ? `rgba(231, 93, 61, ${alarm_level - 1})` : 'rgb(231, 93, 61)'
                        return ((job_week || 0) > (week_power || 0) && (day.isoWeekday() != 6 && day.isoWeekday() != 7)) ? alarm_color : 'rgb(163, 182, 150)' // ? 'red' : 'initial';
                    }}
                    onSelectItem={(item: any) => {
                        console.log(item, capacity)

                        if (item.source && item.target) {
                            //Set selected link
                            setSelectedItem(item.id)
                        } else {
                            setSelectedItem(item.id)

                            openERP(true)
                            setSelected(_.cloneDeep(capacity?.find((a: { id: any; }) => a?.id == (item as any)?.id)))
                        }
                    }}
                    onCreateLink={(link) => {
                        createTimelineItemDependency({
                            variables: {
                                source: link.source,
                                target: link.target
                            }
                        })
                    }}
                    selectedItem={{ id: selectedItem }}
                    loading={initialLoad}
                    onHorizonChange={onHorizonChange}
                    resizable
                    mode="month"
                    links={timelineLinks}
                    data={sortTimeline(timelineItems) || []}
                    date={date}
                    itemHeight={30}
                    onUpdateTask={async (task: any, info: any) => {
                        console.log({ task, info });

                        //Task is old state, info is new {start:Date, end: Date}

                        // let ix = timeline.map((x) => x.id).indexOf(task.id?.toString());
                        // let times = timeline.slice();

                        // const old = Object.assign({}, timeline[ix]) //.find((a) => a.id == id)


                        // times[ix].startDate = info.start;
                        // times[ix].endDate = info.end;

                        // setTimeline(times)
                        if (!task.id) return;
                        updateTimelinePlan(task.id.toString(), info)
                    }}
                />
            </Paper>
        </Box>
    )
}

export default BaseTimeline;