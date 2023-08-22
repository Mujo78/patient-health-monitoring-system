import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1/medicine/"

const getAllMedicine = async (token:string) => {
    const response = await axios.get(`${BASE_URL}`, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
    return response.data;
}


const medicineService = {
    getAllMedicine
}

export default medicineService