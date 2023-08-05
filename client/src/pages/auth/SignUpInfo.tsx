import React from 'react'
import { Props } from '../LandingPage'
import { Button } from 'flowbite-react'

const SignUpInfo: React.FC<Props> = ({setSignUp}) => {
    const goLogin = () =>{
        setSignUp(n => !n)
    }
  return (
            <>
                <h1 className=' font-Rubik text-gray-300 text-4xl font-bold pb-7 text-center '>Sign up</h1>
                <p className='text-gray-300 mb-10'>It maining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
                <Button color="light" onClick={goLogin}>Log in</Button>
             </>
  )
}

export default SignUpInfo
