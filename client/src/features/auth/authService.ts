
import axios from "axios"
import { LoginUser, ResetPassword } from "./authSlice"

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

const forgotPassword = async(email: string) => {
    const response = await axios.patch(`${BASE_URL}/forgot-password`, {email})

    return response.data;
}

const resetPassword = async (ResetPasswordData: ResetPassword) =>{
    const response = await axios.patch(`${BASE_URL}/reset-password/${ResetPasswordData.token}`, ResetPasswordData)

    return response.data;
}

const authServices = {
    login,
    logout,
    forgotPassword,
    resetPassword
}

export default authServices