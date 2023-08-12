import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'

const DoctorSidebar: React.FC  = () => {
  return (
    <RootSidebar color='gray-300'>
        <Sidebar.Item>
            Doctor Sidebar
        </Sidebar.Item>
    </RootSidebar>
  )
}

export default DoctorSidebar