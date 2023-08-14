import React, { useState } from 'react'
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const MakeAppointment: React.FC = () => {

  const [value, setValue] = useState<Value>(new Date());
  const date = new Date("01/01/2024")
  const newAppDate = value?.toLocaleString().slice(0, 9) + ", 12:25"
  console.log(value)
  console.log(newAppDate)
  console.log(new Date(newAppDate))

  const isSunday = (date: Date) => {
    return date.getDay() === 0;
  };
  return (
    <div>
      <Calendar 
        className="font-Poppins shadow-xl border-gray-300 text-xl w-2/5 rounded-xl p-4" 
        onChange={setValue}
        locale='eng'
        minDate={new Date()}
        maxDate={date}
        value={value}
        prev2Label={<span className="text-gray-500">&lt;&lt;</span>}
        next2Label={<span className="text-gray-500">&gt;&gt;</span>}
        prevLabel={<span className="text-gray-800">&lt;</span>}
        nextLabel={<span className="text-gray-800">&gt;</span>}
        tileClassName={({ date, view }) =>
          view === 'month'
            ? `
              rounded-full p-3 hover:bg-blue-100 cursor-pointer
              ${
                value &&
                value.toString() === date.toDateString()
                  ? 'bg-blue-500 text-white' // Apply this class for the selected date
                  : ''
              }
            `
            : ''
        }
        tileDisabled={({ date }) => isSunday(date)}
      navigationLabel={({ date, view }) => {
        if (view === 'month') {
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          });
        }
        return date.getFullYear().toString();
      }}
      />
    </div>
  )
}

export default MakeAppointment