import React, { useEffect } from 'react'
import CustomButton from '../../components/CustomButton'
import { useNavigate, useParams } from 'react-router-dom'
import img from "../../assets/check.png"
import hospitalImg from "../../assets/hospital-logo.jpg"
import { useAppDispatch } from '../../app/hooks'
import { useSelector } from 'react-redux'
import { authUser, reset, verifyEmailAddress } from '../../features/auth/authSlice'
import { Spinner } from 'flowbite-react'

const VerificationPage: React.FC = () => {
  
    const {verificationToken} = useParams()
    const navigate = useNavigate()

    console.log(verificationToken)
    const goToLogin = () =>{
        dispatch(reset())
        navigate("/")
    }
    const dispatch = useAppDispatch()
    const {status, message} = useSelector(authUser)

    useEffect(() =>{
        dispatch(reset())
    }, [dispatch])

    const verifyMyEmail = () =>{
        if(verificationToken) {
            dispatch(verifyEmailAddress(verificationToken))
        }
    }


    if(status === 'loading') return <Spinner />
    if(status === 'idle') return (
        <div className='flex flex-col justify-center h-screen items-center'>
            <img src={img} className='mb-10' />
            <h1 className='font-Poppins text-3xl mb-10 font-bold'>You have successfully verified your email address!</h1>
            <CustomButton onClick={goToLogin}>Login</CustomButton>
        </div>
    )
    if(status === 'failed') return (
        <div className='flex flex-col gap-3 font-Poppins justify-center h-screen items-center'>
            <h1 className='text-3xl mb-10 text-red-600 font-bold'>{message}</h1>
            <p className='font-sm text-red-600'>Please try again later!</p>
            <CustomButton onClick={goToLogin}>Login</CustomButton>
        </div>
    )

    return (
        <div>
            <div className='flex h-screen font-Poppins gap-4 flex-col justify-center items-center'>
                <img src={hospitalImg} className='w-[160px]' />
                <h1 className='text-3xl font-bold'>Email verification</h1>
                <p>Please click the button below to verify your email address!</p>
                <CustomButton onClick={verifyMyEmail}>Verify Email</CustomButton>
            </div>         
        </div>
  )
}

export default VerificationPage
