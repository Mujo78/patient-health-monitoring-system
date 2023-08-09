import React from 'react'
import { logout } from '../features/auth/authSlice'
import { Button } from 'flowbite-react'
import { useAppDispatch } from '../app/hooks'

const HomeLayout: React.FC = () => {
  const dispatch = useAppDispatch()

  return (
    <div>
      Home
      <Button onClick={() => dispatch(logout())}>Logout</Button>
    </div>
  )
}

export default HomeLayout
