import axios from "axios";
import { Doctor } from "../pages/patient/appointment/AppointmentDepartment";

const BASE_URL = "http://localhost:3001/api/v1/department"

export async function getDepartments(token: string){

    const response = await axios.get(`${BASE_URL}/` , {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
}

export async function getDoctorsForDepartment(token: string, name:string) {
    const response = await axios.get(`${BASE_URL}/${name}/doctors`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
}

type GenderArray = {
    name: string,
    value: number
}

export type myDepartmentResult = {
    department: {
        name: string,
        phone_number: string,
        description:string
    },
    numberOfDoctors: number,
    numberOfActiveDoctors: number,
    todayActiveDoctors: Doctor[],
    otherDoctors: Doctor[],
    gender: GenderArray[]
}

export async function getMyDepartment(token: string) {
    const response = await axios.get(`${BASE_URL}/my-department`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
}

type appointmentsByDay = {
    name: string, value: number
}

export type myDepartmentAppointments = {
    todayAppointment: {
        total: number,
        finished: number,
        pending: number
    },
    appointmentsByDay: appointmentsByDay[]
}

export async function getMyDepartmentAppointments(token: string) {
    const response = await axios.get(`${BASE_URL}/my-department-appointments`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
}