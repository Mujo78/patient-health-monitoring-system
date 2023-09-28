import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import {HiOutlineChartBar,HiOutlineClock, HiOutlineCalendarDays, HiOutlineBuildingOffice2, HiOutlineDocumentText} from "react-icons/hi2"
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'

const PatientSidebar: React.FC= () => {

  const location = useLocation()
  const {accessUser} = useSelector(authUser)

  const handleClick = (name: string) => {
    localStorage.setItem("selectedLink", name)
  }

  return (
    <RootSidebar setSelectedLink={handleClick}>
        <Sidebar.Item as={NavLink}
          onClick={() => handleClick("Dashboard")}
          icon={HiOutlineChartBar}
          active={location.pathname.startsWith('/patient/')}
          to={`/patient/${accessUser?.data._id}`}
        >
            Dashboard
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          onClick={() => handleClick("My appointments")}
          icon={HiOutlineCalendarDays}
          active={location.pathname.startsWith('/my-appointments')}
          to={"/my-appointments"}
          >
            My Appointments
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          onClick={() => handleClick("Book Appointment")}
          icon={HiOutlineClock}
          active={location.pathname.startsWith('/appointment')}
          to={"/appointment"}
          >
            Book Appointment
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          onClick={() => handleClick("Medical staff")}
          icon={HiOutlineBuildingOffice2}
          active={location.pathname.startsWith('/staff')}
          to={"/staff"}
          >
            Medical staff
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          onClick={() => handleClick("Medicine")}
          icon={HiOutlineDocumentText}
          active={location.pathname === '/medicine-overview'}
          to={"/medicine-overview"}
          >
            Medicine
        </Sidebar.Item>
    </RootSidebar>
  )
}

export default PatientSidebar