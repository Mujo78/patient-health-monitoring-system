import React, { useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { useSelector } from 'react-redux'
import { authUser, firstTime } from '../../features/auth/authSlice'

const PharmacyDashboard: React.FC = () => {

  const dispatch = useAppDispatch()
  const {accessUser} = useSelector(authUser)

  useEffect(() => {
    if(!accessUser?.data.first){
      dispatch(firstTime())
    }
  }, [dispatch, accessUser])

  return (
    <div>PharmacyDashboard</div>
  )
}

export default PharmacyDashboard