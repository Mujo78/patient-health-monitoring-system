import React, {useEffect, useState} from 'react'
import { Avatar, Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { authUser, logout, reset } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import {HiOutlineArrowRightOnRectangle, HiOutlineBell} from "react-icons/hi2"
import { useAppDispatch } from '../app/hooks';
import CustomImg from './CustomImg';
import socket from '../socket';
import { addNotification, getPersonNotifications, notification, restartNotifications, restartPersonNotifications } from '../features/notification/notificationSlice';
import NavBarDropdown from './NavBarDropdown';

const CustomNavbar: React.FC = () => {
    const navigate = useNavigate()

    let route;
    const [show, setShow] = useState<boolean>(false)

    const {notifications, personNotifications} = useSelector(notification)
    const {accessUser} = useSelector(authUser)
    const dispatch = useAppDispatch()

    if(accessUser?.data.role === 'PATIENT') route=`/profile/p/${accessUser.data._id}`
    else if(accessUser?.data.role === 'DOCTOR') route=`/profile/d/${accessUser.data._id}`
    else route=`/profile/ph/${accessUser?.data._id}`
    
    useEffect(() =>{
        socket.emit("userLogin", accessUser?.data._id)
        socket.once("first_message", (data) =>{
          dispatch(addNotification(data))
        })

        socket.on("appointment_canceled", (data)=> {
            dispatch(addNotification(data))
        })

        return () =>{
            socket.off('first_message')
            socket.off('appointment_canceled')
        }

    }, [dispatch, accessUser])

    useEffect(() =>{
        dispatch(getPersonNotifications())

        return () => {
            dispatch(restartPersonNotifications())
        }
    }, [dispatch, notifications])

    const logOut = () =>{
        dispatch(restartNotifications())
        dispatch(logout())
        navigate("/", {replace: true})
        dispatch(reset())
    }

    const showNotifications = () =>{
        setShow((n) => !n)
    }

    const notReaded = personNotifications?.map((n) => n.read === false);
    const readed = notReaded.some((value) => value === true)

    const date = new Date();

  return (
    <nav className={`border-t-0 p-2 justify-between items-center font-Poppins w-full flex border-x-0 border-b border-b-gray-200`}>
      <p className='text-sm font-semibold'>{date.toString().slice(0, 16)}</p>
      <div className='flex items-center relative'>
        <Link to={route}>
          <div className='flex items-center'>
            {accessUser && <CustomImg url={accessUser.data.photo} className='w-[30px] mr-1' />}
            <p className='text-xs font-semibold mr-6'>{accessUser?.info.name ? accessUser?.info.name : accessUser?.info.first_name + " " + accessUser?.info.last_name}</p>
          </div>
        </Link>
        <div className="relative">
          <div className="relative cursor-pointer">
            <Avatar
                onClick={showNotifications}
                img={HiOutlineBell}
                status={readed ? 'busy' : undefined}
                statusPosition='top-right'
                size="xs"
                rounded
                className={`p-2 text-gray-800 rounded-lg cursor-pointer hover:!bg-gray-100 ${show && 'bg-gray-100'} `}
            />
          </div>
          {show && <div className='h-80 absolute top-9 left-0 z-30 -ml-54 bg-gray-100 w-64 shadow-lg rounded-b-lg border-t-0 border border-gray-200 '>
                <NavBarDropdown setShow={setShow} />
            </div>}
        </div>
      </div>
      <Button color="light" onClick={logOut} className='flex items-center ml-3 mr-5'>
        <HiOutlineArrowRightOnRectangle />
      </Button>
    </nav>
  )
}

export default CustomNavbar