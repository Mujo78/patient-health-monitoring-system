import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks';
import { useSelector } from 'react-redux';
import { appointment, cancelAppointment, getSelectedAppointment, resetSelectedAppointment } from '../../../features/appointment/appointmentSlice';
import { Button, Card, Spinner } from 'flowbite-react';
import ErrorMessage from '../../../components/ErrorMessage';
import CustomImg from '../../../components/CustomImg';
import Footer from '../../../components/Footer';
import AppointmentOverviewEdit from './AppointmentOverviewEdit';
import moment from 'moment-timezone';

const Appointment: React.FC = () => {
    const {id} = useParams();
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const {selectedAppointment : selected, status, message} = useSelector(appointment)
    useEffect(() =>{
        if(id) {
            dispatch(getSelectedAppointment(id))
        }

        return () =>{
            dispatch(resetSelectedAppointment())
        }
    }, [id, dispatch])

    const mailtoLink = `mailto:${selected?.doctor_id.user_id.email}`
    const appDate = selected?.appointment_date.toString().slice(0, 10)
    const appDateTime = moment.utc(selected?.appointment_date).add(2, "hours");
    const startTime = moment.utc(appDateTime).format('hh:mm A');
    const endTime = moment.utc(appDateTime).add(20, 'minutes').format('hh:mm A');
    const appointmentTime = `${startTime} - ${endTime}`;

    const date = new Date(selected?.appointment_date as Date).getTime()
    const diff = date - new Date().getTime()
    const canCancel = (diff / (1000 * 60)).toFixed(0)

    const cancelAppointmentNow = () => {
        if(selected) {
          dispatch(cancelAppointment(selected._id)).then((action) => {
            if(typeof action.payload === 'object'){
              navigate("../", {replace: true})
            }
          })
        }
      }

  return (
    <>
        {status === 'loading' ? 
        <div className='flex justify-center items-center h-full'>
            <Spinner size="xl" />
        </div>
      : 
      <>
        {selected !== null ?
            <div className='h-full flex flex-col mr-3'>
                <div className='flex justify-between mt-4'>
                    <Card horizontal className='flex w-2/5 font-Poppins'>
                        <div className='flex items-center p-0'>
                            <CustomImg url={selected.doctor_id.user_id.photo} className='mr-3 w-[130px] h-[130px]'/>
                            <div className=''>
                                <h1 className='font-bold text-xl text-blue-700'>
                                    {"Dr. " +  selected.doctor_id.first_name + " " + selected.doctor_id.last_name}
                                </h1>
                                <div className='text-xs text-gray-600'>
                                    <p> Age: {selected.doctor_id.age} | {selected.doctor_id.speciality} </p>
                                    <p className='mt-2 mb'><span className='text-gray-600'> Qualification:</span> {selected.doctor_id.qualification}</p>
                                    <p>
                                    <span className='text-gray-600'> Email: {" "}</span>
                                    <a href={mailtoLink} className='text-blue-500 underline hover:text-blue-700 cursor-pointer'>
                                        {selected.doctor_id.user_id.email}
                                    </a>
                                    </p>
                                </div>
                                <p className='text-xs text-gray-500 mt-2 text-justify'> {selected.doctor_id.bio}</p>
                            </div>
                        </div>
                    </Card>
                    <div className='flex flex-col divide-y h-full'>
                        <p><span className='text-md font-semibold'>Date&Time:</span> {appDate} ({appointmentTime})</p>
                        {selected.reason.length > 0 && <p><span className='text-md font-semibold'>Reason:</span> {selected.reason}</p> }   
                    </div>
                    <div className='mt-auto'>
                        {(Number(canCancel) > 60) && <Button onClick={cancelAppointmentNow} color="failure">Cancel Appointment</Button>}
                    </div>
                </div>
                <div className='flex justify-between flex-col h-full mt-6'>
                    <AppointmentOverviewEdit />
                    <Footer variant={2} />
                </div>
                <div>
                </div>
            </div>        
        :
            <div className='flex h-full justify-center items-center'>
                <ErrorMessage size='md' text={message} />
            </div>
             }
      </>    
    }
        
    </>
  )
}

export default Appointment