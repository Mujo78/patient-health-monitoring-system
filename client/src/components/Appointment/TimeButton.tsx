import { Button } from "flowbite-react";
import React from "react";
import { convert12HourTo24Hour } from "../../service/appointmentSideFunctions";

type Props = {
  newTime: string;
  time: string;
  setNewTime: React.Dispatch<React.SetStateAction<string>>;
};

const TimeButton: React.FC<Props> = ({ newTime, time, setNewTime }) => {
  const onClick = () => {
    setNewTime(time);
  };

  return (
    <Button
      size="sm"
      onClick={onClick}
      color="light"
      className={`m-1.5 ${
        (newTime === convert12HourTo24Hour(time) || newTime === time) &&
        "bg-blue-700 text-white hover:text-black"
      }  focus:!ring-blue-800`}
    >
      <p className="xxl:text-xl">{time}</p>
    </Button>
  );
};

export default TimeButton;
