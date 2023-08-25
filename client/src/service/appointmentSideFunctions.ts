import axios from "axios"
import moment from "moment"

const BASE_URL = "http://localhost:3001/api/v1/"
const user = localStorage.getItem("user")
const userObj = user && JSON.parse(user)

export async function getDepartments(){

    const response = await axios.get(`${BASE_URL}department` , {
        headers: {
            "Authorization": `Bearer ${userObj.token}`
        }
    });

    return response.data;
}

export async function getDoctorsForDepartment(name:string) {
    const response = await axios.get(`${BASE_URL + "department/" + name}/doctors`, {
        headers: {
            "Authorization": `Bearer ${userObj.token}`
        }
    });

    return response.data;
}

export async function getDoctor(id: string) {
    const response = await axios.get(`${BASE_URL}doctor/${id}`, {
        headers: {
            "Authorization": `Bearer ${userObj.token}`
        }
    })

    return response.data;
}

type latestApp = {
    appointment_id: string,
    patient_id: string
}

export async function getLatestAppointment(latestApp: latestApp) {

    const response = await axios.post(`${BASE_URL}appointment/${userObj.data._id}/patient-latest-record`, latestApp, {
        headers: {
            "Authorization": `Bearer ${userObj.token}`
        }
    })

    return response.data;
}

export function isSunday(date:Date) {
    return date.getDay() === 0;
}

export function isDoctorAvailable(date: Date, available_days: string[]) {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return !available_days.includes(dayOfWeek);
}

export function formatStartEnd(date: Date) {
    const appDateTime = moment.utc(date).add(2, "hours");
    const startTime = moment.utc(appDateTime).format('hh:mm A');
    const endTime = moment.utc(appDateTime).add(20, 'minutes').format('hh:mm A');
    const appointmentTime = `${startTime} - ${endTime}`;
    return appointmentTime
}