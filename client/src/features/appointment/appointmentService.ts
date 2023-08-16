import axios from "axios"
import { MakeAppointmentData } from "./appointmentSlice"


const BASE_URL = "http://localhost:3001/api/v1/appointment/"

const user = localStorage.getItem("user")
const userObj = user && JSON.parse(user)

const makeAppointment = async (appointmentData: MakeAppointmentData) =>{
    const response = await axios.post(BASE_URL, appointmentData, {
        headers: {
            "Authorization" : `Bearer ${userObj.token}`
        }
    })

    return response.data;
}

const appointmentService = {
    makeAppointment
}

export default appointmentService