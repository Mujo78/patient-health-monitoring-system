import { Table } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomImg from "../UI/CustomImg";
import { Appointment } from "../../features/appointment/appointmentSlice";
import {
  formatStartEnd,
  getDateTime,
  isCurrentAppointment,
} from "../../service/appointmentSideFunctions";
import { shallowEqual, useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import socket from "../../socket";
import CancelAppointmentButton from "./CancelAppointmentButton";

type Props = {
  variant: 1 | 2;
  data: Appointment;
};

const AppointmentRow: React.FC<Props> = ({ variant, data }) => {
  const navigate = useNavigate();
  const { accessUser } = useSelector(authUser, shallowEqual);

  const handleNavigate = () => {
    navigate(
      `${variant === 1 ? `/my-appointments/${data._id}` : `/appointments/${data._id}`}`,
    );
  };

  const cancelAppointmentNow = () => {
    if (accessUser) {
      const selectedInfo = {
        app_date: getDateTime(data.appointment_date),
        doctor_name: data.doctor_id.first_name + " " + data.doctor_id.last_name,
        doctor_spec: data.doctor_id.speciality,
      };
      socket.emit(
        "appointment_cancel",
        selectedInfo,
        data.patient_id.user_id._id,
        accessUser.data.role,
      );
    }
  };

  return (
    <Table.Row
      onClick={handleNavigate}
      className="flex cursor-pointer justify-center rounded-sm border-b border-gray-300 !p-0 transition-colors duration-300 hover:!bg-gray-100"
    >
      <Table.Cell className="p-2">
        <CustomImg
          url={
            variant === 1
              ? data.doctor_id.user_id.photo
              : data.patient_id.user_id.photo
          }
          className="h-auto rounded-full xxl:!w-44"
          width={128}
        />
      </Table.Cell>
      <Table.Cell className="h-full w-full">
        <div className="flex flex-col justify-center">
          {variant === 1 ? (
            <span className="mb-1 text-xs font-semibold text-black xxl:!text-lg">
              Dr. {data.doctor_id.first_name + " " + data.doctor_id.last_name}
            </span>
          ) : (
            <span className="mb-1 text-xs font-semibold text-black xxl:!text-lg">
              {data.patient_id.first_name + " " + data.patient_id.last_name}
            </span>
          )}
          <span className="text-[0.6rem] text-gray-600 xxl:!text-lg">
            {formatStartEnd(data.appointment_date)}
          </span>
        </div>
      </Table.Cell>
      <Table.Cell className="w-1/6">
        {isCurrentAppointment(data.appointment_date) ? (
          <div className="size-4 rounded-full bg-green-300 xxl:size-6"></div>
        ) : variant === 1 ? (
          <>
            {new Date() > new Date(data.appointment_date) ? (
              <div className="size-4 rounded-full bg-red-500 xxl:size-6"></div>
            ) : (
              new Date() < new Date(data.appointment_date) && (
                <div className="size-4 rounded-full bg-yellow-300 xxl:size-6"></div>
              )
            )}
          </>
        ) : (
          !data.finished &&
          !isCurrentAppointment(data.appointment_date) &&
          data.appointment_date > new Date() && (
            <CancelAppointmentButton
              thenFn={cancelAppointmentNow}
              variant="icon"
              showToast
              id={data._id}
            />
          )
        )}
      </Table.Cell>
    </Table.Row>
  );
};

export default AppointmentRow;
