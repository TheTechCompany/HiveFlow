import { Timeline } from "@hexhive/ui";
// import { stringToColor } from "@hexhive/utils";
import { refetch, useMutation } from "@hive-flow/api";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { EstimateSingleContext } from "../context";
import { Box } from '@mui/material'
import { arrayMove } from '@dnd-kit/sortable'
import { useMutation as useApolloMutation, gql } from '@apollo/client'
export const TimelinePane = () => {
    // const [ links, setLinks ] = useState([]);

  const {  estimateId, tasks, createTask, createDependency, finishTtl, deleteDependency, refetch, updateTask, deleteTask } = useContext(EstimateSingleContext);

  const links = tasks.filter((a) => a.status !== "Finished")?.map((task) => task.dependencyOf.map((dep) => ({id: `${task.id}-${dep.id}`, source: task.id, target: dep.id}))).reduce((prev, curr) => [...prev, ...curr], [])

  const [ timelineTasks, setTasks ] = useState<any[]>(tasks || []);

  const [selectedItem, setSelectedItem] = useState<any>();

  useEffect(() => {
    setTasks(tasks);
  }, [JSON.stringify(tasks)])

  const [ updateTaskDirect ] = useMutation((mutation, args: any) => {
    const item = mutation.updateEstimateTask({id: args.id, input: args.input})
    return {
      item: {
        ...item
      }
    }
  })

  const [ updateTimelineItemOrder ] = useApolloMutation(gql`
    mutation UpdateTimelineOrder ($id: ID, $above: String, $below: String){
      updateEstimateTaskTimelineOrder(id: $id, above: $above, below: $below){
        id
      }
    }
  `, {
    refetchQueries: ['GetProject']
  })
  
  const keyHandler = useCallback((e: any) => {
    if(e.key == "Delete" || e.key == "Backspace") {
      console.log({selectedItem})
      deleteDependency(selectedItem.source, selectedItem.target)
    }

    if(e.key == "Escape"){
      setSelectedItem(undefined)
    }
  }, [selectedItem])


  const filterTasks = (task: {
    status: string,
    lastUpdated?: Date,
    end: Date,
    start: Date
  }) => {
    let inHorizon = task.end > horizon.start && task.start < horizon.end

    if(inHorizon){
      // console.log(Date.now() - new Date(task.lastUpdated).getTime(), finishTtl)
      
      if(task.status == "Finished"){ // && task.lastUpdated && (Date.now() - new Date(task.lastUpdated).getTime() > finishTtl)){
        return false;
      }else{
        return true;
      }
    }
    return inHorizon;

  }

  // useEffect(() => {
  //   window.addEventListener('keydown', keyHandler)

  //   return () => {
  //     window.removeEventListener('keydown', keyHandler)
  //   }
  // }, [selectedItem])

  
  const [ horizon, setHorizon ] = useState<{start?: Date, end?: Date}>({})
    return (
        <Box sx={{flex: 1, display: 'flex', '& .color-dot': {margin: '8px'}}} tabIndex={1} onKeyDown={keyHandler}>
          <Timeline
            onHorizonChange={(start, end) => {
              setHorizon({start, end})
            }}
            dayStatus={() => 'rgb(163, 182, 150)'}
              data={
                timelineTasks.map((task) => ({
                  id: task.id,
                  timelineRank: task.timelineRank,
                  status: task.status,
                  lastUpdated: task.lastUpdated,
                  start: new Date(task.startDate),
                  end: new Date(task.endDate),
                  name: task.title,
                  color: '#aaa',
                  // color: stringToColor(task.title),
                  showLabel: true
              })).filter(filterTasks).sort((a, b) => a.timelineRank?.localeCompare(b.timelineRank) )
            }
              onCreateTask={async (task) => {
                // console.log({task})
                // setTemp([task])
                createTask(task)
              }}
              links={links}
              selectedItem={selectedItem}
              onSelectItem={(task) => {

                if((task as any).source && (task as any).target){
                  console.log({task})
                  setSelectedItem(task)
                }else{
                  let origTask = timelineTasks.find((x) => x.id == task.id)
                  updateTask({...origTask, start: new Date(origTask.startDate), end: new Date(origTask.endDate)})
                }
              }}
              onUpdateTaskOrder={(task, newIx, finished) => {
                  
                let newTasks = timelineTasks?.slice()?.sort((a,b) => a.timelineRank?.localeCompare(b.timelineRank));
                let ix = newTasks.findIndex((a) => a.id == task.id);

                newTasks = arrayMove(newTasks, ix, newIx);

                let prevTask = newTasks?.[newIx - 1];
                let nextTask = newTasks?.[newIx + 1];

                // setTimelineItems((tasks) => {                              
                //     let ix = tasks.findIndex((a) => a.id == task.id);

                //     return  arrayMove(tasks, ix, newIx);
                // })

                if(finished){
                    updateTimelineItemOrder({
                        variables: {
                            id: task.id,
                            above: prevTask?.id,
                            below: nextTask?.id 
                        }
                    }).then(() => {
                        refetch()
                    })
                }
              }}
              onUpdateTask={(task, position) => {
                
                setTasks((tasks) => {
                  let newTasks = tasks.slice()
                  let ix = newTasks.map((x) => x.id).indexOf(task.id)
                  newTasks[ix] = {
                    ...newTasks[ix],
                    startDate: position.start,
                    endDate: position.end
                  }
                  return newTasks
                })

                updateTaskDirect({args: {id: task.id, input: {startDate: position.start, endDate: position.end, estimateId } }}).then(() => {
                  refetch()
                })
              }}
              onCreateLink={(link) => {
                createDependency(link.source, link.target);
                // setLinks([...links, link])
              }}
              
            />
          </Box>
    )
}