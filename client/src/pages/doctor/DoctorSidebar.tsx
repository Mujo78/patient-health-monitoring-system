import React, { useState } from 'react'
import RootSidebar from '../../components/RootSidebar'
import { Alert, Button, Sidebar } from 'flowbite-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'
import {HiOutlineChartPie,HiOutlineUsers, HiOutlineBuildingOffice2, HiOutlineCalendarDays} from "react-icons/hi2"

type Props = {
  setSelectedLink: React.Dispatch<React.SetStateAction<string>>
}

const DoctorSidebar: React.FC<Props>  = ({setSelectedLink}) => {
  
  const {accessUser} = useSelector(authUser)
  const location = useLocation()
  const [show, setShow] = useState<boolean>(true)

  const handleDissmis = () => {
    setShow(false)
  }
  
  return (
    <RootSidebar setSelectedLink={setSelectedLink}>
        <Sidebar.Item as={NavLink}
          onClick={() => setSelectedLink("Dashboard")}
          to={`/doctor/${accessUser?.data._id}`}
          active={location.pathname.startsWith('/doctor/')}
          icon={HiOutlineChartPie}
        >
            Dashboard
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to={`/appointments`}
          onClick={() => setSelectedLink("My appointments")}
          active={location.pathname.startsWith('/appointments')}
          icon={HiOutlineCalendarDays}
        >
            My Appointments
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          to={`/my-patients`}
          onClick={() => setSelectedLink("My patients")}
          active={location.pathname.startsWith('/my-patients')}
          icon={HiOutlineUsers}
        >
            My Patients
        </Sidebar.Item>
        <Sidebar.Item as={NavLink}
          onClick={() => setSelectedLink("Department")}
          active={location.pathname.startsWith('/my-department')}
          to='/my-department'
          icon={HiOutlineBuildingOffice2}
        >
            Department
        </Sidebar.Item>
        {location.pathname.startsWith('/doctor/') && <div className='flex h-2/3 flex-col justify-center mr-3 flex-grow w-full items-center'>
            {show && <Alert 
              className='bg-gradient-to-b flex justify-between gap-4 flex-col from-blue-600 to-blue-300 mr-3 text-white  w-full h-fit'
              additionalContent={
                <div className='flex flex-col gap-3'>
                  <p className='text-xs'>We're thrilled to have you here! Best wishes for another impactful day in healthcare.</p>
                  <Button className='bg-white ml-auto text-blue-700 mt-3 hover:!bg-gray-200' onClick={handleDissmis} size='xs'>
                  Dismiss
                </Button>
                </div>
              }
              rounded
              >
                <div className='w-full'>
                <p className='text-[16px] mt-3 font-semibold'>{`Welcome, Dr. ${accessUser?.info.last_name}`}!</p>
                
                </div>
            </Alert>}
        </div>}
    </RootSidebar>
  )
}

export default DoctorSidebar