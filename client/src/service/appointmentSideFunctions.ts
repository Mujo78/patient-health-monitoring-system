import axios from "axios"

const BASE_URL = "http://localhost:3001/api/v1/department/"

export async function getDepartments(){

    const user = localStorage.getItem("user")
    const {token} = user && JSON.parse(user)

    const response = await axios.get(BASE_URL, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;
}

export async function getDoctorsForDepartment(name:string) {
    const user = localStorage.getItem("user")
    const {token} = user && JSON.parse(user)

    const response = await axios.get(`${BASE_URL + name}/doctors`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    return response.data;

}