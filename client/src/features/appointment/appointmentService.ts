import axios from "axios"
import { MakeAppointmentData, editObject } from "./appointmentSlice"

const BASE_URL = "http://localhost:3001/api/v1/appointment/"

const makeAppointment = async (appointmentData: MakeAppointmentData, token: string) =>{
    const response = await axios.post(BASE_URL, appointmentData, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })

    return response.data;
}

const getAppointmentsForDay = async (date: Date, token: string) =>{
    const response = await axios.post(`${BASE_URL}day`, {date}, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })

    return response.data;
}

const getAppointmentForPerson = async (id: string, token: string) => {

    const response = await axios.get(`${BASE_URL}person/${id}`, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
    return response.data;
}

const getAppointment = async (id: string, token: string) =>{
    const response = await axios.get(`${BASE_URL}/${id}`, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
    return response.data;
}

const deleteAppointment =async (id:string, token: string) => {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })

    return response.data;
}

const editAppointment =async (id: string, editObjectData: editObject, token: string) => {
    const response = await axios.patch(`${BASE_URL}/edit-details/${id}`, editObjectData, {
        headers: {
            "Authorization" : `Bearer ${token}`
        }
    })
    return response.data;
}

const appointmentService = {
    makeAppointment,
    getAppointmentsForDay,
    getAppointmentForPerson,
    getAppointment,
    deleteAppointment,
    editAppointment
}

export default appointmentService