import React from 'react'
import { Props } from '../LandingPage'
import {Button} from "flowbite-react"
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'

const LoginInfo: React.FC<Props> = ({ setSignUp}) => {

  const {status} = useSelector(authUser)

    const goSignUp = () =>{
        setSignUp(n => !n)
    }
  return (
            <div className='font-Poppins flex flex-col gap-10'>
                <h1 className=' text-white text-4xl font-bold text-center '>New here?</h1>
                <p className='text-white text-center'>Your health, your priority - sign up today!</p>
                <Button disabled={status === 'loading'} color="gray" className='w-full hover:!text-black' onClick={goSignUp}>Sign up</Button>
             </div>
  )
}

export default LoginInfo
