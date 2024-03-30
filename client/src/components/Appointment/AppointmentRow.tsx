import { Table } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import CustomImg from "../UI/CustomImg";
import {
  Appointment,
  cancelAppointment,
} from "../../features/appointment/appointmentSlice";
import {
  formatDate,
  formatStartEnd,
  isCurrentAppointment,
} from "../../service/appointmentSideFunctions";
import { HiXCircle } from "react-icons/hi2";
import { shallowEqual, useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import socket from "../../socket";
import toast from "react-hot-toast";

type Props = {
  variant: 1 | 2;
  data: Appointment;
};

const AppointmentRow: React.FC<Props> = ({ variant, data }) => {
  const navigate = useNavigate();
  const { accessUser } = useSelector(authUser, shallowEqual);
  const dispatch = useAppDispatch();

  const handleNavigate = () => {
    navigate(
      `${variant === 1 ? `/my-appointments/${data._id}` : `/appointments/${data._id}`}`,
    );
  };

  const cancelAppointmentNow = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (accessUser) {
      dispatch(cancelAppointment(data._id)).then((action) => {
        if (typeof action.payload === "object") {
          const selectedInfo = {
            app_date: `${formatDate(
              data.appointment_date,
            )}, ${formatStartEnd(data.appointment_date)}`,
            doctor_name: `${
              data.doctor_id.first_name + " " + data.doctor_id.last_name
            }`,
            doctor_spec: data.doctor_id.speciality,
          };
          socket.emit(
            "appointment_cancel",
            selectedInfo,
            data.patient_id.user_id._id,
            accessUser.data.role,
          );
          navigate("../", { replace: true });
          toast.error("Appointment cancelled");
        }
      });
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
          className="h-auto w-32 rounded-full xxl:!w-44"
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
          !isCurrentAppointment(data.appointment_date) && (
            <button className="size-8" onClick={(e) => cancelAppointmentNow(e)}>
              <HiXCircle className="size-6 text-red-600 hover:!text-red-700" />
            </button>
          )
        )}
      </Table.Cell>
    </Table.Row>
  );
};

export default AppointmentRow;
