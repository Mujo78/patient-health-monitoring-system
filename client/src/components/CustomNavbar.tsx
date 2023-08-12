import React from 'react'
import { Avatar, Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { authUser, logout, reset } from '../features/auth/authSlice';
import defaultImg from "../assets/default.jpg"
import { Link, useNavigate } from 'react-router-dom';
import {HiOutlineArrowRightOnRectangle} from "react-icons/hi2"
import { useAppDispatch } from '../app/hooks';

type Props = {
    color: string
}

const CustomNavbar: React.FC<Props> = ({color}) => {

    const navigate = useNavigate()
    const {accessUser} = useSelector(authUser)
    const dispatch = useAppDispatch()

    const logOut = () =>{
        dispatch(logout())
        navigate("/", {replace: true})
        dispatch(reset())
    }

    const userPhoto = accessUser !== null && accessUser.data.photo !== "" ? `http://localhost:3001/uploads/${accessUser?.data.photo}` : defaultImg

  return (
    <nav
        className={`border-t-0 p-2 justify-end items-center font-Poppins w-full flex border-x-0 border-b border-b-${color}`}
    >
    
    <Link to="/dashboard">
        <Avatar img={userPhoto}>
            <p className='text-xs font-semibold'>{accessUser?.info.name ? accessUser?.info.name : accessUser?.info.first_name + " " + accessUser?.info.last_name}</p>
        </Avatar>
    </Link>
    <Button color="light" onClick={logOut} className='flex items-center ml-3 mr-5'>
            <HiOutlineArrowRightOnRectangle />
            <p className='text-xs ml-1'>Logout</p>
        </Button>    
  </nav>
  )
}

export default CustomNavbar