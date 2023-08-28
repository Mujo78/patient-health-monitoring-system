import axios from "axios"
import moment from "moment"

const BASE_URL = "http://localhost:3001/api/v1/"

export async function getDepartments(token: string){

    const response = await axios.get(`${BASE_URL}department` , {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
}

export async function getDoctorsForDepartment(token: string, name:string) {
    const response = await axios.get(`${BASE_URL + "department/" + name}/doctors`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
}

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

export function isSunday(date:Date) {
    return date.getDay() === 0;
}

export function formatDate(date:Date) {
    const index = date.toString().indexOf("T")
    const newDate = date.toString().slice(0, index)
    return newDate
}

export function isDoctorAvailable(date: Date, available_days: string[]) {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return !available_days.includes(dayOfWeek);
}

export function formatStartEnd(date: Date) {
    const appDateTime = moment.utc(date).add(1, "hours");
    const startTime = moment.utc(appDateTime).format('hh:mm A');
    const endTime = moment.utc(appDateTime).add(20, 'minutes').format('hh:mm A');
    const appointmentTime = `${startTime} - ${endTime}`;
    return appointmentTime
}