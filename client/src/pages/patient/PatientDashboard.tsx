import {Card, Table } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import { Value } from './appointment/MakeAppointment'
import { isSunday } from '../../service/appointmentSideFunctions'
import { useSelector } from 'react-redux'
import { appointment, getAppointmentsForADay } from '../../features/appointment/appointmentSlice'
import { useAppDispatch } from '../../app/hooks'
import CustomImg from '../../components/CustomImg'
import { useNavigate } from 'react-router-dom'

const PatientDashboard: React.FC = () => {

  const navigate = useNavigate();
  const [value, setValue] = useState<Value>(new Date())
  const monthyear = value?.toLocaleString('en-US', {month: 'long', year: 'numeric'})

  const {selectedDayAppointments} = useSelector(appointment)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if(value && !isSunday(value as Date)){
      dispatch(getAppointmentsForADay(value as Date))
      console.log("first")
    }
  }, [dispatch, value])

  const handleNavigate = (id: string) => {
    navigate(`/my-appointments/${id}`)
  }

  return (
    <div className='flex justify-between h-full w-full p-6'>
      <div className='w-full'>
        <Card className='max-w-xs font-Poppins h-fit'>
          <p className='text-blue-700 font-semibold'>Patient</p>
          <h1 className='text-xl font-bold text-center'>Ime prezime</h1>
            <p className='text-gray-500'>Details</p>
            <hr/>
            <p className="flex text-sm text-gray-500 justify-between">
              <span>Age :</span>
              <span className="ml-auto text-black">56</span>
            </p>
            <p className="flex text-sm text-gray-500 justify-between">
              <span>Blood type :</span>
              <span className="ml-auto text-black">A+</span>
            </p>
            <p className="flex text-sm text-gray-500 justify-between">
              <span>Height (m) :</span>
              <span className="ml-auto text-black">1.70</span>
            </p>
            <p className="flex text-sm text-gray-500 justify-between">
              <span>Weight (kg) :</span>
              <span className="ml-auto text-black">60</span>
            </p>
        </Card>
      </div>
      <div className='w-full h-full'>
        <Card className='max-w-xs font-Poppins flex justify-start items-start flex-col h-full'>
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
          <Table.Row key={n._id} onClick={() => handleNavigate(n._id)} className='flex cursor-pointer rounded-sm hover:!bg-gray-100 transition-colors duration-300 !p-0 justify-center border-b border-gray-300'>
            <Table.Cell className='p-2'>
              <CustomImg url={n.doctor_id.user_id.photo} className='!w-[120px]' />
            </Table.Cell>
            <Table.Cell className='w-full'>
              <div className='text-xs flex flex-col'>
                <span className='text-black font-semibold text-xs mb-1'>Dr. {n.doctor_id.first_name + " " + n.doctor_id.last_name}</span>
                <span className='text-gray-600'>{new Date(n.appointment_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
              </div>
            </Table.Cell>
            <Table.Cell className='w-1/6'>
              {new Date() === new Date(n.appointment_date) && (
                <div className='w-4 h-4 bg-green-300 rounded-full'></div>
              )}
              {new Date() > new Date(n.appointment_date) && (
                <div className='w-4 h-4 bg-red-500 rounded-full'></div>
              )}
              {new Date() < new Date(n.appointment_date) && (
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

    </div>
  )
}

export default PatientDashboard