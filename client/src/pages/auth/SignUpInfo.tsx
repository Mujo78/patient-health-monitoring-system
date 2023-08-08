import React from 'react'
import { Props } from '../LandingPage'
import { Button } from 'flowbite-react'

const SignUpInfo: React.FC<Props> = ({setSignUp}) => {
    const goLogin = () =>{
        setSignUp(n => !n)
    }
  return (
            <div className='font-Poppins'>
                <h1 className=' text-white text-3xl font-bold pb-7 text-center '>Already have an account?</h1>
                <p className='text-white mb-10'>Step into a world of healing and care</p>
                <Button color="gray" className="w-full hover:!text-black" onClick={goLogin}>Log in</Button>
             </div>
  )
}

export default SignUpInfo
