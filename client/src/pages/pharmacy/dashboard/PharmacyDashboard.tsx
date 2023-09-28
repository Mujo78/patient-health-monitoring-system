import React, { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { useSelector } from 'react-redux'
import { authUser, firstTime } from '../../../features/auth/authSlice'
import { PharmacyDashboardType, pharmacyDashboard } from '../../../service/pharmacySideFunctions'
import PDashboard from './PDashboard'
import { Spinner } from 'flowbite-react'

const PharmacyDashboard: React.FC = () => {

  const dispatch = useAppDispatch()
  const {accessUser} = useSelector(authUser)

  const [loading, setLoading] = useState<boolean>(false)
  const [phdash, setPhDash] = useState<PharmacyDashboardType | undefined>()

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
          console.log(err)
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
      <div>
        <div className='w-full flex justify-between transition-all duration-300'>
          {phdash && <PDashboard data={phdash} />}
        </div>
        <div>

        </div>
      </div>
  }
    </div>
  )
}

export default PharmacyDashboard