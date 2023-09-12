import axios from "axios";
import { Medicine, MedicineDataType } from "./medicineSlice";

const BASE_URL = "http://localhost:3001/api/v1/medicine/"

const getAllMedicine = async (token:string, page?: number, search?:string, category?:string) => {
    const response = await axios.get(`${BASE_URL}`, {
        params: {page: page, searchQuery: search, category: category},
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
    return response.data;
}

const getMedicine = async (token:string, id:string) => {
    const response = await axios.get(`${BASE_URL}/${id}`, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
    return response.data;
}


const addMedicine = async (token:string, data: MedicineDataType) => {
    
    const form = new FormData()
    form.append("category",data.category)
    form.append("category",data.category)
    form.append("category",data.category)
    form.append("description",data.description)
    form.append("manufacturer",data.manufacturer)
    form.append("price",data.price)
    form.append("photo",data.photo)
    
    const response = await axios.post(`${BASE_URL}`, data, {
        headers: {
            "Content-Type" : "multipart/form-data",
            "Authorization" : `Bearer ${token}`
        }
    })
    return response.data;
}

const deleteOneMedicine = async (token: string, id: string) => {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
    return response.data;
}

const updateMedicine = async (token: string, id: string, data: Medicine) => {
    const response = await axios.patch(`${BASE_URL}/${id}`, data, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
    return response.data;
}

const medicineService = {
    getAllMedicine,
    addMedicine,
    deleteOneMedicine,
    getMedicine,
    updateMedicine
}

export default medicineService