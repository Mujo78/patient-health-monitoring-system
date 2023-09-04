import React, { useState } from 'react'
import Header from '../../../components/Header'
import { yupResolver } from '@hookform/resolvers/yup'
import { Label, Spinner, TextInput } from 'flowbite-react'
import CustomButton from '../../../components/CustomButton'
import { useForm } from 'react-hook-form'
import { authUser, changePassword, changePasswordInterface } from '../../../features/auth/authSlice'
import { changePasswordValidationSchema } from '../../../validations/auth/changePasswordValidation'
import {HiOutlineEye, HiOutlineEyeSlash} from "react-icons/hi2"
import ErrorMessage from '../../../components/ErrorMessage'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../../app/hooks'
import { toast } from 'react-hot-toast'


const Security: React.FC = () => {

  const dispatch = useAppDispatch()
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false)
  const { register, handleSubmit, formState, reset} = useForm<changePasswordInterface>({resolver: yupResolver(changePasswordValidationSchema)})
  const {errors} = formState

  const {status, message} = useSelector(authUser)

  const toggleNewPassword = () => {
    setShowNewPassword((n) => !n)
  }

  const toggleConfirmNewPassword = () => {
    setShowConfirmNewPassword((n) => !n)
  }

  const onSubmit = (data: changePasswordInterface) => {
    dispatch(changePassword(data)).then((action) =>{
      if(typeof action.payload === 'object'){
        toast.success('Successfully changed password.')
        reset()
      }
    })
  }

  return (
    <div className='flex flex-col justify-between h-full'>
      <Header text='Security' />
      {status=== 'loading' ? 
        <div className='mx-auto my-auto'>
          <Spinner />
          </div> :
      <div className='flex w-full justify-around h-full items-center'>
        <div className=''>
          <h1 className='font-semibold mb-4 text-3xl text-left'>Change password</h1>
          <p className='text-sm mb-1'>Password suggestion:</p>
          <ol className='text-xs list-disc ml-6 text-gray-500'>
            <li>At least 6 characters</li>
            <li>At least 1 upper case letter (A-Z)</li>
            <li>At least 1 lower case letter (a-z)</li>
            <li>At least 1 number (0-9)</li>
          </ol>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-2/5 my-auto flex-col">
        <div className="relative">
          <div className="mb-1 block">
            <Label
              className='text-xs'
              htmlFor="currentPassword"
              value="Current Password"
            />
          </div>
          <TextInput
            id="currentPassword"
            required
            color={errors.currentPassword && 'failure'}
            {...register("currentPassword")}
            type='password'
          />
          <div className='h-4'>
              {errors.currentPassword ?
                <ErrorMessage text={errors.currentPassword?.message} className='mt-1' size='xs' />
                : status === 'failed' &&  <ErrorMessage text={message} className='mt-1' size='xs' />
              }
          </div>
        </div>
        <div>
            <div className="mb-1 block">
              <Label
                className='text-xs'
                htmlFor="newPassword"
                value="New password"
              />
            </div>
            <div className="relative">
            <TextInput
              id="newPassword"
              required
              color={errors.newPassword && 'failure'}
              {...register("newPassword")}
              type={showNewPassword ? 'text' : 'password'}
            />
            <div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={toggleNewPassword}
            >
              {showNewPassword ? (
                <HiOutlineEyeSlash />
                ) : (
                  <HiOutlineEye />
                  )}
            </div>
          </div>
          <ErrorMessage text={errors.newPassword?.message} className='mt-1' size='xs' />
        </div>
        <div className="relative">
            <div className="mb-1 block">
              <Label
                className='text-xs'
                htmlFor="confirmNewPassword"
                value="Confirm New Password"
              />
            </div>
            <div className='relative'>
              <TextInput
                id="confirmNewPassword"
                required
                color={errors.confirmNewPassword && 'failure'}
                {...register("confirmNewPassword")}
                type={showConfirmNewPassword ? 'text' : 'password'}
              />
              <div
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleConfirmNewPassword}
              >
                {showConfirmNewPassword ? (
                  <HiOutlineEyeSlash />
                ) : (
                  <HiOutlineEye />
                )}
              </div>
            </div>
            <ErrorMessage text={errors.confirmNewPassword?.message} className='mt-1' size='xs' />
        </div>
        <CustomButton type="submit" className='mt-3'>
          Register new account
        </CustomButton>
      </form>
    </div>
    }
    </div>
  )
}

export default Security