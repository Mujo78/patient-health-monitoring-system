import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authUser, logout } from '../features/auth/authSlice'
import PatientSidebar from './patient/PatientSidebar'
import DoctorSidebar from './doctor/DoctorSidebar'
import PharmacySidebar from './pharmacy/PharmacySidebar'
import CustomNavbar from '../components/CustomNavbar'
import { useAppDispatch } from '../app/hooks'

const HomeLayout: React.FC = () => {

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {accessUser} = useSelector(authUser)
  const [selectedLink, setSelectedLink] = useState<string>("")

  useEffect(() =>{
    if(!accessUser?.data.active && !accessUser?.data.isVerified){
      dispatch(logout()).then(()=> {
        navigate("/", {replace: true})
      })
    }
  }, [accessUser,navigate, dispatch])

  return (
    <div className='flex w-full'>
      <div className=' flex w-full'>
        {accessUser?.data.role === 'PATIENT' && <PatientSidebar setSelectedLink={setSelectedLink} />}
        {accessUser?.data.role === 'DOCTOR' && <DoctorSidebar setSelectedLink={setSelectedLink} />}
        {accessUser?.data.role === 'PHARMACY' && <PharmacySidebar setSelectedLink={setSelectedLink} />}
        <div className='flex flex-col w-full h-screen'>
          <CustomNavbar selectedLink={selectedLink} />
        <div className='overflow-y-auto flex-grow'>
          <Outlet />
        </div>
      </div>
      </div>
    </div>
  )
}

export default HomeLayout
