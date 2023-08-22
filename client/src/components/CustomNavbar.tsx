import React from 'react'
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { authUser, logout, reset } from '../features/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import {HiOutlineArrowRightOnRectangle} from "react-icons/hi2"
import { useAppDispatch } from '../app/hooks';
import CustomImg from './CustomImg';

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

    const date = new Date();

  return (
    <nav
        className={`border-t-0 p-2 justify-between items-center font-Poppins w-full flex border-x-0 border-b border-b-${color}`}
    >
    <p className='text-sm font-semibold'>{date.toString().slice(0, 16)}</p>
    <div className='flex items-center'>
        <Link to="/dashboard">
            <div className='flex items-center'>
                <CustomImg url={accessUser?.data.photo} className='w-[50px] mr-1' />
                <p className='text-xs font-semibold mr-6'>{accessUser?.info.name ? accessUser?.info.name : accessUser?.info.first_name + " " + accessUser?.info.last_name}</p>
            </div>
        </Link>
        <Button color="light" onClick={logOut} className='flex items-center ml-3 mr-5'>
                <HiOutlineArrowRightOnRectangle />
                <p className='text-xs ml-1'>Logout</p>
            </Button>    
    </div>
  </nav>
  )
}

export default CustomNavbar