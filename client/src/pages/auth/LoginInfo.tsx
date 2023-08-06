import React from 'react'
import { Props } from '../LandingPage'
import {Button} from "flowbite-react"

const LoginInfo: React.FC<Props> = ({ setSignUp}) => {
    const goSignUp = () =>{
        setSignUp(n => !n)
    }
  return (
            <>
                <h1 className=' font-Rubik font-Poppins text-white text-4xl font-bold pb-7 text-center '>New here?</h1>
                <p className='text-white text-center font-Poppins mb-10'>Your health, your priority - sign up today!</p>
                <Button color="gray" className='font-Poppins hover:!text-black' onClick={goSignUp}>Sign up</Button>
             </>
  )
}

export default LoginInfo
