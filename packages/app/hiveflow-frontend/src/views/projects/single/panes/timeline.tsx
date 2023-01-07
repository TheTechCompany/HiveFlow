import { Timeline } from "@hexhive/ui";
import { stringToColor } from "@hexhive/utils";
import { refetch, useMutation } from "@hive-flow/api";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ProjectSingleContext } from "../context";
import { Box } from '@mui/material'

export const TimelinePane = () => {
    // const [ links, setLinks ] = useState([]);

  const {  projectId, tasks, createTask, createDependency, finishTtl, deleteDependency, refetch, updateTask, deleteTask } = useContext(ProjectSingleContext);

  const links = tasks.filter((a) => a.status !== "Finished")?.map((task) => task.dependencyOf.map((dep) => ({id: `${task.id}-${dep.id}`, source: task.id, target: dep.id}))).reduce((prev, curr) => [...prev, ...curr], [])

  const [ timelineTasks, setTasks ] = useState<any[]>(tasks || []);

  const [selectedItem, setSelectedItem] = useState<any>();

  useEffect(() => {
    setTasks(tasks);
  }, [JSON.stringify(tasks)])

  const [ updateTaskDirect ] = useMutation((mutation, args: any) => {
    const item = mutation.updateProjectTask({id: args.id, input: args.input})
    return {
      item: {
        ...item
      }
    }
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

  console.log({selectedItem})

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
        <Box sx={{flex: 1, display: 'flex'}} tabIndex={1} onKeyDown={keyHandler}>
          <Timeline
            onHorizonChange={(start, end) => {
              setHorizon({start, end})
            }}
            dayStatus={() => 'rgb(163, 182, 150)'}
              data={
                timelineTasks.map((task) => ({
                  id: task.id,
                  status: task.status,
                  lastUpdated: task.lastUpdated,
                  start: new Date(task.startDate),
                  end: new Date(task.endDate),
                  name: task.title,
                  color: stringToColor(task.title),
                  showLabel: true
              })).filter(filterTasks).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
            }
              onCreateTask={async (task) => {
                // console.log({task})
                // setTemp([task])
                createTask(task)
              }}
              links={links}
              selectedItem={selectedItem}
              onSelectItem={(task) => {
                console.log("SELECT", {task})

                if((task as any).source && (task as any).target){
                  console.log({task})
                  setSelectedItem(task)
                }else{
                  let origTask = timelineTasks.find((x) => x.id == task.id)
                  updateTask({...origTask, start: new Date(origTask.startDate), end: new Date(origTask.endDate)})
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

                updateTaskDirect({args: {id: task.id, input: {startDate: position.start, endDate: position.end, projectId } }}).then(() => {
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