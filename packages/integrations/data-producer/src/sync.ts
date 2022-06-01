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
         
            await graphqlRequest(gql`
                ${json.create}
            `, {
                input: json.data
            })

            break;
        case 'UPDATE':
          

            await graphqlRequest(gql`
                ${json.update}
            `, {
                id: json.id,
                input: json.data
            })
           
            break;
    }

}
