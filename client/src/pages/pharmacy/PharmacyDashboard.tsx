import React, { useEffect } from 'react'
import { useAppDispatch } from '../../app/hooks'
import { useSelector } from 'react-redux'
import { authUser, firstTime } from '../../features/auth/authSlice'
import { Card } from 'flowbite-react'

const PharmacyDashboard: React.FC = () => {

  const dispatch = useAppDispatch()
  const {accessUser} = useSelector(authUser)

  useEffect(() => {
    if(accessUser && !accessUser.data.first){
      dispatch(firstTime())
    }
  }, [dispatch, accessUser])

  return (
    <div>
      <Card>

      </Card>
    </div>
  )
}

export default PharmacyDashboard