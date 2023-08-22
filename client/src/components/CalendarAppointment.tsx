import React from 'react'
import Calendar, { OnClickFunc } from "react-calendar"
import 'react-calendar/dist/Calendar.css';
import { Value } from '../pages/patient/appointment/MakeAppointment';
import { isSunday } from '../service/appointmentSideFunctions';

type Props = {
    value: Value,
    setValue: React.Dispatch<React.SetStateAction<Value>>
    handleGetAppForADay: OnClickFunc,
    variant: number
}

const CalendarAppointment: React.FC<Props> = ({value, setValue, handleGetAppForADay, variant}) => {

  return (
    <Calendar className={`font-Poppins shadow-xl border-gray-300 ${variant === 1 ? 'text-xl mt-3 w-full rounded-xl' : ''} p-4`} 
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
                ` rounded-full ${variant === 1 ? 'p-3' : 'p-2'} hover:bg-blue-100 cursor-pointer${value &&
                    value.toString() === date.toString() ? '!bg-blue-700 hover:!bg-700 hover:!text-white' : ''
                  } ` : ''
            }
            tileDisabled={({ date }) => isSunday(date)}
          />
  )
}

export default CalendarAppointment