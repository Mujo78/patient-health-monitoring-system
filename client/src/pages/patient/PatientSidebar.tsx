import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import {HiOutlineChartBar, HiOutlineCalendarDays,HiOutlineQuestionMarkCircle, HiOutlineBuildingOffice2,HiOutlineCog6Tooth, HiOutlineDocumentText} from "react-icons/hi2"
import { NavLink } from 'react-router-dom'

const PatientSidebar: React.FC = () => {
  return (
    <RootSidebar color='blue-700'>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineChartBar}
          to={"/"}
        >
            Dashboard
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineCalendarDays}
          to={"/appoitments"}
          >
            Appointments
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineBuildingOffice2}
          to={"/medical-staff"}
          >
            Medical staff
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          icon={HiOutlineDocumentText}
          to={"/medicine"}
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
        <Sidebar.Item as={NavLink}
          icon={HiOutlineQuestionMarkCircle}
          to={"/help"}
          >
            Help
        </Sidebar.Item>
        </Sidebar.ItemGroup>
    </RootSidebar>
  )
}

export default PatientSidebar