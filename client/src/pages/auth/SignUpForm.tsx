import React, { useEffect, useState } from 'react'
import Logo from '../../components/UI/Logo'
import { Alert, Label, Select, Spinner, TextInput } from 'flowbite-react'
import img from "../../assets/default.jpg"
import { useForm } from 'react-hook-form'
import { useAppDispatch } from '../../app/hooks'
import { PatientUser, authUser, signup } from '../../features/auth/authSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import { signupValidationSchema } from '../../validations/auth/signupValidation'
import ErrorMessage from '../../components/UI/ErrorMessage'
import CustomButton from '../../components/UI/CustomButton'
import { useSelector } from 'react-redux'
import { errorMessageConvert } from '../../service/authSideFunctions'
import {HiOutlineEyeSlash, HiOutlineEye} from 'react-icons/hi2'

const SignUpForm: React.FC = () => {
  const [Image, setImage] = useState("")
  const { register, getValues, handleSubmit, watch, formState, reset} = useForm<PatientUser>({resolver: yupResolver(signupValidationSchema)})
  const {errors} = formState
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const photo = watch('photo')
  const selectedOne = photo?.length > 0 ? photo[0] : null;
  const dispatch = useAppDispatch()
  const {status, message} = useSelector(authUser)

  useEffect(() => {
    let objectURL: string;
    if(selectedOne){
      objectURL = URL.createObjectURL(selectedOne)
      setImage(objectURL)
    }

    return () => URL.revokeObjectURL(objectURL)
  }, [getValues, selectedOne])


  const onSubmit = async (data: PatientUser) => {
    dispatch(signup(data))
  }

  const togglePassword = () =>{
    setShowNewPassword((n) => !n)
  }

  useEffect(() => {
    if(status === 'idle') reset()
  }, [status, reset])

  return (
    <div className='flex h-screen font-Poppins justify-between flex-row-reverse '>
      
      <div className='ml-auto'>
        <Logo />
      </div>
      
      <div className='w-3/4 flex justify-center items-center flex-col'>
        {status === 'loading' ? <Spinner /> :
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className='flex w-full justify-center flex-col items-center'>
        <h1 className='text-4xl font-Poppins flex justify-center mb-6 font-bold'>
            Create a new account
        </h1>
          <div className='w-3/5'>
          <div className='flex justify-between'>
            <div className='border relative rounded-lg'>
              <img src={photo?.length > 0 ? Image : img} className='w-[170px] rounded-lg' />
              <div className='absolute bottom-4 right-2  w-[20px] h-[10px] text-xl font-bold text-white '>
                <label htmlFor="inputFile" className=' bg-blue-700 px-2 rounded-3xl border-2  cursor-pointer border-blue-700'>+</label>
                <input type='file' id='inputFile' {...register("photo")} className='hidden' />
              </div>
            </div>
            <div className='w-3/5'>
              <Label htmlFor='first_name' value='First Name'  />
              <TextInput id='first_name' {...register("first_name")} type='text' color={errors.first_name && 'failure'} />
              <ErrorMessage text={errors.first_name?.message} />

              <Label htmlFor='last_name' value='Last Name'  />
              <TextInput id='last_name' {...register("last_name")} type='text' color={errors.last_name && 'failure'} />
              <ErrorMessage text={errors.last_name?.message} />
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='w-3/4'>
              <Label htmlFor='address' value='Address'  />
              <TextInput id='address' {...register("address")} type='text' color={errors.address && 'failure'} />
              <ErrorMessage text={errors.address?.message} />
            </div>
            <div>
              <Label htmlFor='gender' value='Gender'  />
              <Select id='gender' {...register("gender")} color={errors.gender && 'failure'}>
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
                <option value="Other">
                  Other
                </option>
              </Select>
              <ErrorMessage text={errors.gender?.message} />
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='w-4/5'>
              <Label htmlFor='phone_number' value='Phone number'  />
              <TextInput id='phone_number' {...register("phone_number")} type='text' color={errors.phone_number && 'failure'} />
              <ErrorMessage text={errors.phone_number?.message || message?.includes("phone_number:") ? errorMessageConvert(message, "phone_number") : ""} />
            </div>
            <div>
              <Label htmlFor='blood_type' value='Blood Type'  />
              <Select id='blood_type' {...register("blood_type")} color={errors.blood_type && 'failure'}>
              <option value="A+"> A+ </option>
              <option value="A-"> A- </option>
              <option value="B+"> B+ </option>
              <option value="B-"> B- </option>
              <option value="AB+"> AB+ </option>
              <option value="AB-"> AB- </option>
              <option value="O+"> O+ </option>
              <option value="O-"> O- </option>
              </Select>
              <ErrorMessage text={errors.blood_type?.message} />
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='w-4/6 pr-3'>
              <Label htmlFor='email' value='Email'  />
              <TextInput id='email' {...register("email")} type='text' color={errors.email && 'failure'} />
              <ErrorMessage text={errors.email?.message ? errors.email.message : message.includes("email:") ? errorMessageConvert(message, "email"): ""} />
            </div>
            <div>
              <Label htmlFor='date_of_birth' value='Birth Date'  />
              <TextInput type='date' id='date_of_birth' {...register("date_of_birth")} color={errors.date_of_birth && "failure"} />
              <ErrorMessage text={errors.date_of_birth?.message} />
            </div>
          </div>
            <div>
              <Label htmlFor='password' value='Password'  />
              <div className='relative'>
                <TextInput {...register("password")} id='password' type={showNewPassword ? 'text' : 'password'} color={errors.password && 'failure'} />
                <div 
                 className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                 onClick={togglePassword}
                >
                   {showNewPassword ? (
                                    <HiOutlineEyeSlash />
                                    ) : (
                                    <HiOutlineEye />
                                    )}
                </div>
              </div>
              <ErrorMessage text={errors.password?.message} />
            </div>
            <div>
              <Label htmlFor='passwordConfirm' value='Confirm password'  />
              <TextInput id='passwordConfirm' type='password' {...register("passwordConfirm")} color={errors.passwordConfirm && 'failure'}   />
              <ErrorMessage text={errors.passwordConfirm?.message} />
            </div>
            <div className='flex justify-between'>
              {status === 'idle' && <Alert className='flex items-center justify-center h-10 text-center'><b>Action Required:</b> Please verify your email address.</Alert>}
              <CustomButton className='ml-auto' type='submit'>Sign up</CustomButton>
            </div>
          </div>
        </form>}
        </div>
    </div>
  )
}

export default SignUpForm
