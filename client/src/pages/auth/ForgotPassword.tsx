import { Label, Tabs, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { authUser, resetPassword } from '../../features/auth/authSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import { resetPasswordValidationSchema } from '../../validations/auth/resetPasswordValidation'
import { HiLockClosed } from 'react-icons/hi2'
import CustomButton from '../../components/CustomButton'
import Logo from '../../components/Logo'
import { useAppDispatch } from '../../app/hooks'
import { useSelector } from 'react-redux'
import img from "../../assets/check.png"

type PasswordReset = {
  password: string,
  passwordConfirm: string
}

const ForgotPassword: React.FC = () => {

  const [step, setStep] = useState<number>(1)
  const {token} = useParams()
  console.log(token)
  const navigate = useNavigate()
  const {register,handleSubmit, formState, getValues} = useForm<PasswordReset>({ resolver: yupResolver(resetPasswordValidationSchema)})
  const {errors} = formState
  const dispatch = useAppDispatch();
  const {status} = useSelector(authUser)

  const goToLoginPage = () => {
    navigate("/")
  }

  const onSubmit = () => {

    const passwordsObject = {
      token: token ? token : "",
      password: getValues().password,
      passwordConfirm: getValues().passwordConfirm
    }

    dispatch(resetPassword(passwordsObject))
    setStep(2)
  }


  return (
    <div className='flex flex-col font-Poppins items-center h-screen w-full'>
      <div className='mr-auto cursor-pointer' onClick={goToLoginPage}>
        <Logo />
      </div>
      <div className='w-1/3'>

      <h1 className='text-4xl font-bold'>
        Reset Password
      </h1>
      <Tabs.Group className='mt-4'>
        <Tabs.Item
          active={step===1}
          disabled={step ===2}
          title='Password reset'
        >
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 px-20'>
          <p className='text-sm mb-4'>
            Set the new password for your account so you can login and access all the features!
          </p>
            <div>
              <Label id='password' value='Password' />
              <TextInput
              {...register("password")}
              id='password'
              color={errors.password && "failure"}
              icon={HiLockClosed}
                type='password'
                />
              <div className='h-3'>
                <p className='text-red-600 text-xs'>{errors.password?.message}</p>
              </div>
            </div>
            <div>
              <Label id='passwordConfirm' value='Confirm Password' />
              <TextInput
              {...register("passwordConfirm")}
                id='passwordConfirm'
                color={errors.passwordConfirm && "failure"}
                icon={HiLockClosed}
                type='password'
              />
              <div className='h-4'>
                <p className='text-red-600 text-xs'>{errors.passwordConfirm?.message}</p>
              </div>
            </div>
            <CustomButton type='submit'>
                Reset Password
            </CustomButton>
          </form>
        </Tabs.Item>
        <Tabs.Item
          disabled={step === 1}
          active={step === 2}
          title='Result'
        >
          <div className='px-20 flex justify-center flex-col gap-4 items-center'>
            {status === 'idle' ? 
              <div className='flex justify-center items-center flex-col'>
                <p className='text-sm'>
                  You have successfully restarted your pasword!
                </p>
                <img src={img} className='h-[150px] w-[150px]' />
              </div>
              :
              <div>
                <p className='text-red-600 text-md font-semibold'>
                  There was an error, please try again later!
                </p>
              </div>
            }
          <CustomButton onClick={goToLoginPage}>
            Go to Login Page
          </CustomButton>
          </div>

        </Tabs.Item>
      </Tabs.Group>
    </div>
    </div>
  )
}

export default ForgotPassword
