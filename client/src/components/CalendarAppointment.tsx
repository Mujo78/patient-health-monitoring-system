import React from "react";
import Calendar, { OnClickFunc } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Value } from "../pages/patient/appointment/MakeAppointment";
import { isDoctorAvailable } from "../service/appointmentSideFunctions";

type Props = {
  value: Value;
  setValue: React.Dispatch<React.SetStateAction<Value>>;
  handleGetAppForADay: OnClickFunc;
  variant: number;
  docAvailable: string[];
};

const CalendarAppointment: React.FC<Props> = ({
  value,
  setValue,
  handleGetAppForADay,
  docAvailable,
  variant,
}) => {
  return (
    <Calendar
      className={`font-Poppins shadow-xl border-gray-300 rounded-xl ${
        variant === 1 ? "text-md mt-3 w-full p-4" : "text-sm mt-0  h-fit p-2"
      }`}
      onChange={setValue}
      onClickDay={handleGetAppForADay}
      locale="eng"
      minDate={new Date()}
      maxDate={new Date("01/01/2024")}
      value={value}
      prev2Label={<span className="text-gray-500">&lt;&lt;</span>}
      next2Label={<span className="text-gray-500">&gt;&gt;</span>}
      prevLabel={<span className="text-gray-800">&lt;</span>}
      nextLabel={<span className="text-gray-800">&gt;</span>}
      tileClassName={({ date, view }) =>
        view === "month"
          ? ` rounded-full ${
              variant === 1 ? "p-3 mx-1" : "p-1.5"
            } hover:bg-blue-100 cursor-pointer${
              value && value.toString() === date.toString()
                ? "!bg-blue-700 hover:!bg-700 hover:!text-white"
                : ""
            } `
          : ""
      }
      tileDisabled={({ date }) => isDoctorAvailable(date, docAvailable)}
    />
  );
};

export default CalendarAppointment;
