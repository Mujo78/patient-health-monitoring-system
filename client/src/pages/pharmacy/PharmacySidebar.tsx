import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'
import {HiOutlineChartBarSquare,HiOutlineDocumentText,HiOutlineDocumentPlus} from "react-icons/hi2"

type Props = {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>
}

const PharmacySidebar: React.FC<Props> = ({setSelectedLink}) => {
  
  const location = useLocation()
  const {accessUser} = useSelector(authUser)
  
  return (
    <RootSidebar setSelectedLink={setSelectedLink}>
        <Sidebar.Item as={NavLink}
          to={`/pharmacy/${accessUser?.data._id}`}
          onClick={() => setSelectedLink("Dashboard")}
          active={location.pathname.startsWith('/pharmacy/')}
          icon={HiOutlineChartBarSquare}
        >
            Dashboard
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to={`/medicine`}
          onClick={() => setSelectedLink("Medicine overview")}
          active={location.pathname.startsWith('/medicine')}
          icon={HiOutlineDocumentText}
        >
            Overview
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to={`/add-medicine`}
          onClick={() => setSelectedLink("Add medicine")}
          active={location.pathname === '/add-medicine'}
          icon={HiOutlineDocumentPlus}
        >
            Add medicine
        </Sidebar.Item>
    </RootSidebar>
  )
}

export default PharmacySidebar