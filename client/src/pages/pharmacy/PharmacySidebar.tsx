import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'
import {HiOutlineChartBarSquare,HiOutlineDocumentText,HiOutlineDocumentPlus, HiOutlineCog6Tooth} from "react-icons/hi2"

const PharmacySidebar: React.FC = () => {
  
  const location = useLocation()
  const {accessUser} = useSelector(authUser)
  
  return (
    <RootSidebar>
        <Sidebar.Item as={NavLink}
          to={`/pharmacy/${accessUser?.data._id}`}
          active={location.pathname.startsWith('/pharmacy/')}
          icon={HiOutlineChartBarSquare}
        >
            Dashboard
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to={`/medicine`}
          active={location.pathname.startsWith('/medicine')}
          icon={HiOutlineDocumentText}
        >
            Overview
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to={`/add-medicine`}
          active={location.pathname === '/add-medicine'}
          icon={HiOutlineDocumentPlus}
        >
            Add medicine
        </Sidebar.Item>
        <Sidebar.ItemGroup>
        <Sidebar.Item as={NavLink}
          to={`/pharmacy-settings`}
          active={location.pathname.startsWith('/pharmacy-settings')}
          icon={HiOutlineCog6Tooth}
        >
            Settings
        </Sidebar.Item>
        </Sidebar.ItemGroup>
    </RootSidebar>
  )
}

export default PharmacySidebar