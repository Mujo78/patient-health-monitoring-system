import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import {HiOutlineChartBar,HiOutlineClock, HiOutlineCalendarDays, HiOutlineBuildingOffice2,HiOutlineCog6Tooth, HiOutlineDocumentText} from "react-icons/hi2"
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'

const PatientSidebar: React.FC = () => {

  const location = useLocation()
  const {accessUser} = useSelector(authUser)

  return (
    <RootSidebar>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineChartBar}
          active={location.pathname.startsWith('/patient/')}
          to={`/patient/${accessUser?.data._id}`}
        >
            Dashboard
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineCalendarDays}
          active={location.pathname === '/my-appointments'}
          to={"/my-appointments"}
          >
            My Appointments
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineClock}
          active={location.pathname.startsWith('/appointment/new')}
          to={"/appointment"}
          >
            Book Appointment
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineBuildingOffice2}
          active={location.pathname.startsWith('/staff')}
          to={"/staff"}
          >
            Medical staff
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineDocumentText}
          active={location.pathname === '/medicine-overview'}
          to={"/medicine-overview"}
          >
            Medicine
        </Sidebar.Item>
        <Sidebar.ItemGroup>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineCog6Tooth}
          active={location.pathname.startsWith('/settings')}
          to={"/settings"}
          >
            Settings
        </Sidebar.Item>
        </Sidebar.ItemGroup>
    </RootSidebar>
  )
}

export default PatientSidebar