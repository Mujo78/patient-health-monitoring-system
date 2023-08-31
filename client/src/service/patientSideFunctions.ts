import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1/appointment"

export async function getPatientsForDoctor(token:string, id:string, page : number) {

    const response = await axios.get(`${BASE_URL}/doctor-patients/${id}?page=${page}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return response.data;
}

export async function searchForPatient(token:string, id:string, searchQuery: string, page: number) {

    const response = await axios.get(`${BASE_URL}/search/${id}?searchQuery=${searchQuery ||'none'}&page=${page || 'none'}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })

    return response.data
}