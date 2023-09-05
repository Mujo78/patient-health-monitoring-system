import axios from "axios";

export type PharmacyUpdateType = {
    name: string,
    address: string,   
    description: string,
    phone_number: string,       
    working_hours: string
}


const BASE_URL = 'http://localhost:3001/api/v1/pharmacy/'

export async function getData(token: string){

    const response = await axios.get(`${BASE_URL}/get-me`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.data;
}


export async function updateData(data: PharmacyUpdateType, token: string){

    const response = await axios.patch(`${BASE_URL}/`,data, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return response.data;
}