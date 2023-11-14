import React from 'react'
import img from "../../assets/check.png"
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'
import CustomButton from '../../components/UI/CustomButton'
import { useNavigate } from 'react-router-dom'



const ForgotPasswordRes: React.FC = () => {

    const {status, message} = useSelector(authUser)
    const navigate = useNavigate();

    const goToLoginPage = () => {
        navigate("/")
    }

  return (
    <div className='h-screen font-Poppins flex justify-center items-center flex-col gap-4'>
    {status === 'idle' ?
       <div className='flex justify-center gap-6 items-center flex-col'>
            <img src={img} className='h-[150px] w-[150px]' />
            <p className='text-md font-semibold'> You have successfully restarted your pasword! </p>
        </div>
              :
        <div className='flex justify-center items-center flex-col'>
            <p className='text-red-600 text-md font-semibold'>{message}</p>
        </div>
    }
    <CustomButton onClick={goToLoginPage}>
            Go to Login Page
          </CustomButton>
    </div>
  )
}

export default ForgotPasswordRes
