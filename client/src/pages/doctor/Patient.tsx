import { Spinner, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { patient_id } from '../../features/appointment/appointmentSlice'
import { formatDate, formatStartEnd, getPatientFinishedAppointments } from '../../service/appointmentSideFunctions'
import { Medicine } from '../../features/medicine/medicineSlice'
import Footer from '../../components/Footer'
import CustomImg from '../../components/CustomImg'
import moment from 'moment'
import PatientModal from './appointment/PatientModal'
import ErrorMessage from '../../components/ErrorMessage'
import Pagination from '../../components/Pagination'
import { useSelector } from 'react-redux'
import { authUser } from '../../features/auth/authSlice'


export type finishedAppointments = {
    _id: string,
    diagnose: string,
    therapy: Medicine[],
    other_medicine: string,
    description: string,
    reason: string,
    appointment_date: Date
}

type appointments = {
    patient_id: patient_id,
    currentPage: number, 
    numOfPages: number
    data: finishedAppointments[] | null
}

export type modalDataType = {
    patient_id: patient_id,
    _id: string,
    diagnose: string,
    therapy: Medicine[],
    other_medicine: string,
    description: string,
    reason: string,
    appointment_date: Date
}

function useQuery() {
    return new URLSearchParams(useLocation().search)
  }

const Patient:React.FC = () => {

    const navigate = useNavigate()
    const query = useQuery()
    const page = query.get('page') || 1
    const {accessUser} = useSelector(authUser)
    const [loading, setLoading] = useState<boolean>(false)
    const [appLoading, setAppLoading] = useState<boolean>(false)
    const [appointments, setAppointments] = useState<appointments | undefined>()
    const [message, setMessage] = useState<string>("")
    const [show, setShow] = useState<boolean>(false)
    const [modalData, setModalData] = useState<modalDataType>()
    const {id} = useParams()
    const route = localStorage.getItem("route")

    useEffect(() => {
        const fetchData = async () => {
            if (id && accessUser) {
              try {
                setLoading(true);
                const response = await getPatientFinishedAppointments(accessUser.token, id, 1)
                setAppointments(response)
              } catch (err: any) {
                setMessage(err.response?.data || 'An error occurred');
              } finally {
                setLoading(false);
              }
            }
          };

        fetchData()
    }, [id, accessUser])

    const showModal = (appointment: finishedAppointments) =>{
        if(appointments){
            setModalData({
                patient_id: appointments?.patient_id,
                _id: appointment._id,
                diagnose: appointment.diagnose,
                therapy: appointment.therapy,
                other_medicine: appointment.other_medicine,
                description: appointment.description,
                reason: appointment.reason,
                appointment_date: appointment.appointment_date
            })
        }
        setShow(true)
    }

    const handleNavigatePage = async (newPage: number) => {
        if(id && accessUser) {
            try {
                setAppLoading(true);
                const response = await getPatientFinishedAppointments(accessUser.token, id, newPage);
                setAppointments((prev) =>{
                    if (prev) {
                        return {
                          ...prev,
                          data: response.data,
                          currentPage: response.currentPage,
                          numOfPages: response.numOfPages,
                        }
                    }else {
                        return prev;
                    }
                })
                navigate(`/my-patients/${id}?page=${newPage}`);
            } catch (err: any) {
              setMessage(err.response?.data || 'An error occurred');
            } finally {
              setAppLoading(false);
            }
        }
      };

  return (
    <div className='h-[90vh] w-full mr-3'>
        {loading ? <div className='flex items-center h-full justify-center'>
            <Spinner size="lg" />
            </div> :
        appointments ? (
            <div className='flex justify-between h-full divide-x'>
                <div className='h-full flex-grow flex flex-col justify-between'>
                    <div className='w-full px-14'>
                        <div className='flex items-center justify-center w-full'>
                            <CustomImg url={appointments.patient_id.user_id.photo} className='w-[160px] mx-auto' />
                            <div className='mx-auto'>
                                <p className='text-xl font-semibold'>
                                    {appointments.patient_id.first_name + " " + appointments.patient_id.last_name}
                                </p>
                                <p className='flex justify-end text-sm'>
                                    {moment().diff(moment(appointments.patient_id.date_of_birth), 'years')} years old
                                </p>
                            </div>
                        </div>
                        <div className='flex flex-col h-full justify-center gap-4 flex-grow'>
                            <p>Details</p>
                            <hr/>
                            <p className="flex text-sm text-gray-500 justify-between">
                                <span>Date of birth :</span>
                                <span className="ml-auto text-black">{appointments?.patient_id.date_of_birth.toString()}</span>
                            </p>
                            <p className="flex text-sm text-gray-500 justify-between">
                                <span>Address :</span>
                                <span className="ml-auto text-black">{appointments?.patient_id.address}</span>
                            </p>
                            <p className="flex text-sm text-gray-500 justify-between">
                                <span>Blood type :</span>
                                <span className="ml-auto text-black">{appointments?.patient_id.blood_type}</span>
                            </p>
                            {appointments?.patient_id.height && <p className="flex text-sm text-gray-500 justify-between">
                                <span>Height (m) :</span>
                                <span className="ml-auto text-black">{appointments?.patient_id.height}</span>
                            </p>}
                            {appointments?.patient_id.weight && <p className="flex text-sm text-gray-500 justify-between">
                                <span>Weight (kg) :</span>
                                <span className="ml-auto text-black">{appointments?.patient_id.weight}</span>
                            </p>}
                            <p className="flex text-sm text-gray-500 justify-between">
                                <span>Gender :</span>
                                <span className="ml-auto text-black">{appointments?.patient_id.gender}</span>
                            </p>
                        </div>
                    </div>
                    <div className='mr-3'>
                        <Footer route={route as string} variant={2}/>
                    </div>
                </div>
                <div className='h-full flex justify-between flex-col px-6 pt-2 w-5/12'>
                    {Number(page) > appointments.numOfPages ? <div className='h-full flex justify-center items-center'> <ErrorMessage text={"There are no appointments for this patient."} size='sm' /> </div> : 
                        appLoading ? <div className='h-full flex justify-center items-center'> <Spinner size='md' /> </div> :
                    <>
                        <p className='text-lg text-center font-semibold text-gray-900'>Appointments</p>
                        {appointments.data && appointments.data.length > 0 ?
                        <Table>
                            <Table.Body className='divide-y'>
                                <Table.Row className='text-gray-900'>
                                    <Table.Cell>
                                    </Table.Cell>
                                        <Table.Cell>
                                            Date
                                        </Table.Cell>
                                        <Table.Cell>
                                            Time
                                        </Table.Cell>
                                </Table.Row>
                                {appointments.data.map((n, index) => (
                                    <Table.Row key={n._id} className='mt-12 hover:!bg-blue-100 cursor-pointer' onClick={() => showModal(n)} >
                                        <Table.Cell>
                                            {index + 1}.
                                        </Table.Cell>
                                        <Table.Cell>
                                            {formatDate(n.appointment_date)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {formatStartEnd(n.appointment_date)}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table> : 
                        <div className='h-full justify-center flex items-center'>
                            <p className='text-sm text-gray-400 text-center'> There are no previous finished appointments for this patient.</p>
                        </div>
                        }
                        </>}
                        
                        {appointments.data && <div className='w-full mt-auto'>
                            <Pagination page={Number(page)} totalPages={appointments.numOfPages} handleNavigate={handleNavigatePage}  />
                        </div>}
                </div>
                {appointments && <PatientModal more={show} variant={2} setMore={setShow} latestAppState={modalData} loading={loading} />}
            </div>
        ): 
        <div className='flex justify-center items-center h-full'>
            <ErrorMessage text={message} size='md' />
        </div>
        }
    </div>
  )
}

export default Patient