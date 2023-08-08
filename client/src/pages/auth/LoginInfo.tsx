import React from 'react'
import { Props } from '../LandingPage'
import {Button} from "flowbite-react"

const LoginInfo: React.FC<Props> = ({ setSignUp}) => {
    const goSignUp = () =>{
        setSignUp(n => !n)
    }
  return (
            <div className='font-Poppins'>
                <h1 className=' text-white text-4xl font-bold pb-7 text-center '>New here?</h1>
                <p className='text-white text-center mb-10'>Your health, your priority - sign up today!</p>
                <Button color="gray" className='w-full hover:!text-black' onClick={goSignUp}>Sign up</Button>
             </div>
  )
}

export default LoginInfo
