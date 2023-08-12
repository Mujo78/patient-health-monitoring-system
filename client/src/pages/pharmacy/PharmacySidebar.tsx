import React from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Sidebar } from 'flowbite-react'

const PharmacySidebar: React.FC = () => {
  return (
    <RootSidebar color='green-500'>
        <Sidebar.Item>
            Pharmacy Sidebar
        </Sidebar.Item>
    </RootSidebar>
  )
}

export default PharmacySidebar