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

export async function getPharmacy(token: string){

    const response = await axios.get(`${BASE_URL}`, {
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

type PharmacyMainInfo = {
    _id: string,
    name: string,
    address: string,
    phone_number: string,
    working_hours: string
}

type Total = {
    total_price: number,
    total_number: number,
    total_available: number,
    total_not_available: number
}

type recentMedicine = {
    _id: string,
    name: string,
    photo: string,
    strength: string,
    createdAt: Date
}

export type PharmacyDashboardType = {
    pharmacy: PharmacyMainInfo,
    total: Total,
    recentMedicine: recentMedicine[]
}

export async function pharmacyDashboard(token: string){

    const response = await axios.get(`${BASE_URL}/dashboard`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    console.log(response.data)
    return response.data;
}

