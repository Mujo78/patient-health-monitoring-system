import React from 'react'
import { Props } from '../LandingPage'
import {Button} from "flowbite-react"

const LoginInfo: React.FC<Props> = ({ setSignUp}) => {
    const goSignUp = () =>{
        setSignUp(n => !n)
    }
  return (
            <>
                <h1 className=' font-Rubik font-Poppins text-gray-300 text-4xl font-bold pb-7 text-center '>Login to be part of PHMS Family</h1>
                <p className='text-gray-300 font-Poppins mb-10'>It to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
                <Button color="light" onClick={goSignUp}>Sign up</Button>
             </>
  )
}

export default LoginInfo
