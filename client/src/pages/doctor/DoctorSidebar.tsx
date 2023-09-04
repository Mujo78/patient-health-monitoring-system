import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'
import {HiOutlineChartPie,HiOutlineUsers, HiOutlineBuildingOffice2, HiOutlineCalendarDays} from "react-icons/hi2"

const DoctorSidebar: React.FC  = () => {
  
  const location = useLocation()
  const {accessUser} = useSelector(authUser)
  
  return (
    <RootSidebar>
        <Sidebar.Item as={NavLink}
          to={`/doctor/${accessUser?.data._id}`}
          active={location.pathname.startsWith('/doctor/')}
          icon={HiOutlineChartPie}
        >
            Dashboard
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to={`/appointments`}
          active={location.pathname.startsWith('/appointments/')}
          icon={HiOutlineCalendarDays}
        >
            My Appointments
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to={`/my-patients`}
          active={location.pathname.startsWith('/my-patients')}
          icon={HiOutlineUsers}
        >
            My Patients
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          active={location.pathname.startsWith('/my-department')}
          to='/my-department'
          icon={HiOutlineBuildingOffice2}
        >
            Department
        </Sidebar.Item>
    </RootSidebar>
  )
}

export default DoctorSidebar