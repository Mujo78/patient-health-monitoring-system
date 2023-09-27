import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import {HiOutlineChartBar,HiOutlineClock, HiOutlineCalendarDays, HiOutlineBuildingOffice2, HiOutlineDocumentText} from "react-icons/hi2"
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'

type Props = {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>
}

const PatientSidebar: React.FC<Props> = ({setSelectedLink}) => {

  const location = useLocation()
  const {accessUser} = useSelector(authUser)

  return (
    <RootSidebar setSelectedLink={setSelectedLink}>
        <Sidebar.Item as={NavLink}
          onClick={() => setSelectedLink("Dashboard")}
          icon={HiOutlineChartBar}
          active={location.pathname.startsWith('/patient/')}
          to={`/patient/${accessUser?.data._id}`}
        >
            Dashboard
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          onClick={() => setSelectedLink("My appointments")}
          icon={HiOutlineCalendarDays}
          active={location.pathname.startsWith('/my-appointments')}
          to={"/my-appointments"}
          >
            My Appointments
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          onClick={() => setSelectedLink("Book Appointment")}
          icon={HiOutlineClock}
          active={location.pathname.startsWith('/appointment')}
          to={"/appointment"}
          >
            Book Appointment
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          onClick={() => setSelectedLink("Medical staff")}
          icon={HiOutlineBuildingOffice2}
          active={location.pathname.startsWith('/staff')}
          to={"/staff"}
          >
            Medical staff
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          onClick={() => setSelectedLink("Medicine")}
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