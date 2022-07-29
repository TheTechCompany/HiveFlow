import { config } from 'dotenv'
config()

import { request, gql } from 'graphql-request'

import {MSSQLWorker, WorkerTask} from '@hexhive/mssql-worker'
import { readFileSync } from 'fs';
import { updateRecord } from './sync';

const TOPIC = 'LOADER-STREAM';

interface HiveEvent {
    id: string;
    type: string;
    primaryKey: string;
    data: any;
    actions: "CREATE" | "UPDATE";
}

const main = async () => {

    console.log('=> Data Collector starting...')

    const task = JSON.parse(readFileSync(process.env.TASK_PATH || './task.json', 'utf8'))

    console.log('=> Fetching initial state')

    const query = `
        query GetState {
            ${task.map((t: any) => t.query).join('\n')}
        }
    `
    const initialResp = await request(process.env.ROOT_SERVER || '', gql`
        ${query}
    `, {
        
    }, {
	    'Authorization': `API-Key ${process.env.INTEGRATION_KEY}`
    })

    console.log(JSON.stringify(initialResp))

    const initialState = task.map((t: any) => {

        console.log(`Fetched ${initialResp[t?.queryKey].length} ${t.type}`)

        return {
            [t.family.cluster]: initialResp[t?.queryKey].map((x: any) => {
                let ret: any = {};

                t.collect.forEach((val: any) => {

                    ret[val.to] = x[val.to];
                    switch(val.type){
                        case 'Function':
                        case 'Date':
                            ret[val.to] = x[val.to]?.toString()
                    }
                })
                return ret
            })
        }
    }).reduce((prev: any, curr: any) => ({...prev, ...curr}), {})


    const worker = new MSSQLWorker({
		server: process.env.SQL_SERVER || ``,
		user: process.env.SQL_USER,
		password: process.env.SQL_PASSWORD,
		database: process.env.SQL_DB,
        // stream: true,
		options: {
			trustServerCertificate: process.env.SQL_TRUST_CERT ? true : false
		}
	}, task, initialState)

	await worker.runOnce()

    worker.on('NEW', async (event: any) => {
        console.log("NEW EVENT", event)
    
        if(!process.env.DRYRUN){
            const new_task = task.find((a: any) => a.family.cluster == event.id)

            let createObject : any = {}

            Object.keys(event.value[0]).forEach((key) => {
                createObject[key] = event.value[0][key];

                const type = new_task.collect.find((a: any) => a.to == key)?.type 

                if(type == "Number"){
                    if(typeof(createObject[key]) != "number") createObject[key] = parseFloat(createObject[key])
                    createObject[key] = parseFloat(createObject[key].toFixed(2))
                }else if(type == "Date" || type == "Function"){
                    try{
                        if(!(createObject[key] instanceof Date)){
                            const parts = createObject[key]?.match(/(.*)\/(.*)\/(....)/);

                            createObject[key] = new Date(parts[3], parts[2], parts[1]).toISOString(); //.match(/(..\/..\/....)/)?.[1];
                        }else{
                            createObject[key] = createObject[key].toISOString();
                        }
                    }catch(e){
                        console.log(createObject[key], e)
                        createObject[key] = undefined;
                    }
                }
            })
            
            if(new_task.create){
                await updateRecord({
                    action: 'CREATE',
                    create: new_task.create,
                    update: new_task.update,
                    data: createObject,
                    primaryKey: new_task?.family.species,
                    id: event.value[new_task?.family.species],
                    type: new_task?.type
                });
            }
        }

    });

    worker.on('UPDATE', async (event: any) => {
        console.log("UPDATE", event)
    
        if(!process.env.DRYRUN){
            let t = task.find((a: any) => a.family.cluster == event.id)
        
            let updateObject : any = {};
            
            Object.keys(event.value).forEach((key) => {
                updateObject[key] = event.value[key]?.[1] || event.value[key]?.[0];

                const type = t.collect.find((a: any) => a.to == key)?.type

                if(type == "Number"){
                    if(typeof(updateObject[key]) != "number") updateObject[key] = parseFloat(updateObject[key])
                    // console.log({type:typeof(updateObject[key]), key: key, update: updateObject[key]});
                    updateObject[key] = parseFloat(updateObject[key].toFixed(2))
                }else if(type == "Date" || type == "Function"){
                    try{

                        if(!(updateObject[key] instanceof Date)){
                            const parts = updateObject[key]?.match(/(.*)\/(.*)\/(....)/);

                            updateObject[key] = new Date(parts[3], parts[2], parts[1]).toISOString(); //.match(/(..\/..\/....)/)?.[1];
                        }else{
                            updateObject[key] = updateObject[key].toISOString();
                        }
                        // const parts = updateObject[key].match(/(.*)\/(.*)\/(....)/);

                        // updateObject[key] = new Date(parts[3], parts[2], parts[1]).toISOString() //.match(/(..\/..\/....)/)?.[1];
                    }catch(e){
                        console.log(updateObject[key], e)
                        updateObject[key] = undefined;
                    }
                }
            })

            if(t.update){
                await updateRecord({
                    action: 'UPDATE',
                    create: t.create,
                    update: t.update,
                    id: event.valueId,
                    data: updateObject,
                    primaryKey: t?.family.sepcies,
                    type: task.find((a: any) => a.family.cluster == event.id)?.type
                })

            }
        }
    })
}
main()