import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'
import {HiOutlineChartBarSquare} from "react-icons/hi2"

const PharmacySidebar: React.FC = () => {
  
  const {accessUser} = useSelector(authUser)
  
  return (
    <RootSidebar color='green-500'>
        <Sidebar.Item as={NavLink}
          to={`/pharmacy/${accessUser?.data._id}`}
          icon={HiOutlineChartBarSquare}
        >
            Dashboard
        </Sidebar.Item>
    </RootSidebar>
  )
}

export default PharmacySidebar