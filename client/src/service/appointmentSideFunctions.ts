import axios from "axios"
import moment from "moment"
import { Patient } from "../features/medicine/medicineSlice";
import { GenderArray } from "./departmentSideFunctions";

const BASE_URL = "http://localhost:3001/api/v1/"

export async function getDoctor(token: string, id: string) {
    const response = await axios.get(`${BASE_URL}doctor/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
}

type latestApp = {
    appointment_id: string,
    patient_id: string
}

export async function getLatestAppointment(token: string, id: string, latestApp: latestApp) {

    const response = await axios.post(`${BASE_URL}appointment/${id}/patient-latest-record`, latestApp, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
}

export async function getPatientFinishedAppointments(token: string, id: string, page: number) {

    const response = await axios.get(`${BASE_URL}appointment/patient/${id}?page=${page}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
}

export async function getLatestFinished(token: string) {

    const response = await axios.get(`${BASE_URL}appointment/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
}

export async function numberOfAppointmentsPerMonthForDepartments(token: string, month: string) {

    const response = await axios.get(`${BASE_URL}appointment/per-month/${month}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
}

type Latest = {
    _id: string,
    patient_id: Patient,
    appointment_date: Date
}

export type DocDashboardInfoType = {
    latest: Latest | null,
    department_name: string,
    gender: GenderArray[]
} 

export async function doctorDashboardInfo(token: string) {

    const response = await axios.get(`${BASE_URL}appointment/doctor-dashboard-info`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
}

type PatientStatistic = {
    name: string,
    value: number,
}

export type DocDashboardType = {
    patientStatistic: PatientStatistic[],
    averageAge: number,
    apps: PatientStatistic[]
}

export async function doctorDashboard(token: string) {

    const response = await axios.get(`${BASE_URL}appointment/doctor-dashboard`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return response.data;
}



export function isSunday(date:Date) {
    return date.getDay() === 0;
}

export function formatDate(date:Date) {
    const index = date?.toString().indexOf("T")
    const newDate = date?.toString().slice(0, index)
    return newDate
}

export function isDoctorAvailable(date: Date, available_days: string[]) {
    const dayOfWeek = date?.toLocaleDateString('en-US', { weekday: 'long' });
    return !available_days.includes(dayOfWeek);
}

export function formatStartEnd(date: Date) {
    const appDateTime = moment.utc(date).add(2, "hours");
    const startTime = moment.utc(appDateTime).format('hh:mm A');
    const endTime = moment.utc(appDateTime).add(20, 'minutes').format('hh:mm A');
    const appointmentTime = `${startTime} - ${endTime}`;
    return appointmentTime
}

export function isCurrentAppointment(appointmentDate: Date) {
    const appDate = new Date(appointmentDate);
    const currentDate = new Date();
    const endTime = new Date(appDate);
    endTime.setMinutes(endTime.getMinutes() + 20);
    return currentDate >= appDate && currentDate <= endTime;
  }


export function convert12HourTo24Hour(time12Hour: string) {
    const [hours, minutes] = time12Hour.split(":").map(Number);
    return `${hours <= 4 ? hours + 12 : hours < 10 && hours > 4 ? "0"+ hours : hours}:${minutes === 0 ? "00" : minutes}`;
}