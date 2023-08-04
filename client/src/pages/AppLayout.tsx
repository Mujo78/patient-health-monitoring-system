import React from 'react'
import {Outlet} from "react-router-dom"

const AppLayout: React.FC = () => {
  return (
    <div className='flex max-w-full'>
        <main className='w-full'>
            <Outlet />
        </main>
    </div>
  )
}

export default AppLayout
