
import axios from "axios"
import { LoginUser, PatientUser, ResetPassword } from "./authSlice"

const BASE_URL = "http://localhost:3001/api/v1/user"

const login = async(loginData: LoginUser) => {
    const response = await axios.post(`${BASE_URL}/login`, loginData)

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const signup = async(signupData: PatientUser) => {
    const form = new FormData()
    form.append("first_name", signupData.first_name)
    form.append("last_name", signupData.last_name)
    form.append("phone_number", signupData.phone_number)
    form.append("address", signupData.address)
    form.append("gender", signupData.gender)
    form.append("photo", signupData.photo ? signupData.photo[0] : "")
    form.append("blood_type", signupData.blood_type)
    form.append("date_of_birth", signupData.date_of_birth.toString())
    form.append("email", signupData.email)
    form.append("password", signupData.password)
    form.append("passwordConfirm", signupData.passwordConfirm)
    
    const response = await axios.post(`${BASE_URL}/signup`, form, {
        headers: {
            "Content-Type" : "multipart/form-data"
        }
    })

    return response.data;
}

const logout = () => {
    localStorage.removeItem("user")
}

const resetPassword = async (ResetPasswordData: ResetPassword) =>{
    const response = await axios.patch(`${BASE_URL}/reset-password/${ResetPasswordData.token}`, ResetPasswordData)

    return response.data;
}

const verifyEmail = async (verificationToken:string) => {
    const response = await axios.get(`${BASE_URL}/verify/${verificationToken}`)

    return response.data;
} 

const authServices = {
    login,
    logout,
    resetPassword,
    signup,
    verifyEmail
}

export default authServices