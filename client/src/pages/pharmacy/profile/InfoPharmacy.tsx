import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useSelector } from 'react-redux'
import { authUser, setInfoAccessUser } from '../../../features/auth/authSlice'
import { getData, updateData } from '../../../service/pharmacySideFunctions'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { PharmacyType, PharmacyUpdateType, pharmacyValidationSchema } from '../../../validations/pharmacyValidation'
import { Spinner, TextInput, Label, Textarea } from 'flowbite-react'
import ErrorMessage from '../../../components/ErrorMessage'
import Footer from '../../../components/Footer'
import CustomButton from '../../../components/CustomButton'
import { useAppDispatch } from '../../../app/hooks'
import { toast } from 'react-hot-toast'

const InfoPharmacy: React.FC = () => {

  const {accessUser} = useSelector(authUser)
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState, reset} = useForm<PharmacyType>({resolver: yupResolver(pharmacyValidationSchema)})
  const {errors, isDirty} = formState
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(accessUser){
          const response = await getData(accessUser.token);
          const data = {
            ...response,
            from: response.working_hours.slice(0, response.working_hours.indexOf('AM')).trim(),
            to: response.working_hours.slice(response.working_hours.indexOf('-') + 1, response.working_hours.indexOf('PM')).trim()
          }
          delete data.working_hours
          reset(data)
        }
      } catch (err: any) {
        console.log(err)
      } 
    }
      fetchData()
  }, [accessUser, reset])
  
  const onSubmit = async (data: PharmacyType) => {
    try {
      setLoading(true)
      const dataToSend: PharmacyUpdateType = {
        ...data,
        working_hours: data.from + " AM" + " - " + data.to + ' PM'
      }
      if(accessUser){
        const res = await updateData(dataToSend, accessUser?.token)
        const data = {
          ...res,
          from: res.working_hours.slice(0, res.working_hours.indexOf('AM')).trim(),
          to: res.working_hours.slice(res.working_hours.indexOf('-') + 1, res.working_hours.indexOf('PM')).trim()
        }
        reset(data)
        dispatch(setInfoAccessUser({name: data.name}))
        toast.success('Successfully updated profile.')
      }
      setLoading(false)      
    } catch (error) {
      setLoading(false)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-between h-full'>
        <Header text='General information' />
        <form onSubmit={handleSubmit(onSubmit)} className='flex w-full h-full flex-col items-center'>
          {loading ? <div className='mx-auto my-auto'>
            <Spinner />
          </div> :
          <div className='w-full flex flex-col h-full justify-center'>
            <div className='w-full flex'>
              <div className='flex-grow mr-5 text-xs'>
                <Label htmlFor='name' className='text-xs' value='Name'  />
                <TextInput id='name' {...register("name")} type='text' className='text-xs mt-1' color={errors.name && 'failure'} />
                <ErrorMessage text={errors.name?.message} className='text-xs' />
              </div>
              <div className='flex-grow w-2/6 ml-auto text-xs '>
                <Label htmlFor='from' className='text-xs' value='Working Hours (from - to)' />
                <div className='flex mt-1 items-center'>
                  <TextInput id='from' {...register("from")} min={1} max={12} type='number' className='text-xs mr-4 w-1/4' color={errors.from && 'failure'} />
                  <TextInput {...register("to")} className='text-xs w-1/4 mr-3' min={1} max={12} type='number' color={errors.to && 'failure'} />
                    <p className='text-[16px]'>
                    AM - PM
                      </p> 
                </div>
                  <ErrorMessage text={errors.from?.message || errors.to?.message} />
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='w-3/4 mr-2'>
                <Label htmlFor='address' className='text-xs' value='Address'  />
                <TextInput id='address' {...register("address")} type='text' className='text-xs mt-1' color={errors.address && 'failure'} />
                <ErrorMessage text={errors.address?.message} />
              </div>
              <div className='w-4/5 ml-2'>
                <Label htmlFor='phone_number' className='text-xs' value='Phone number'  />
                <TextInput id='phone_number' {...register("phone_number")} type='text' color={errors.phone_number && 'failure'} className='mt-1 text-xs' />
                <ErrorMessage text={errors.phone_number?.message} />
              </div>
            </div>
              <div className='w-full'>
                <Label htmlFor='description' className='text-xs' value='Description'  />
                <Textarea id='description' {...register("description")} color={errors.description && 'failure'} rows={4} className='text-xs mt-1' />
                <ErrorMessage text={errors.description?.message} />
              </div>
          </div>}
            <Footer variant={1}>
              <CustomButton type='submit' className='mt-3' disabled={loading || !isDirty}>
                Save
              </CustomButton>
            </Footer>
        </form>
    </div>
  )
}

export default InfoPharmacy