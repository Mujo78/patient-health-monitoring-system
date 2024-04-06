import React from "react";
import Calendar, { OnClickFunc } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  isDoctorAvailable,
  Value,
} from "../../service/appointmentSideFunctions";

type Props = {
  value: Value;
  setValue: React.Dispatch<React.SetStateAction<Value>>;
  handleGetAppForADay?: OnClickFunc;
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
      className={`w-full rounded-xl border-gray-300 font-Poppins shadow-xl lg:w-fit xxl:!p-8 xxl:!text-xl ${
        variant === 1 ? "text-md mt-3 w-full p-4" : "mt-0 h-fit  p-2 text-sm"
      }`}
      onChange={setValue}
      onClickDay={handleGetAppForADay}
      locale="eng"
      minDate={new Date()}
      maxDate={new Date("01/01/2025")}
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
