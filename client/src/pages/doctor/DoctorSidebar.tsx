import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'
import {HiOutlineChartPie,HiOutlineUsers, HiOutlineBuildingOffice2, HiOutlineCalendarDays, HiOutlineCog6Tooth} from "react-icons/hi2"

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
        <Sidebar.Item as={NavLink}
          to={`/appointments`}
          icon={HiOutlineCalendarDays}
        >
            My Appointments
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to={`/my-patients`}
          icon={HiOutlineUsers}
        >
            My Patients
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to='/my-department'
          icon={HiOutlineBuildingOffice2}
        >
            Department
        </Sidebar.Item>
        <Sidebar.ItemGroup>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineCog6Tooth}
          to={"/settings"}
          >
            Settings
        </Sidebar.Item>
        </Sidebar.ItemGroup>
    </RootSidebar>
  )
}

export default DoctorSidebar