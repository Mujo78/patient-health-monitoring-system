import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import CustomButton from '../../../components/UI/CustomButton'
import { useForm } from 'react-hook-form'
import { patient, personValidationSchema } from '../../../validations/personValidation'
import { yupResolver } from '@hookform/resolvers/yup'
import { Label, TextInput, Select, Spinner } from 'flowbite-react'
import ErrorMessage from '../../../components/UI/ErrorMessage'
import { getMe, updateMe } from '../../../service/personSideFunctions'
import { useSelector } from 'react-redux'
import { authUser, setInfoAccessUser } from '../../../features/auth/authSlice'
import { toast } from 'react-hot-toast'
import { useAppDispatch } from '../../../app/hooks'
import { errorMessageConvert } from '../../../service/authSideFunctions'
import moment from 'moment'

const PersonalInformation: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string> ("")
  const {accessUser} = useSelector(authUser)
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState, reset} = useForm<patient>({resolver: yupResolver(personValidationSchema)})
  const {errors, isDirty} = formState

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(accessUser){
          const response = await getMe(accessUser.token);
          reset(response)
        }
      } catch (err: any) {
        console.log(err)
      } 
  };

  fetchData();
  }, [accessUser, reset])

  const onSubmit = async (data: patient) => {
    const value = moment().isDST() ? 2 : 1
    const formatted = moment(data.date_of_birth).add(value, "hours")
    const realData: unknown = {
      ...data,
      date_of_birth: formatted.toISOString().split('T')[0]
    }

    if(realData && accessUser){
      try{
        setLoading(true)
        const response = await updateMe(accessUser.token, realData)

        if(!response.message){
          reset(response)
          const userInfo = {
            first_name: response.first_name,
            last_name: response.last_name
          }
          setMessage("")
          dispatch(setInfoAccessUser(userInfo))
          toast.success('Successfully updated profile.')
        }else{
          setMessage(response.message)
        }
      }catch(err: any){
        console.log(err)
        setLoading(false)
      }finally{
        setLoading(false)
      }
    }
  }

  return (
    <div className='h-full flex flex-col'>
      <Header text='Personal information' />
      <div className='flex flex-col justify-between h-full'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full h-full flex-col items-center'>
          {loading ? <div className='mx-auto my-auto'>
            <Spinner />
          </div> :
          <div className='w-full flex flex-col h-full justify-center'>
            <div className='w-full flex'>
              <div className='flex-grow mr-5'>
                <Label htmlFor='first_name' className='text-xs' value='First Name'  />
                <TextInput id='first_name' {...register("first_name")} type='text' color={errors.first_name && 'failure'} />
                <ErrorMessage text={errors.first_name?.message} />
              </div>
              <div className='flex-grow ml-5'>
                <Label htmlFor='last_name' className='text-xs' value='Last Name'  />
                <TextInput id='last_name' {...register("last_name")} type='text' color={errors.last_name && 'failure'} />
                <ErrorMessage text={errors.last_name?.message} />
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='w-3/4'>
                <Label htmlFor='address' className='text-xs' value='Address'  />
                <TextInput id='address' {...register("address")} type='text' color={errors.address && 'failure'} />
                <ErrorMessage text={errors.address?.message} />
              </div>
              <div>
                <Label htmlFor='gender' className='text-xs' value='Gender'  />
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
                <Label htmlFor='phone_number' className='text-xs' value='Phone number'  />
                <TextInput id='phone_number' {...register("phone_number")} type='text' color={errors.phone_number && 'failure'} />
                <ErrorMessage text={errors.phone_number?.message || message ? errorMessageConvert(message, "phone_number") : ""} />
              </div>
              <div>
                <Label htmlFor='blood_type' className='text-xs' value='Blood Type'  />
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
              <div>
                <Label htmlFor='date_of_birth' className='text-xs' value='Birth Date'  />
                <TextInput type='date' id='date_of_birth' {...register("date_of_birth")} color={errors.date_of_birth && "failure"} />
                <ErrorMessage text={errors.date_of_birth?.message} />
              </div>
              <div>
                <Label htmlFor='weight' className='text-xs' value='Weight (kg)'  />
                <TextInput type='number' id='weight' {...register("weight")} color={errors.weight && "failure"} />
                <ErrorMessage text={errors.weight?.message} />
              </div>
              <div>
                <Label htmlFor='height' className='text-xs' value='Height (cm)'  />
                <TextInput type='number' id='height' {...register("height")} color={errors.height && "failure"} />
                <ErrorMessage text={errors.height?.message} />
              </div>
            </div>
          </div>}
            <Footer variant={1}>
              <CustomButton type='submit' className='mt-3' disabled={!isDirty}>
                Save
              </CustomButton>
            </Footer>
        </form>
      </div>
    </div>
  )
}

export default PersonalInformation