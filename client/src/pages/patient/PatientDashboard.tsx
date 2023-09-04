import {Card, Spinner, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { Value } from './appointment/MakeAppointment'
import { formatDate, formatStartEnd, getLatestFinished, isCurrentAppointment } from '../../service/appointmentSideFunctions'
import { useSelector } from 'react-redux'
import { appointment, doctor_id, getAppointmentsForADay, patient_id } from '../../features/appointment/appointmentSlice'
import { useAppDispatch } from '../../app/hooks'
import CustomImg from '../../components/CustomImg'
import { useNavigate } from 'react-router-dom'
import { authUser, firstTime } from '../../features/auth/authSlice'
import moment from 'moment'
import AppointmentsChart from './AppointmentsChart'

type appointment = {
  _id: string,
  appointment_date: Date,
  doctor_id: doctor_id
}

type latestFinishedType = {
  appointment: appointment,
  patient: patient_id
}

const PatientDashboard: React.FC = () => {

  const navigate = useNavigate();
  const [value, setValue] = useState<Value>(new Date())
  const [latestFinished, setLatestFinished] = useState<latestFinishedType>()
  const [loading, setLoading] = useState<boolean>(false)
  const {accessUser} = useSelector(authUser)
  const monthyear = value?.toLocaleString('en-US', {month: 'long', year: 'numeric'})
  
  const {selectedDayAppointments, status} = useSelector(appointment)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(!accessUser?.data.first){
      dispatch(firstTime())
    }
    if(value){
      dispatch(getAppointmentsForADay(value as Date))
    }
  }, [dispatch, value, accessUser])

  useEffect(() =>{
    const fetchData = async () => {
        try {
          setLoading(true);
          if(accessUser){
            const response = await getLatestFinished(accessUser.token);
            setLatestFinished(response)
          }
        } catch (err: any) {
          console.log(err)
        } finally {
          setLoading(false);
        }
    };
  
    fetchData();
  }, [accessUser])

  const handleNavigate = (id: string) => {
    navigate(`/my-appointments/${id}`)
  }

  const handleNavigateApp = () => {
    if(latestFinished){
      navigate(`/my-appointments/${latestFinished.appointment._id}`)
    }
  }

  return (
    <>
    {loading || status === 'loading' ?
      <div className='h-full w-full flex justify-center items-center'>
        <Spinner size="xl" />
      </div> :
    <div className='flex duration-300 transition-all  justify-between font-Poppins h-full w-full p-6'>
        <div className='flex flex-col flex-grow w-full justify-between'>
          <div className='w-full flex flex-grow justify-between'>
              {latestFinished && <Card className='w-1/3 h-fit'>
                <p className='text-blue-700 font-semibold'>Patient</p>
                <h1 className='text-md font-bold text-center'>{latestFinished?.patient.first_name + ' ' + latestFinished?.patient.last_name}</h1>
                  <p className='text-gray-500'>Details</p>
                  <hr/>
                  <p className="flex text-xs text-gray-500 justify-between">
                    <span>Age :</span>
                    <span className="ml-auto text-black">{moment().diff(new Date(latestFinished?.patient.date_of_birth), 'years')}</span>
                  </p>
                  <p className="flex text-xs text-gray-500 justify-between">
                    <span>Blood type :</span>
                    <span className="ml-auto text-black">{latestFinished.patient.blood_type}</span>
                  </p>
                  {latestFinished.patient.height && <p className="flex text-xs text-gray-500 justify-between">
                    <span>Height (m) :</span>
                    <span className="ml-auto text-black">{latestFinished.patient.height} </span>
                  </p>}
                  {latestFinished.patient.weight && <p className="flex text-xs text-gray-500 justify-between">
                    <span>Weight (kg) :</span>
                    <span className="ml-auto text-black">{latestFinished.patient.weight}</span>
                  </p>}
              </Card>}
            <div className=' flex flex-col w-1/2 mx-auto my-auto justify-around h-full'>
              <Card className='bg-gradient-to-r from-blue-500 to-blue-400'>
                <div>
                  {accessUser?.data.first ? 
                    <div>
                      <h1 className='text-xl font-bold'>Welcome back, {accessUser?.info.first_name}!</h1>
                      <p className='text-xs mt-3'>Explore your health insights with the PHM System. Let's make every day a healthier one.</p>
                    </div> : 
                    <div>
                      <h1 className='text-xl font-bold'>Welcome to the PHM System!</h1>
                      <p className='text-xs mt-3'>Discover a world of personalized health monitoring. Take control of your health journey today</p>
                    </div>
                  }
                </div>
              </Card>
              {latestFinished?.appointment !== undefined && <Card onClick={handleNavigateApp} className='cursor-pointer'>
                  <div className='flex items-center'>
                    <CustomImg url={latestFinished?.appointment?.doctor_id.user_id.photo} className='w-[75px]' />
                    <div className='mx-auto'>
                      <h1 className='text-xl font-semibold'>{latestFinished?.appointment?.doctor_id.first_name + ' ' + latestFinished?.appointment?.doctor_id.last_name}</h1>
                      <p className='text-sm'>{latestFinished?.appointment?.doctor_id.speciality}</p>
                      <p className='text-xs text-gray-400'>{formatDate(latestFinished?.appointment?.appointment_date)} ({formatStartEnd(latestFinished?.appointment?.appointment_date)})</p>
                    </div>
                  </div>
              </Card>}
            </div>
          </div>
            <AppointmentsChart />
        </div>
        <div className=' h-full w-2/5 flex justify-end'>
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
        {selectedDayAppointments.length > 0 ? (
          selectedDayAppointments.map((n) => (
            !n.finished &&
            <Table.Row key={n._id} onClick={() => handleNavigate(n._id)} className='flex cursor-pointer rounded-sm hover:!bg-gray-100 transition-colors duration-300 !p-0 justify-center border-b border-gray-300'>
              <Table.Cell className='p-2'>
                <CustomImg url={n?.doctor_id.user_id.photo} className='!w-[120px]' />
              </Table.Cell>
              <Table.Cell className='w-full'>
                <div className='text-xs flex flex-col'>
                  <span className='text-black font-semibold text-xs mb-1'>Dr. {n?.doctor_id.first_name + " " + n?.doctor_id.last_name}</span>
                  <span className='text-gray-600 text-[10px]'>{formatStartEnd(n.appointment_date)}</span>
                </div>
              </Table.Cell>
              <Table.Cell className='w-1/6'>
                {isCurrentAppointment(n.appointment_date) ? (
                  <div className='w-4 h-4 bg-green-300 rounded-full'></div>
                ) :
                new Date() > new Date(n.appointment_date) ? (
                  <div className='w-4 h-4 bg-red-500 rounded-full'></div>
                ):
                new Date() < new Date(n.appointment_date) && (
                  <div className='w-4 h-4 bg-yellow-300 rounded-full'></div>
                )}
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell className='text-center py-3 text-gray-500'>
              You don't have any appointments today!
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
            </Table>
            </div>
          </Card>
        </div>

      </div>}
    </>
  )
}

export default PatientDashboard