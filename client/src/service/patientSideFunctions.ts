import axios from "axios";

const BASE_URL = "http://localhost:3001/api/v1/appointment"
const user = localStorage.getItem("user")
const userObj = user && JSON.parse(user)

/*

router.get("/doctor-patients/:id", restrictTo("DOCTOR"), getPatientsForDoctor)
router.get("/search/:id", restrictTo("DOCTOR"), getPatientsForDoctorBySearch)

*/

export async function getPatientsForDoctor(page : number) {

    const response = await axios.get(`${BASE_URL}/doctor-patients/${userObj.data._id}?page=${page}`, {
        headers: {
            "Authorization": `Bearer ${userObj.token}`
        }
    })

    return response.data;
}

export async function searchForPatient(searchQuery: string, page: number) {

    const response = await axios.get(`${BASE_URL}/search/${userObj.data._id}?searchQuery=${searchQuery ||'none'}&page=${page || 'none'}`, {
        headers: {
            "Authorization": `Bearer ${userObj.token}`
        }
    })

    return response.data
}