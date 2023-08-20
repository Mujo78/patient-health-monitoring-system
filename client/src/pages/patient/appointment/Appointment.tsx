import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks';
import { useSelector } from 'react-redux';
import { appointment, getSelectedAppointment, resetSelectedAppointment } from '../../../features/appointment/appointmentSlice';
import { Button, Card, Spinner, Tabs } from 'flowbite-react';
import ErrorMessage from '../../../components/ErrorMessage';
import CustomImg from '../../../components/CustomImg';
import Footer from '../../../components/Footer';


const Appointment: React.FC = () => {
    const {id} = useParams();

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

    console.log(selected)
  return (
    <>
        {status === 'loading' ? 
        <div className='flex justify-center items-center h-full'>
            <Spinner size="xl" />
        </div>
      : 
      <>
        {selected ?
            <div className='h-full flex flex-col mr-3'>
                <div className='flex justify-between mt-4'>
                    <Card horizontal className='flex mt-4 w-2/5 font-Poppins'>
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
                    <div className='mt-auto'>
                        <Button color="failure"> Cancel Appointment</Button>
                    </div>
                </div>
                <div className='flex justify-between flex-col h-full mt-6'>
                    <Tabs.Group aria-label="Default tabs" style="default">
                        <Tabs.Item
                            active
                            title="Overview"
                        >
                           <p>Overview</p>
                        </Tabs.Item>
                        <Tabs.Item
                            active
                            title="Edit"
                        >
                           <p>Editing</p>
                        </Tabs.Item>
                    </Tabs.Group>
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