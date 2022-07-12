import { Timeline } from "@hexhive/ui";
import { stringToColor } from "@hexhive/utils";
import { refetch, useMutation } from "@hive-flow/api";
import React, { useContext, useEffect, useState } from "react";
import { ProjectSingleContext } from "../context";

export const TimelinePane = () => {
    // const [ links, setLinks ] = useState([]);

  const {  projectId, tasks, createTask, createDependency, refetch, updateTask, deleteTask } = useContext(ProjectSingleContext);

  const links = tasks.map((task) => task.dependencyOf.map((dep) => ({id: `${task.id}-${dep.id}`, source: task.id, target: dep.id}))).reduce((prev, curr) => [...prev, ...curr], [])

  const [ timelineTasks, setTasks ] = useState<any[]>(tasks || []);

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
  
    return (
        <Timeline
          dayStatus={() => 'rgb(163, 182, 150)'}
            data={timelineTasks.map((task) => ({
                id: task.id,
                start: task.startDate,
                end: task.endDate,
                name: task.title,
                color: stringToColor(task.title),
                showLabel: true
            })).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())}
            onCreateTask={async (task) => {
              // console.log({task})
              // setTemp([task])
              createTask(task)
            }}
            links={links}
            onSelectItem={(task) => {
              let origTask = timelineTasks.find((x) => x.id == task.id)
              updateTask({...origTask, start: new Date(origTask.startDate), end: new Date(origTask.endDate)})
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
    )
}