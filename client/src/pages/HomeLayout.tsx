import React, { useEffect } from 'react'
import { logout } from '../features/auth/authSlice'
import { Button } from 'flowbite-react'
import { useAppDispatch } from '../app/hooks'
import { useNavigate } from 'react-router-dom'

const HomeLayout: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = localStorage.getItem('user')

  useEffect(() =>{
    if(user === null){
      navigate("/")
    }
  }, [navigate, user])

  return (
    <div>
      Home
      <Button onClick={() => dispatch(logout())}>Logout</Button>
    </div>
  )
}

export default HomeLayout
