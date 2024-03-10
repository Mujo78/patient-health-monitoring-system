import React from "react";
import CustomCardTooltip from "../UI/CustomCardTooltip";
import {
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi2";
import { todayAppointmentDataType } from "../../service/departmentSideFunctions";

type Props = {
  numOfDoctors: number;
  numOfActiveDoctors: number;
  todayAppointment: todayAppointmentDataType;
};

const DepartmentStatistics: React.FC<Props> = ({
  numOfDoctors,
  numOfActiveDoctors,
  todayAppointment,
}) => {
  return (
    <div className="flex flex-wrap my-auto flex-col md:flex-row gap-3 items-center xxl:!text-lg justify-around">
      <CustomCardTooltip
        tooltip_content="Number of doctors"
        text={numOfDoctors || 0}
      >
        <HiOutlineUserGroup className="w-5 xxl:!w-8 h-auto" />
      </CustomCardTooltip>
      <CustomCardTooltip
        tooltip_content="Number of active doctors"
        text={numOfActiveDoctors || 0}
      >
        <HiOutlineUser className="w-5 xxl:!w-8 h-auto" />
      </CustomCardTooltip>
      <CustomCardTooltip
        tooltip_content="Number of appointments today"
        text={todayAppointment.total || 0}
      >
        <HiOutlineCalendarDays className="w-5 xxl:!w-8 h-auto" />
      </CustomCardTooltip>
      <CustomCardTooltip
        tooltip_content="Finished appointments"
        text={todayAppointment.finished || 0}
      >
        <HiOutlineCheckCircle className="w-5 xxl:!w-8 h-auto" />
      </CustomCardTooltip>
      <CustomCardTooltip
        tooltip_content="Pending appointments"
        text={todayAppointment.pending || 0}
      >
        <HiOutlineClock className="w-5 xxl:!w-8 h-auto" />
      </CustomCardTooltip>
    </div>
  );
};

export default DepartmentStatistics;
