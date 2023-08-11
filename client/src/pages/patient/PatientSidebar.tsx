import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'

const PatientSidebar: React.FC = () => {
  return (
    <RootSidebar>
        <Sidebar.Item>
            Dashboard
        </Sidebar.Item>
    </RootSidebar>
  )
}

export default PatientSidebar