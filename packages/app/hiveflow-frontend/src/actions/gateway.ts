import axios from "axios";

const API_URL = localStorage.getItem('HEXHIVE_API');

const url = process.env.NODE_ENV == 'production'
    ? `${API_URL || process.env.REACT_APP_API}/graphql`
    : "http://localhost:7000/graphql"

export const getConfig = async () => {
   const res = await axios.post(url, {
        query: `
            query Q {
                hiveApplianceConfigurations(where: {appliance: {name: "HiveFlow"}}){
                    permissions {
                        type
                        create
                        read
                        update
                        delete
                    }
                }
            }
        `
    }, {withCredentials: true})
    return res.data
}