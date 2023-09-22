
import React, { useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { useSelector } from 'react-redux'
import { authUser, firstTime } from '../../features/auth/authSlice'
import AppointmentReviewCalendar from '../../components/AppointmentReviewCalendar'

const DoctorDashboard: React.FC = () => {

  const dispatch = useAppDispatch()
  const {accessUser} = useSelector(authUser)

  useEffect(() =>{
    if(!accessUser?.data.first){
      dispatch(firstTime())
    }
  }, [dispatch, accessUser])

  return (
    <div className='h-full w-full p-6'>
      <div className=' h-full w-2/5 flex justify-end'>
          <AppointmentReviewCalendar variant={2} />
        </div>
    </div>
  )
}

export default DoctorDashboard