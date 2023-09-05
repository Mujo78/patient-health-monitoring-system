import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1/"

export async function getMe(token: string){

    const response = await axios.get(`${BASE_URL}patient/get-me`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
}


export async function updateMe(token: string, data: unknown){

    const response = await axios.patch(`${BASE_URL}patient/edit-my-profile`, data,  {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
}

export async function getDoctorInfo(token: string){

    const response = await axios.get(`${BASE_URL}doctor/get-me`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
}


export async function updateDoctorInfo(token: string, data: unknown){

    const response = await axios.patch(`${BASE_URL}doctor/`, data,  {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
}
