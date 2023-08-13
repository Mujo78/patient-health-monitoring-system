import axios from "axios"

const BASE_URL = "http://localhost:3001/api/v1/user"

export default async (email: string) => {
    const response = await axios.patch(`${BASE_URL}/forgot-password`, {email})

    return response.data;
}