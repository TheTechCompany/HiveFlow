import { config } from 'dotenv'
config()

import { request, gql } from 'graphql-request'

import { nanoid } from 'nanoid';
import axios from 'axios'
import neo4j, {Session} from 'neo4j-driver'
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

    const task = JSON.parse(readFileSync('./task.json', 'utf8'))

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

    console.log({initialResp, query})

    const initialState = task.map((t: any) => {

        console.log(`Fetched ${initialResp[t?.queryKey].length} ${t.type}`)

        return {
            [t.family.cluster]: initialResp[t?.queryKey].map((x: any) => {
                let ret: any = {};

                t.collect.forEach((val: any) => {
                    console.log({val})

                    ret[val.to] = x[val.to];
                    switch(val.type){
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
    
        //     const new_task = task.find((a: any) => a.family.cluster == event.id)

    //     let createObject : any = {}

    //     Object.keys(event.value[0]).forEach((key) => {
    //         createObject[key] = {
    //             type: new_task.collect.find((a: any) => a.to == key).type,
    //             value: event.value[0][key]
    //         }
        })

    //     await updateRecord({
    //         action: 'CREATE',
    //         data: createObject,
    //         primaryKey: new_task?.family.species,
    //         id: event.value[new_task?.family.species],
    //         type: new_task?.type
    //     })


    //     // console.log("NEW", event)
    // })

    worker.on('UPDATE', async (event: any) => {
        console.log("UPDATE", event)
    
    //     let t = task.find((a: any) => a.family.cluster == event.id)

    //     let updateObject : any = {}

    //     Object.keys(event.value).forEach((key) => {
    //         updateObject[key] = {
    //             type: t.collect.find((a: any) => a.to == key).type,
    //             value: event.value[key]?.[1]
    //         }
        })

    //     await updateRecord({
    //         action: 'UPDATE',
    //         id: event.valueId,
    //         data: updateObject,
    //         primaryKey: t?.family.sepcies,
    //         type: task.find((a: any) => a.family.cluster == event.id)?.type
    //     })

    // })
}
main()