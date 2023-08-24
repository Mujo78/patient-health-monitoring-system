import axios from "axios"

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

export function isSunday(date:Date) {
    return date.getDay() === 0;
}

export function isDoctorAvailable(date: Date, available_days: string[]) {
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return !available_days.includes(dayOfWeek);
  }