import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { appointment, cancelAppointment, getSelectedAppointment, makeAppointmentFinished, resetSelectedAppointment } from '../../features/appointment/appointmentSlice';
import { Button, Card, Label, Spinner, Textarea, Modal } from 'flowbite-react';
import CustomImg from '../../components/CustomImg';
import moment from 'moment';
import { getMedicine, medicine } from '../../features/medicine/medicineSlice';
import { useForm } from 'react-hook-form';
import Select from 'react-select'
import Footer from '../../components/Footer';
import {HiXCircle} from "react-icons/hi2"
import { toast } from 'react-hot-toast';
import CustomButton from '../../components/CustomButton';

type AppointmentFinished = {
    diagnose: string,
    other_medicine: string,
    description: string
}

const DocAppointment: React.FC = () => {

    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [more, setMore] = useState<boolean>(false)
    const {id} = useParams();
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {selectedAppointment : selected, status} = useSelector(appointment)
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
    const appDateTime = moment.utc(selected?.appointment_date).add(2, "hours");
    const startTime = moment.utc(appDateTime).format('hh:mm A');
    const endTime = moment.utc(appDateTime).add(20, 'minutes').format('hh:mm A');
    const appointmentTime = `${startTime} - ${endTime}`;


    const handleChange = (value: readonly { value: string; label: string; }[]) =>{
        const newOnes = value.map((n) => n.value)
        setSelectedValues(newOnes)
    }

    const showMore = () => {
        setMore(true)
    }

    const cancelAppointmentNow = () => {
        if(selected){
            dispatch(cancelAppointment(selected._id)).then((action) => {
                if(typeof action.payload === 'object'){
                    navigate("../", {replace: true})
                    toast.error("Appointment cancelled")
                }
            })
        }
    }

    let ifIsFinished;

    if(selected?.finished){
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
        {status === 'loading' ? <div className=' flex justify-center h-full items-center'>
            <Spinner size="xl" />
        </div> : <div className='px-6 pt-6 pb-2 flex w-full h-full font-Poppins'>
            <div className='w-full h-full flex flex-col justify-between'>
                <div className='h-1/4 text-sm w-full'>
                    <p><span className='font-semibold'>Date&Time:</span> {appDate} ({appointmentTime}) </p>
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
                                <Textarea {...register("diagnose")} disabled={selected?.finished} rows={4} className='text-sm' />
                            </div>
                            <div className='w-2/4 pl-3'>
                                <Label htmlFor="therapy" className="mb-1 block" value="Therapy" />
                                <Select options={options} id='therapy' defaultValue={ifIsFinished} isDisabled={selected?.finished} className='mt-1 text-xs' isMulti closeMenuOnSelect={false} onChange={(value) => handleChange(value)} />
                            </div>
                        </div>
                        <div className='flex w-full justify-between'>
                            <div className='flex-grow pr-6'>
                                <Label htmlFor="other_medicine" className="mb-1 block" value="Other medicine" />
                                <Textarea {...register("other_medicine")}  disabled={selected?.finished} rows={4} className='text-sm' />
                            </div>
                            <div className='flex-grow'>
                                <Label htmlFor="description" className="mb-1 block" value="Description" />
                                <Textarea {...register("description")} disabled={selected?.finished}  rows={4} className='text-sm' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full pr-6'>
                    <Footer variant={2}>
                       {!selected?.finished && <CustomButton onClick={makeFinished}>Save changes</CustomButton>}    
                    </Footer>
                </div>
            </div>
            <div className='ml-auto w-2/6'>
                <Card className='max-w-xs font-Poppins h-fit ml-auto'>
                <p className='text-blue-700 font-semibold'>Patient</p>
                <CustomImg url={selected?.patient_id.user_id.photo} className='w-[150px] mx-auto rounded-xl' />
                <h1 className='text-xl font-bold text-center'>{selected?.patient_id.first_name + " " + selected?.patient_id.last_name}</h1>
                    <p className='text-gray-500'>Details</p>
                    <hr/>
                    <p className="flex text-sm text-gray-500 justify-between">
                        <span>Age :</span>
                        <span className="ml-auto text-black">{moment().diff(moment(selected?.patient_id.date_of_birth), 'years')}</span>
                    </p>
                    <p className="flex text-sm text-gray-500 justify-between">
                        <span>Address :</span>
                        <span className="ml-auto text-black">{selected?.patient_id.address}</span>
                    </p>
                    <p className="flex text-sm text-gray-500 justify-between">
                        <span>Blood type :</span>
                        <span className="ml-auto text-black">{selected?.patient_id.blood_type}</span>
                    </p>
                    {selected?.patient_id.height && <p className="flex text-sm text-gray-500 justify-between">
                        <span>Height (m) :</span>
                        <span className="ml-auto text-black">{selected?.patient_id.height}</span>
                    </p>}
                    {selected?.patient_id.weight && <p className="flex text-sm text-gray-500 justify-between">
                        <span>Weight (kg) :</span>
                        <span className="ml-auto text-black">{selected?.patient_id.weight}</span>
                    </p>}
                    <p className="flex text-sm text-gray-500 justify-between">
                        <span>Gender :</span>
                        <span className="ml-auto text-black">{selected?.patient_id.gender}</span>
                    </p>
                    <hr/>
                    <Button color="light" onClick={showMore} className="focus:!ring-gray-100"> 
                        See more
                    </Button>
                </Card>
            </div>
            <Modal show={more} size="6xl" className='h-full' position="center-right" onClose={() => setMore(false)}>
                <Modal.Header>{selected?.patient_id.first_name + " " + selected?.patient_id.last_name}</Modal.Header>
                <Modal.Body>
                <div className="space-y-6 p-6">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                    companies around the world are updating their terms of service agreements to comply.
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                    </p>
                </div>
                <div className="space-y-6 p-6">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                    companies around the world are updating their terms of service agreements to comply.
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                    </p>
                </div>
                <div className="space-y-6 p-6">
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
                    companies around the world are updating their terms of service agreements to comply.
                    </p>
                    <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to
                    ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as
                    possible of high-risk data breaches that could personally affect them.
                    </p>
                </div>
                </Modal.Body>
                <Modal.Footer>
                <Button className="ml-auto" color="gray" onClick={() => setMore(false)}>
                    Close
                </Button>
                </Modal.Footer>
      </Modal>
        </div>}
        </>
    )
}

export default DocAppointment