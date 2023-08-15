import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser } from '../features/auth/authSlice'
import PatientSidebar from './patient/PatientSidebar'
import DoctorSidebar from './doctor/DoctorSidebar'
import PharmacySidebar from './pharmacy/PharmacySidebar'
import CustomNavbar from '../components/CustomNavbar'

const HomeLayout: React.FC = () => {

  const {accessUser} = useSelector(authUser)

  let color = "";
  if(accessUser?.data.role === 'PATIENT') color = "blue-700"
  if(accessUser?.data.role === 'DOCTOR') color = "gray-300"
  if (accessUser?.data.role === 'PHARMACY') color = "green-500"

  return (
    <div className='flex w-full'>
      <div className=' flex w-full'>
        {accessUser?.data.role === 'PATIENT' && <PatientSidebar />}
        {accessUser?.data.role === 'DOCTOR' && <DoctorSidebar />}
        {accessUser?.data.role === 'PHARMACY' && <PharmacySidebar />}
        <div className='flex flex-col w-full h-screen'>
          <CustomNavbar color={color} />
        <div className='overflow-y-auto flex-grow'>
          <Outlet />
        </div>
      </div>
      </div>
    </div>
  )
}

export default HomeLayout
