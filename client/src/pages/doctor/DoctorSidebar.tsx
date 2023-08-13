import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'
import {HiOutlineChartPie} from "react-icons/hi2"

const DoctorSidebar: React.FC  = () => {
  
  const {accessUser} = useSelector(authUser)
  
  return (
    <RootSidebar color='gray-300'>
        <Sidebar.Item as={NavLink}
          to={`/doctor/${accessUser?.data._id}`}
          icon={HiOutlineChartPie}
        >
            Dashboard
        </Sidebar.Item>
    </RootSidebar>
  )
}

export default DoctorSidebar