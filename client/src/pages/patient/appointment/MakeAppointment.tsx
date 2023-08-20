import React, { useEffect, useState } from 'react'
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import CustomButton from '../../../components/CustomButton';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Spinner, Textarea } from 'flowbite-react';
import CustomImg from '../../../components/CustomImg';
import { Doctor } from './AppointmentDepartment';
import { getDoctor } from '../../../service/appointmentSideFunctions';
import {HiOutlineClock} from "react-icons/hi2"
import { useAppDispatch } from '../../../app/hooks';
import { useSelector } from 'react-redux';
import { appointment, bookAppointment, getAppointmentsForADay, resetAppointmentDay } from '../../../features/appointment/appointmentSlice';
import { toast } from 'react-hot-toast';
import Footer from '../../../components/Footer';
import ErrorMessage from '../../../components/ErrorMessage';

const workTime = [
    "9:00","9:20","9:40","10:00",
    "10:20","10:40","11:00","11:20",
    "11:40","12:00","1:00","1:20",
    "1:40","2:00", "2:20","2:40",
    "3:00","3:20","3:40","4:00"
]

const isSunday = (date: Date) => {
  return date.getDay() === 0;
};

function convert12HourTo24Hour(time12Hour: string) {
  const [hours, minutes] = time12Hour.split(":").map(Number);
  return `${hours <= 4 ? hours + 12 : hours}:${minutes}`;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const MakeAppointment: React.FC = () => {

  const dispatch = useAppDispatch()
  const {status, message, selectedDayAppointments} = useSelector(appointment)
  const {doctorId} = useParams()
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false)  
  const [value, setValue] = useState<Value>(new Date());
  const [newTime, setNewTime] = useState<string>("")
  const [reason, setReason] = useState<string>("")  
  const [doc, setDoc] = useState<Doctor | null>(null)

  const handleGetAppForADay = (value: Date) => {
    dispatch(getAppointmentsForADay(value))
    dispatch(resetAppointmentDay())
  }
  
  useEffect(() =>{
    if(value && !isSunday(value as Date)){
      dispatch(getAppointmentsForADay(value as Date))
    }
  }, [value, dispatch])

  const appTime = selectedDayAppointments.map((n) => {
    const date = new Date(n.appointment_date);
    const localTime = new Date(date.getTime() - (2 * 60 * 60 * 1000));
    const formattedTime = localTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const newTime = formattedTime.slice(0,5).trim()
    return newTime;
  });

  const availableTime = workTime.filter(m => !appTime.includes(m));

  const setTimeForDate = (time: string) => {
    setNewTime(time)
  }
  console.log(selectedDayAppointments)

  const makeNewAppointment = () => {
    const time = convert12HourTo24Hour(newTime)
    const newAppDate = value?.toLocaleString().slice(0, 9) + "," + time;

    const appointmentData = {
      doctor_id: doctorId ? doctorId : "",
      reason: reason,
      appointment_date: new Date(newAppDate)
    }
    if(doctorId && newTime && !isSunday(value as Date)){
      dispatch(bookAppointment(appointmentData)).then((action) =>{
        if(typeof action.payload === 'object'){
          toast.success('Appointment successfully created!')
          navigate("/appointment", {replace: true})
        }
      })
    }
  }

  useEffect(() => {
    const fetchData = async (id: string) => {
      try {
        setLoading(true)
        const response = await getDoctor(id)
        setDoc(response)
      } finally {
        setLoading(false)
      }
    }

    if(doctorId){
      fetchData(doctorId)
    }
  }, [doctorId])

  return (
    <div className='flex font-Poppins flex-col h-full'>
      <div className='flex w-full h-full justify-between'>
        <div className='w-1/4 my-auto h-full'>
          <div className='my-auto h-full flex flex-col justify-evenly'>
            <Card horizontal className='flex justify-center'>
              {loading ? <div className='p-6'> <Spinner size="md" /> </div> :
              <div className='flex justify-around items-center'>
                <CustomImg url={doc?.user_id.photo} className='w-[60px] h-[60px]' />
                <div className='w-1/2'>
                    <h1 className='font-bold text-md mb-1 text-blue-700'>{"Dr. " + doc?.first_name + " " + doc?.last_name}</h1>
                    <p className='text-xs'>{doc?.bio.split(".")[0]}</p>
                </div>
              </div>}
            </Card>
            <div className='flex flex-col justify-around'>
              <div className='mb-3'>
                <h1 className='text-xl font-semibold'>{doc?.speciality}</h1>
                <div className='flex items-center mt-1 text-gray-600'>
                    <HiOutlineClock/>
                    <p className='ml-1 text-xs'>20min</p>
                </div>
              </div>
              <div className='divide-y text-gray-500 text-xs'>
                <p>
                  With years of expertise and advanced training, our doctors are equipped to address a wide spectrum of health concerns. From routine check-ups to intricate medical cases, our team is dedicated to delivering precise diagnoses and effective treatment plans. Schedule an appointment now.
                </p>
                <div className='mt-3'>
                <p className='mt-3 font-semibold'>Before scheduling an appointment, please be aware of the following:</p>
                <ul className="list-disc p-2">
                    <li>- Your appointment is a one-to-one meeting with the doctor you have selected.</li>
                    <li>- Ensure that you have all required documentation ready to participate in the appointment.</li>
                    <li>- Prior to your appointment, you will receive an email notification.</li>
                </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col my-auto w-1/3'>
          <h1 className='text-xl font-semibold'>Set Date</h1>
          <div className='text-sm flex justify-between'>
            <p> <span className='text-yellow-300 text-xl'>•</span> today </p>
            <p> <span className='text-gray-400 text-xl'>•</span> out of bounds </p>
            <p> <span className='text-blue-500 text-xl'>•</span> choosen </p>
          </div>
        <Calendar className="font-Poppins mt-3 shadow-xl border-gray-300 text-xl w-full rounded-xl p-4" 
            onChange={setValue}
            onClickDay={handleGetAppForADay}
            locale='eng'
            minDate={new Date()}
            maxDate={new Date("01/01/2024")}
            value={value}
            prev2Label={<span className="text-gray-500">&lt;&lt;</span>}
            next2Label={<span className="text-gray-500">&gt;&gt;</span>}
            prevLabel={<span className="text-gray-800">&lt;</span>}
            nextLabel={<span className="text-gray-800">&gt;</span>}
            tileClassName={({ date, view }) =>
              view === 'month' ? 
                ` rounded-full p-3 hover:bg-blue-100 cursor-pointer${value &&
                    value.toString() === date.toDateString() ? 'bg-blue-500 text-white' : ''
                  } ` : ''
            }
            tileDisabled={({ date }) => isSunday(date)}
          />
          <Textarea placeholder='Note for the doctor' title='Note' rows={4} className='mt-6 text-sm' value={reason} name='reason' onChange={(e) => setReason(e.target.value)} />
          <div className='h-3 mt-2'>  {status === 'failed' && <p className='text-xs text-red-600 font-bold'>{message}</p>} </div>
        </div>
        <div className='w-1/4 flex flex-col my-auto mr-4 justify-evenly h-full'>
            <h1 className='font-semibold text-xl'>Date: {value?.toLocaleString().slice(0, 10)} ({isSunday(value as Date) ? 0 : availableTime.length})</h1>
            <div className='flex flex-wrap h-3/4 w-full p-1.5 border-gray-300 border rounded-lg'>
              {isSunday(value as Date) ?
                <div className='my-auto mx-auto'>
                 <ErrorMessage text='You can not make appointment today' size='sm' /> 
                </div> 
                : status === 'loading' ? <div className='mx-auto my-auto'> <Spinner /> </div>: availableTime.length > 0 ? availableTime.map((n) => 
                <Button size="sm" key={n} onClick={() => setTimeForDate(n)} color="light" className={`m-1.5 ${newTime === n && 'bg-blue-500 text-white hover:text-black'}  focus:!ring-blue-600`}>{
                  parseInt(n.split(":")[0]) < 9 ? `${n} PM` : `${n} AM`
                }</Button>
                ) : <p className='text-sm mx-auto my-auto'>There are no more available appointments for this day</p>}
            </div>
        </div>
      </div>
      <Footer variant={2}>
            <CustomButton disabled={!value || !newTime || isSunday(value as Date)} size='md' className='mr-3 w-1/12' onClick={makeNewAppointment}>
              Finish
            </CustomButton>
      </Footer>
       
      
    </div>
  )
}

export default MakeAppointment