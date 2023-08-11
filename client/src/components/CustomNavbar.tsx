import React from 'react'
import { Avatar, Navbar } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { authUser } from '../features/auth/authSlice';
import defaultImg from "../assets/default.jpg"
import { Link } from 'react-router-dom';
import {HiOutlineArrowRightOnRectangle} from "react-icons/hi2"


const CustomNavbar: React.FC = () => {

    const {accessUser} = useSelector(authUser)
    console.log(accessUser)

    let color;
    if(accessUser.data.role === 'PATIENT') color = "blue-700"
    else if(accessUser.data.role === 'DOCTOR') color = "gray-300"
    else color = "green-500"

    const userPhoto = accessUser.data.photo !== "" ? `http://localhost:3001/uploads/${accessUser.data.photo}` : defaultImg
    console.log(userPhoto)

  return (
    <nav
        className={`border-t-0 p-2 justify-end items-center font-Poppins w-full flex border-x-0 border-b border-b-blue-700`}
    >
    
    <Link to="/dashboard">
        <Avatar img={userPhoto}>
            <p className='text-xs font-semibold'>{accessUser.info.first_name + " " + accessUser.info.last_name}</p>
        </Avatar>
    </Link>
    <Link to={"/"} className='flex items-center ml-3 mr-5'>
            <HiOutlineArrowRightOnRectangle />
            <p className='text-xs ml-1'>Logout</p>
        </Link>    
  </nav>
  )
}

export default CustomNavbar