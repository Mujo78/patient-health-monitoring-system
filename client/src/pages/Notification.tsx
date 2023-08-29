import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../app/hooks'
import { useSelector } from 'react-redux'
import { addNotification, notification } from '../features/notification/notificationSlice'
import { Button, Spinner } from 'flowbite-react'
import socket from "../socket"
import { authUser } from '../features/auth/authSlice'

const Notification: React.FC = () => {

  /*
    // Not completed
    const dispatch = useAppDispatch()
    const {accessUser} = useSelector(authUser)
    const {notifications} = useSelector(notification)
    const [h, setH] = useState()

    useEffect(() =>{
        socket.emit("welcome_message", accessUser.data._id)

        socket.on("first_message", (data) =>{
          dispatch(addNotification(data))
        })

        return () =>{
            socket.off('first_message')
        }

    }, [dispatch, accessUser])
    console.log(notifications)
    */
  return (
    <div>
     OK</div>
  )
}

export default Notification