import React from 'react'
import ErrorMessage from '../../../components/ErrorMessage'
import { Button, Modal, Spinner } from 'flowbite-react'
import { formatDate, formatStartEnd } from '../../../service/appointmentSideFunctions'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { modalDataType } from '../Patient'

type Props = {
    more: boolean,
    setMore: React.Dispatch<React.SetStateAction<boolean>>,
    latestAppState: modalDataType | undefined,
    loading: boolean,
    variant: 1 | 2
}

const PatientModal: React.FC<Props> = ({more,variant, setMore, latestAppState, loading}) => {

  return (
    <Modal show={more} size="6xl" className='font-Poppins' position="center-right" onClose={() => setMore(false)}>
        <Modal.Header>Last Appointment</Modal.Header>
        <Modal.Body>
            <div className='h-full'>
                {loading ? 
                <div className='h-screen flex justify-center items-center'>
                    <div className='h-1/6'>
                        <Spinner />
                    </div>
                </div>    
                : latestAppState ?
                <div className='h-full flex justify-evenly flex-col'>
                    <div className='flex p-1 border rounded-lg my-auto divide-x justify-between'>
                        <div className='divide-y w-2/4'>
                            <p>
                                <span className='font-semibold'>Name: </span> {latestAppState.patient_id.first_name + " " + latestAppState.patient_id.last_name}
                            </p>
                            <p>
                                <span className='font-semibold'>Date of birth: </span> {latestAppState.patient_id.date_of_birth.toString()}
                            </p>
                            <p>
                                <span className='font-semibold'>Blood type: </span> {latestAppState.patient_id.blood_type}
                            </p>
                        </div>
                        <div className='w-2/4 divide-y'>
                            <p>
                                <span className='font-semibold'>Gender: </span> {latestAppState.patient_id.gender}
                            </p>
                            <p>
                                <span className='font-semibold'>Age: </span> {moment().diff(moment(latestAppState?.patient_id.date_of_birth), 'years')}
                            </p>
                            <p>
                                <span className='font-semibold'>Address: </span> {latestAppState.patient_id.address}
                            </p>
                        </div>
                    </div>
                    <div className='mt-6'>
                        <h1 className='font-bold text-md mb-1'>Medical report</h1>
                        <div className='border rounded-lg divide-y p-2'>
                        {latestAppState.reason.length !== 0 && <div>
                            <h1 className='font-semibold text-sm'>Reason</h1>
                            <div>
                                <p className='text-sm'>
                                    {latestAppState.reason}
                                </p>
                            </div>
                        </div>}
                        {latestAppState.diagnose.length !== 0 && <div className='pt-2'>
                            <h1 className='font-semibold text-sm'>Diagnose</h1>
                            <div>
                                <p className='text-sm'>
                                    {latestAppState.diagnose}
                                </p>
                            </div>
                        </div>}
                        {latestAppState.therapy.length !== 0 && <div className='pt-2'>
                            <h1 className='font-semibold text-sm'>Therapy</h1>
                            <div className='flex'>
                                {latestAppState.therapy.map((n) => (
                                    <p key={n._id} className='text-sm mr-2'>
                                        {n.name} - ({n.strength}),
                                    </p>
                                ))}
                            </div>
                        </div>}
                        {latestAppState.other_medicine.length !== 0 && <div className='pt-2'>
                            <h1 className='font-semibold text-sm'>Other medicine</h1>
                            <div>
                                <p className='text-sm'>
                                    {latestAppState.other_medicine}
                                </p>
                            </div>
                        </div>}
                        {latestAppState.description.length !== 0 && <div className='pt-2'>
                            <h1 className='font-semibold text-sm'>Description</h1>
                            <div>
                                <p className='text-sm'>
                                    {latestAppState.description}
                                </p>
                            </div>
                        </div>}
                    </div>
                    <div className='text-sm flex mt-8 justify-between items-center'>
                        <div>
                            <p>
                                <span className='font-semibold'>Date: </span> {formatDate(latestAppState.appointment_date)}
                            </p>
                            <p>
                                <span className='font-semibold'>Time: </span> {formatStartEnd(latestAppState.appointment_date)}
                            </p>
                        </div>
                       {variant === 1 && <div>
                            <Link className='text-blue-700 text-sm hover:underline ' to={`/my-patients/${latestAppState.patient_id._id}`}>
                                See patient history {"->"}
                            </Link>
                        </div>}
                    </div>
                    </div>
                </div>: <div className='flex justify-center items-center'>
                <ErrorMessage size='md' text='There are no record for this patient!' />
            </div>}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className="ml-auto" color="gray" onClick={() => setMore(false)}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default PatientModal