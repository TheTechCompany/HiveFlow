import { AxiosInstance } from "axios";

export const fileActions = (axios: AxiosInstance) => {

    const addFilesToJob = async (job_id: string, files: File[]) => {
        const token = window.sessionStorage.getItem('CREDENTIALS_TOKEN')

        let fd = new FormData();
        files.forEach((file) => {
            fd.append('files', file)
        })

        const result = await axios.post(`/api/files?job=${job_id}`, fd, {headers: {'Authorization': 'Bearer '+ token}, withCredentials: true})
        return result.data
    }

    const uploadFile = async (files: File[]) => {
        console.log("Upload file")
        const token = window.sessionStorage.getItem('CREDENTIALS_TOKEN')

        let fd = new FormData();
        files.forEach((file) => {
            fd.append('files', file)
        })

        const result = await axios.post(`/api/files/`, fd, {headers: {'Authorization': 'Bearer ' + token}, withCredentials: true})
        return result.data
    }

    return {
        uploadFile,
        addFilesToJob
    }

}