import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { Appointment, appointment, cancelAppointment, getSelectedAppointment, makeAppointmentFinished, resetSelectedAppointment } from '../../../features/appointment/appointmentSlice';
import { Label, Spinner, Textarea } from 'flowbite-react';
import { getMedicine, medicine } from '../../../features/medicine/medicineSlice';
import { useForm } from 'react-hook-form';
import Select from 'react-select'
import Footer from '../../../components/Footer';
import {HiXCircle} from "react-icons/hi2"
import { toast } from 'react-hot-toast';
import CustomButton from '../../../components/CustomButton';
import { formatDate, formatStartEnd, getLatestAppointment } from '../../../service/appointmentSideFunctions';
import PatientEditCard from './PatientEditCard';
import PatientModal from './PatientModal';
import ErrorMessage from '../../../components/ErrorMessage';
import { authUser } from '../../../features/auth/authSlice';
import socket from '../../../socket';

type AppointmentFinished = {
    diagnose: string,
    other_medicine: string,
    description: string
}

const DocAppointment: React.FC = () => {

    const {accessUser} = useSelector(authUser)
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [latestAppState, setLatestAppState] = useState<Appointment>()
    const [loading, setLoading] = useState<boolean>(false)
    const [more, setMore] = useState<boolean>(false)
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

    useEffect(() =>{
        if(!selected?.finished){
            dispatch(getMedicine())
        }
    }, [dispatch, selected])

    const {medicine : m} = useSelector(medicine)
    const {register, getValues, setValue} = useForm<AppointmentFinished>()

    const options = m.map((n) => ({
            value: n._id,
            label: `${n.name + "(" + n.strength + ")"}`
        }
    ))

    useEffect(() =>{
        if(selected?.finished){
            setValue("description", selected.description)
            setValue("other_medicine", selected.other_medicine)
            setValue("diagnose", selected.diagnose)
        }
    }, [selected, setValue])

    const appDate = selected?.appointment_date.toString().slice(0, 10)

    let laterAppointment;
    if(selected) laterAppointment = new Date(selected?.appointment_date) > new Date()
    
    const handleChange = (value: readonly { value: string; label: string; }[]) =>{
        const newOnes = value.map((n) => n.value)
        setSelectedValues(newOnes)
    }

    useEffect(() =>{
        const postData = async () =>{
            if(selected){
                try {
                    setLoading(true)
                    const latestApp = {
                        appointment_id: selected._id,
                        patient_id: selected?.patient_id._id
                    }
                    const response = await getLatestAppointment(accessUser.token, accessUser.data._id, latestApp)
                    setLatestAppState(response)
                } catch (error: unknown) {
                    setLoading(false)
                }finally{
                    setLoading(false)
                }
            }
        }
        postData()
    }, [selected, accessUser])

    const cancelAppointmentNow = () => {
        if(selected){
            dispatch(cancelAppointment(selected._id)).then((action) => {
                if(typeof action.payload === 'object'){
                    const selectedInfo = {
                        app_date: `${formatDate(selected.appointment_date)}, ${formatStartEnd(selected.appointment_date)}`,
                        doctor_name: `${selected.doctor_id.first_name + ' ' + selected.doctor_id.last_name}`,
                        doctor_spec: selected.doctor_id.speciality
                    }
                    socket.emit('appointment_cancel', selectedInfo, selected.patient_id.user_id._id, accessUser.data.role)
                    navigate("../", {replace: true})
                    toast.error("Appointment cancelled")
                }
            })
        }
    }

    let ifIsFinished;

    if(selected?.finished && selected.therapy){
        ifIsFinished = selected.therapy.map((t) => ({
            value: t._id,
            label: `${t.name + "(" + t.strength + ")"}`
        }))
    }

    const makeFinished = () =>{
        const finishAppointment = {
            description: getValues().description,
            other_medicine: getValues().other_medicine,
            diagnose: getValues().diagnose,
            therapy: selectedValues,
            finished: true
        }

        if(selected){
            const id: string = selected._id
            dispatch(makeAppointmentFinished({id, finishAppointment})).then((action) => {
                if(typeof action.payload === 'object'){
                    navigate("../", {replace:true})
                    toast.success("Successfully edited appointment.")
                }
            })
        }
        
    }

    return (
        <>
        {status === 'loading' ? 
            <div className=' flex justify-center h-full items-center'>
                <Spinner size="xl" />
            </div> : selected ? 
                <div className='px-6 pt-6 pb-2 flex w-full h-full font-Poppins'>
                    <div className='w-full h-full flex flex-col justify-between'>
                        <div className='h-1/4 text-sm w-full'>
                            <p><span className='font-semibold'>Date&Time:</span> {appDate} ({formatStartEnd(selected?.appointment_date)}) </p>
                            {selected?.reason &&
                            <div className='h-[200px] text-sm flex flex-wrap text-md w-1/2 text-justify whitespace-normal'>
                                <p><span className='font-semibold'>Reason:</span> {selected?.reason}</p>
                                </div>
                            }
                        </div>
                        <div className='my-auto h-full pr-6 w-full justify-center flex flex-col'>
                            <div className='flex justify-between'>
                                <p className='text-xl font-semibold'>Appointment result</p>
                                {!selected?.finished && <button className="h-[60px] w-[60px]" onClick={cancelAppointmentNow}>
                                    <HiXCircle className="text-red-600 hover:!text-red-700 !h-[40px] !w-[40px]" />
                                </button>}
                            </div>
                            <div className='flex w-full flex-col h-3/4 justify-evenly items-center'>
                                <div className='flex w-full justify-between'>
                                    <div className='w-2/4 pr-4'>
                                        <Label htmlFor="diagnose" className='mb-1 block' value="Diagnose" />
                                        <Textarea {...register("diagnose")} disabled={selected?.finished || laterAppointment} rows={4} className='text-sm' />
                                    </div>
                                    <div className='w-2/4 pl-3'>
                                        <Label htmlFor="therapy" className="mb-1 block" value="Therapy" />
                                        <Select options={options} id='therapy' defaultValue={ifIsFinished} isDisabled={selected?.finished || laterAppointment} className='mt-1 text-xs' isMulti closeMenuOnSelect={false} onChange={(value) => handleChange(value)} />
                                    </div>
                                </div>
                                <div className='flex w-full justify-between'>
                                    <div className='flex-grow pr-6'>
                                        <Label htmlFor="other_medicine" className="mb-1 block" value="Other medicine" />
                                        <Textarea {...register("other_medicine")}  disabled={selected?.finished || laterAppointment} rows={4} className='text-sm' />
                                    </div>
                                    <div className='flex-grow'>
                                        <Label htmlFor="description" className="mb-1 block" value="Description" />
                                        <Textarea {...register("description")} disabled={selected?.finished || laterAppointment}  rows={4} className='text-sm' />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-full pr-6'>
                            <Footer variant={2}>
                            {selected?.finished || !laterAppointment && <CustomButton onClick={makeFinished}>Save changes</CustomButton>}    
                            </Footer>
                        </div>
                    </div>
                    <div className='ml-auto w-2/6'>
                        <PatientEditCard setShowMore={setMore}  />
                    </div>
                    <PatientModal variant={1} loading={loading} latestAppState={latestAppState} setMore={setMore} more={more} />
                </div> : 
                <div>
                    <ErrorMessage text={message} size='md' />
                </div>
            }
        </>
    )
}

export default DocAppointment