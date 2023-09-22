import { Card, Spinner, Table } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import Calendar from 'react-calendar'
import { Value } from '../pages/patient/appointment/MakeAppointment'
import { formatStartEnd, isCurrentAppointment } from '../service/appointmentSideFunctions'
import CustomImg from './CustomImg'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { useSelector } from 'react-redux'
import { appointment, getAppointmentsForADay, resetAppointmentDay } from '../features/appointment/appointmentSlice'
import {HiXCircle} from "react-icons/hi2"

type Props = {
    variant: 1 | 2
}

const AppointmentReviewCalendar: React.FC<Props> = ({variant}) => {

    const navigate = useNavigate()
    const [value, setValue] = useState<Value>(new Date())
    const monthyear = value?.toLocaleString('en-US', {month: 'long', year: 'numeric'})

    const {selectedDayAppointments, status} = useSelector(appointment)
    const dispatch = useAppDispatch()
    const todaysDate = useRef<unknown>(null);
  
    const handleNavigate = (id: string) => {
        navigate(`${variant === 1 ? `/my-appointments/${id}` : `/appointments/${id}`}`)
      }

      useEffect(() => {
       
        if(value){
            if(todaysDate.current !== value){
                dispatch(getAppointmentsForADay(value as Date))
                todaysDate.current = value
            }
        }

        return () => {
            dispatch(resetAppointmentDay())
        }
      }, [dispatch, value])

      const cancelAppointmentNow = () => {
        console.log("object")
      }
    

  return (
          <Card className='max-w-xs flex justify-end items-start flex-col h-full'>
            <div className='mb-auto'>
              <p className='text-center mb-1 font-semibold'>{monthyear}</p>
              <Calendar className='shadow-xl border-gray-300 text-xs w-full rounded-md p-3'
                    onChange={setValue}
                    locale='eng'
                    onViewChange={({view}) => view === 'month'}
                    minDate={new Date()}
                    maxDate={new Date("01/01/2024")}
                    value={value}
                    showNavigation={false}
                    tileClassName={({ date }) =>
                      date.toDateString() === new Date().toDateString()
                        ? 'rounded-full p-1 !bg-blue-500 text-white hover:!bg-blue-450 cursor-pointer'
                        : '!bg-white'
                    }
                    tileDisabled={() => true}
                  />
                <Table className='mt-3'>
                    <Table.Body>
                        {status === 'loading'  ?
                            <div className='mt-3 w-full h-full'>
                                <Spinner size="sm"/>
                                </div> : 
                        selectedDayAppointments.length > 0 ?
                            selectedDayAppointments.map((n) => (
                                !n.finished &&
                                <Table.Row key={n._id} onClick={() => handleNavigate(n._id)} className='flex cursor-pointer rounded-sm hover:!bg-gray-100 transition-colors duration-300 !p-0 justify-center border-b border-gray-300'>
                                <Table.Cell className='p-2'>
                                    <CustomImg 
                                        url={variant === 1 ? n?.doctor_id.user_id.photo : n.patient_id.user_id.photo} 
                                        className='!w-[120px] rounded-full' />
                                </Table.Cell>
                                <Table.Cell className='w-full'>
                                    <div className='text-xs flex flex-col'>
                                        {
                                            variant === 1 ?
                                                <span className='text-black font-semibold text-xs mb-1'>Dr. {n?.doctor_id.first_name + " " + n?.doctor_id.last_name}</span>
                                            :
                                            <span className='text-black font-semibold text-xs mb-1'>{n?.patient_id.first_name + " " + n?.patient_id.last_name}</span> 
                                        }
                                        <span className='text-gray-600 text-[10px]'>{formatStartEnd(n.appointment_date)}</span>
                                    </div>
                                </Table.Cell>
                                <Table.Cell className='w-1/6'>
                                    {isCurrentAppointment(n.appointment_date) ? (
                                    <div className='w-4 h-4 bg-green-300 rounded-full'></div>
                                    ) :
                                    variant === 1 ?
                                        <>
                                            { new Date() > new Date(n.appointment_date) ? (
                                                <div className='w-4 h-4 bg-red-500 rounded-full'></div>
                                            ) :
                                            new Date() < new Date(n.appointment_date) && (
                                            <div className='w-4 h-4 bg-yellow-300 rounded-full'></div>
                                            ) }
                                        </>
                                    : 
                                    !n.finished && <button className="h-[30px] w-[30px]" onClick={cancelAppointmentNow}>
                                    <HiXCircle className="text-red-600 hover:!text-red-700 !h-[30px] !w-[30px]" />
                                </button>}
                                </Table.Cell>
                                </Table.Row> )) : 
                                <Table.Row>
                                <Table.Cell className='text-center py-3 text-gray-500'>
                                You haven't have any appointments today!
                                </Table.Cell>
                            </Table.Row> 
                            }
                </Table.Body>
            </Table>
            </div>
          </Card>
  )
}

export default AppointmentReviewCalendar
