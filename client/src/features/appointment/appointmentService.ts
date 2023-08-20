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

const getAppointmentsForDay = async (date: Date) =>{
    const response = await axios.post(`${BASE_URL}day`, {date}, {
        headers: {
            "Authorization" : `Bearer ${userObj.token}`
        }
    })

    return response.data;
}

const getAppointmentForPerson = async () => {

    const response = await axios.get(`${BASE_URL}person/${userObj.data._id}`, {
        headers: {
            "Authorization" : `Bearer ${userObj.token}`
        }
    })
    return response.data;
}

const getAppointment = async (id: string) =>{
    const response = await axios.get(`${BASE_URL}/${id}`, {
        headers: {
            "Authorization" : `Bearer ${userObj.token}`
        }
    })
    return response.data;
}

const appointmentService = {
    makeAppointment,
    getAppointmentsForDay,
    getAppointmentForPerson,
    getAppointment
}

export default appointmentService