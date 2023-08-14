import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import {HiOutlineChartBar,HiOutlineClock, HiOutlineCalendarDays, HiOutlineBuildingOffice2,HiOutlineCog6Tooth, HiOutlineDocumentText} from "react-icons/hi2"
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'

const PatientSidebar: React.FC = () => {

  const {accessUser} = useSelector(authUser)

  return (
    <RootSidebar color='blue-700'>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineChartBar}
          to={`/patient/${accessUser?.data._id}`}
        >
            Dashboard
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineCalendarDays}
          to={"/my-appointments"}
          >
            My Appointments
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineClock}
          to={"/appointment"}
          >
            Book Appointment
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineBuildingOffice2}
          to={"/staff"}
          >
            Medical staff
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineDocumentText}
          to={"/medicine-overview"}
          >
            Medicine
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

export default PatientSidebar