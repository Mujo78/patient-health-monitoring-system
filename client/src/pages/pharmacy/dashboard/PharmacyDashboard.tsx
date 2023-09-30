import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { useSelector } from 'react-redux'
import { authUser, firstTime } from '../../../features/auth/authSlice'
import { PharmacyDashboardInfoType, PharmacyDashboardType, pharmacyDashboard, pharmacyDashboardInfo } from '../../../service/pharmacySideFunctions'
import PDashboard from './PDashboard'
import { Spinner } from 'flowbite-react'
import PDashboardInfo from './PDashboardInfo'
import useSelectedPage from '../../../hooks/useSelectedPage'

const PharmacyDashboard: React.FC = () => {

  const dispatch = useAppDispatch()
  const {accessUser} = useSelector(authUser)

  const [loading, setLoading] = useState<boolean>(false)
  const [phDash, setPhDash] = useState<PharmacyDashboardType | undefined>()
  const [phDashInfo, setPhDashInfo] = useState<PharmacyDashboardInfoType | undefined>()

  useSelectedPage("Dashboard")

  useEffect(() => {
    if(accessUser && !accessUser.data.first){
      dispatch(firstTime())
    }
  }, [dispatch, accessUser])

  useEffect(() =>{
    const fetchData = async () => {
        try {
          setLoading(true);
          if(accessUser){
            const response = await pharmacyDashboard(accessUser.token);
            setPhDash(response)
          }
        } catch (err: any) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
    };
  
    fetchData();
  }, [accessUser])

  useEffect(() =>{
    const fetchData = async () => {
        try {
          setLoading(true);
          if(accessUser){
            const response = await pharmacyDashboardInfo(accessUser.token);
            setPhDashInfo(response)
          }
        } catch (err: any) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
    };
  
    fetchData();
  }, [accessUser])


  return (
    <div className='h-full p-6 font-Poppins'>
      {loading ? <div className='flex h-full justify-center items-center'>
        <Spinner size="md" />
      </div> :
      <div className='flex flex-col gap-5 h-full'>
        <div className='w-full flex justify-between h-2/4 transition-all duration-300'>
          {phDash && <PDashboard data={phDash} />}
        </div>
        <div className='flex w-full gap-5 h-2/4'>
          {phDashInfo && <PDashboardInfo data={phDashInfo} />}
        </div>
      </div>
  }
    </div>
  )
}

export default PharmacyDashboard