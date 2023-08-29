import axios from "axios"

const BASE_URL = "http://localhost:3001/api/v1/notification/"

const getOneNotification = async (id: string, token:string) => {
    const response = await axios.get(`${BASE_URL}${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

const deleteOneNotification = async (id: string, token:string) => {
    const response = await axios.delete(`${BASE_URL}${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

const markOneNotificationAsRead = async (id: string, token:string) => {
    const response = await axios.patch(`${BASE_URL}${id}`, {read: true}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

const getAllNotificationsForPerson = async (token:string) => {
    const response = await axios.get(BASE_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

const markAllAsRead = async (token:string) => {
    const response = await axios.patch(BASE_URL, {}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}

const deleteAllNotifications = async (token:string) => {
    const response = await axios.delete(BASE_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    return response.data
}


const notificationServices = {
    getOneNotification,
    deleteOneNotification,
    markOneNotificationAsRead,
    getAllNotificationsForPerson,
    markAllAsRead,
    deleteAllNotifications
}

export default notificationServices