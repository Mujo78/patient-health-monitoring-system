import React, { useEffect, useState } from 'react'
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import CustomButton from '../../../components/CustomButton';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Spinner, Table } from 'flowbite-react';
import { TableRow } from 'flowbite-react/lib/esm/components/Table/TableRow';
import CustomImg from '../../../components/CustomImg';
import { Doctor } from './AppointmentDepartment';
import { getDoctor } from '../../../service/appointmentSideFunctions';
import {HiOutlineClock} from "react-icons/hi2"

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const MakeAppointment: React.FC = () => {

  const {doctorId} = useParams()
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<Value>(new Date());
  const [doc, setDoc] = useState<Doctor | null>(null)
  const newAppDate = value?.toLocaleString().slice(0, 9) + ", 12:25"
  console.log(newAppDate)
  console.log(doc)

  const isSunday = (date: Date) => {
    return date.getDay() === 0;
  };

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

  const goBack = () => {
    navigate("../", {replace: true})
  }
  return (
    <div className='flex font-Poppins flex-col h-full'>
      <div className='flex w-full h-full justify-between'>
        <div className='w-1/4 my-auto h-full'>
          <div className='my-auto h-full flex flex-col justify-evenly'>
            <Table>
                <Table.Body>
                  <TableRow>
                    { loading ? <Table.Cell> <Spinner size="xl" /> </Table.Cell> :
                      <>
                      <Table.Cell> <CustomImg url={doc?.user_id.photo} /> </Table.Cell>
                      <Table.Cell>
                        <div>
                          <h1 className='font-bold mb-1'>{doc?.first_name + " " + doc?.last_name}</h1>
                          <p>{doc?.bio.split(".")[0]}</p>
                        </div>
                      </Table.Cell>
                      </>
                      }
                  </TableRow>
                </Table.Body>
            </Table>
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
                <p className='mt-3'>Before scheduling an appointment, please be aware of the following:</p>
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
          
        <Calendar 
            className="font-Poppins mt-5 shadow-xl border-gray-300 text-xl w-full rounded-xl p-4" 
            onChange={setValue}
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
                `
                  rounded-full p-3 hover:bg-blue-100 cursor-pointer${value &&
                    value.toString() === date.toDateString()
                      ? 'bg-blue-500 text-white' : ''
                  }
                ` : ''
            }
            tileDisabled={({ date }) => isSunday(date)}
          />
        </div>
        <div className='w-1/4'>
            <h1 className='font-semibold text-md'>Date: {value?.toLocaleString().slice(0, 10)}</h1>
        </div>
      </div>
      <div className='w-full mt-auto'>
            <hr/>
          <div className='flex justify-between mb-3 mt-3'>
            <Button color="light" onClick={goBack}>
              Back
            </Button>
            <CustomButton size='md' className='mr-3' onClick={goBack}>
              Finish
            </CustomButton>
          </div>
      </div>
      
    </div>
  )
}

export default MakeAppointment