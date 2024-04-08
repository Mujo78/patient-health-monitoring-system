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
    <div className="my-auto flex flex-col flex-wrap items-center justify-around gap-3 md:flex-row xxl:!text-lg">
      <CustomCardTooltip
        tooltip_content="Number of doctors"
        text={numOfDoctors || 0}
      >
        <HiOutlineUserGroup className="h-auto w-5 xxl:!w-8" />
      </CustomCardTooltip>
      <CustomCardTooltip
        tooltip_content="Number of active doctors"
        text={numOfActiveDoctors || 0}
      >
        <HiOutlineUser className="h-auto w-5 xxl:!w-8" />
      </CustomCardTooltip>
      <CustomCardTooltip
        tooltip_content="Number of appointments today"
        text={todayAppointment?.total || 0}
      >
        <HiOutlineCalendarDays className="h-auto w-5 xxl:!w-8" />
      </CustomCardTooltip>
      <CustomCardTooltip
        tooltip_content="Finished appointments"
        text={todayAppointment?.finished || 0}
      >
        <HiOutlineCheckCircle className="h-auto w-5 xxl:!w-8" />
      </CustomCardTooltip>
      <CustomCardTooltip
        tooltip_content="Pending appointments"
        text={todayAppointment?.pending || 0}
      >
        <HiOutlineClock className="h-auto w-5 xxl:!w-8" />
      </CustomCardTooltip>
    </div>
  );
};

export default DepartmentStatistics;
