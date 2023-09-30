
import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { useSelector } from 'react-redux'
import { authUser, firstTime } from '../../../features/auth/authSlice'
import AppointmentReviewCalendar from '../../../components/AppointmentReviewCalendar'
import DocDashboardInfo from './DocDashboardInfo'
import DocDashboard from './DocDashboard'
import { DocDashboardInfoType, DocDashboardType, doctorDashboard, doctorDashboardInfo } from '../../../service/appointmentSideFunctions'
import { Spinner } from 'flowbite-react'
import useSelectedPage from '../../../hooks/useSelectedPage'

const DoctorDashboard: React.FC = () => {

  const dispatch = useAppDispatch()
  const {accessUser} = useSelector(authUser)
  const [loading, setLoading] = useState<boolean>(false)
  const [docDashInfo, setDocDashInfo] = useState<DocDashboardType | undefined>()   
  const [docDash, setDocDash] = useState<DocDashboardInfoType | undefined>()

  useEffect(() =>{
    if(accessUser && !accessUser.data.first){
      dispatch(firstTime())
    }
  }, [dispatch, accessUser])

  useEffect(() => {
    const fetchData = async () =>{
        try{
            setLoading(true)
            if(accessUser){
                const response = await doctorDashboard(accessUser.token)
                setDocDashInfo(response)
            }
        }catch(err) {
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }
    fetchData();
  }, [accessUser])

  useEffect(() => {
    const fetchData = async () =>{
        try{
            setLoading(true)
            if(accessUser){
                const response = await doctorDashboardInfo(accessUser.token)
                setDocDash(response)
            }
        }catch(err) {
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }
    fetchData();
  }, [accessUser])

  useSelectedPage("Dashboard")

  return (
    <div className='h-full w-full p-6 gap-5 font-Poppins flex transition-all duration-600'>
      {loading ? 
      <div className='flex justify-center w-full h-full items-center'>
        <Spinner size="xl" />
      </div> :
      <>
        <div className='w-4/6 h-full flex justify-between flex-col'>
          {docDashInfo && <DocDashboard docDashInfo={docDashInfo} />}
        </div>
        <div className='w-2/5 h-full flex justify-center'>
          <div className='flex flex-col justify-between'>
            {docDash && <DocDashboardInfo docDash={docDash} />}
          </div>
        </div>
        <div className='h-full w-2/5 flex justify-end'>
          <AppointmentReviewCalendar variant={2} />
        </div>
      </>}
    </div>
  )
}

export default DoctorDashboard