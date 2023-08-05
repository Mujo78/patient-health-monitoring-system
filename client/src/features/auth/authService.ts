
import axios from "axios"
import { LoginUser } from "./authSlice"

const BASE_URL = "http://localhost:3001/api/v1/user"

const login = async(loginData: LoginUser) => {
    const response = await axios.post(`${BASE_URL}/login`, loginData)

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const logout = () => {
    localStorage.removeItem("user")
}

const authServices = {
    login,
    logout
}

export default authServices