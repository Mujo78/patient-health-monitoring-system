import axios from "axios";
import { MedicineDataType } from "./medicineSlice";

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


const addMedicine = async (token:string, data: MedicineDataType) => {
    
    const form = new FormData()
    form.append("category",data.category)
    form.append("category",data.category)
    form.append("category",data.category)
    form.append("description",data.description)
    form.append("expiry_date",data.expiry_date)
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

const medicineService = {
    getAllMedicine,
    addMedicine
}

export default medicineService