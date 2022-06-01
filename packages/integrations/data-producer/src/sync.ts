import { config } from 'dotenv'
config()

import request, { gql, RequestDocument } from 'graphql-request';


interface HiveEvent {
    id: string;
    type: string;
    primaryKey: string;
    data: any;
    actions: "CREATE" | "UPDATE";
}


const stringToDate = (date: any) => {
    // console.log(date)
    if (!date) return undefined;
    if (date instanceof Date) {
        return date.toISOString();
    }
    let parts = date.split('/')
    if (parts.indexOf('NaN') > -1) {
        return undefined
    }
    if (parts.length === 3) {
        return new Date(parts[2] + '-' + parts[1] + '-' + parts[0]).toISOString()
    } else {
        return new Date(date).toISOString()
    }

}

const graphqlRequest = async (doc: RequestDocument, variables: any = {}) => {
    return await request(process.env.ROOT_SERVER || '', doc, variables, {
	    'Authorization': `API-Key ${process.env.INTEGRATION_KEY}`
    })
}

export const updateRecord = async (json: { update: string, create: string, action: string, id: string, primaryKey: string, type: string, data: any[] | any }) => {
    // console.log("updateRecord", json)
    switch (json.action) {
        case 'CREATE':
            // let create: any = {}
            // if (Array.isArray(json.data)) {
            //     json.data = json.data[0]
            // }
            // Object.keys(json.data).forEach((key) => {
            //     if (json.data[key].type == "Date" || json.data[key].type == "Function") {
            //         create[key] = stringToDate(json.data[key].value)
            //     } else {
            //         create[key] = json.data[key].value;
            //     }
            // })

            // // console.log(json)
            // let firstSet = Object.keys(json.data || {}).filter((a) => {
            //     if (json.data[a].type == "Date" || json.data[a].type == "Function") {
            //         // console.log(json.data[a])
            //         return json.data[a]?.value && (json.data[a]?.value?.toString()?.indexOf('NaN') < 0)
            //     }
            //     return json.data[a].value
            // }).map((key) => {
            //     return `SET item.${key} = ${json.data[key]?.type == "Date" || json.data[key]?.type == "Function" ? `datetime($${key})` : `$${key}`}`;
            // }).join('\n')

            // let keyField = { [json.primaryKey]: json.data[json.primaryKey] }
            // // console.log(keyField)

            await graphqlRequest(gql`
                ${json.create}
            `, {
                input: json.data
            })

            // const items = await session.run(`
            //                 MATCH (org:HiveOrganisation {id: $orgId})
            //                 MATCH (org)-[:HAS_${json.type.toUpperCase()}]->(item:${json.type} {${json.primaryKey}: $${json.primaryKey}})
            //                 ${firstSet}
            //                 RETURN item
            //             `, {
            //     orgId: process.env.ORG_ID,
            //     ...keyField,
            //     ...create
            // })
            // if (items.records.length < 1) {


            //     let createSet = Object.keys(json.data).filter((a) => {
            //         if (json.data[a].type == "Date" || json.data[a].type == "Function") {
            //             return json.data[a].value && json.data[a].value?.toString()?.indexOf('NaN') < 0
            //         }
            //         return json.data[a].value
            //     }).map((key) => {
            //         return `${key}: ${json.data[key]?.type == "Date" || json.data[key]?.type == "Function" ? `datetime($${key})` : `$${key}`}`
            //     }).join(', ')


            //     try{
            //         await session.run(`
            //                         MATCH (org:HiveOrganisation {id: $orgId})
            //                         CREATE (item:${json.type} {${createSet}})
            //                         CREATE (org)-[:HAS_${json.type.toUpperCase()}]->(item)
            //                         RETURN item
            //                     `, {
            //             orgId: process.env.ORG_ID,
            //             ...create
            //         })
            //     }catch(e){
            //         console.log({e})
            //         console.log({createSet, create})
            //     }
            // }
            break;
        case 'UPDATE':
            // let update: any = {}
            // Object.keys(json.data).forEach((key) => {
            //     if (json.data[key].type == "Date" || json.data[key].type == "Function") {
            //         update[key] = stringToDate(json.data[key].value)
            //     } else {
            //         update[key] = json.data[key].value;
            //     }
            // })

            // let set = Object.keys(json.data || {}).filter((a) => {
            //     if (json.data[a].type == "Date" || json.data[a].type == "Function") {
            //         try{
            //             return json.data[a].value && json.data[a].value?.indexOf('NaN') < 0
            //         }catch(e){
            //             console.error({data: json.data, e})

            //             return false;
            //         }
            //     }
            //     return json.data[a].value
            // }).map((key) => {
            //     return `SET item.${key} = ${json.data[key]?.type == "Date" || json.data[key]?.type == "Function" ? `datetime($${key})` : `$${key}`}`;
            // }).join('\n')

            await graphqlRequest(gql`
                ${json.update}
            `, {
                id: json.id,
                input: json.data
            })
            
            // console.log("Update Set", set)
            // if (set && set.length > 0) {
            //     await session.run(`
            //                 MATCH (org:HiveOrganisation {id: $orgId})
            //                 MATCH (item:${json.type} {id: $id})
            //                 ${set}
            //                 RETURN item
            //             `, {
            //         orgId: process.env.ORG_ID,
            //         id: json.id,
            //         ...update
            //     })
            // }
            break;
    }

}
