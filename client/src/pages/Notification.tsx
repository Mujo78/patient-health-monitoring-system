import React, { useEffect } from 'react'
import { useAppDispatch } from '../app/hooks'
import { useSelector } from 'react-redux'
import { addNotification, notification } from '../features/notification/notificationSlice'
import { Spinner } from 'flowbite-react'

import {io} from 'socket.io-client'

const socket = io('http://localhost:3001')

const Notification: React.FC = () => {

    // Not completed
    const dispatch = useAppDispatch()
    const {notifications} = useSelector(notification)

    useEffect(() =>{
        console.log(socket)
        socket.on("welcomeMessage", (message) => console.log(message))

        return () =>{
            socket.off('welcomeMessage')
        }

    }, [])
    
    console.log(notifications)
  return (
    <div>{!notifications ? <Spinner /> : <>
        {notifications.map((n) => (
                        <p key={1}>{n}</p>
                    ))}
    </>}</div>
  )
}

export default Notification