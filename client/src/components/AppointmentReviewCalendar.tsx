import { Card, Spinner, Table } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { Value } from "../pages/patient/appointment/MakeAppointment";
import {
  formatDate,
  formatStartEnd,
  isCurrentAppointment,
} from "../service/appointmentSideFunctions";
import CustomImg from "./UI/CustomImg";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { useSelector } from "react-redux";
import {
  Appointment,
  appointment,
  cancelAppointment,
  getAppointmentsForADay,
  resetAppointmentDay,
} from "../features/appointment/appointmentSlice";
import { HiXCircle } from "react-icons/hi2";
import toast from "react-hot-toast";
import socket from "../socket";
import { authUser } from "../features/auth/authSlice";

type Props = {
  variant: 1 | 2;
};

const AppointmentReviewCalendar: React.FC<Props> = ({ variant }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState<Value>(new Date());
  const monthyear = value?.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const { selectedDayAppointments, status } = useSelector(appointment);
  const { accessUser } = useSelector(authUser);
  const dispatch = useAppDispatch();
  const todaysDate = useRef<unknown>(null);

  const handleNavigate = (id: string) => {
    navigate(
      `${variant === 1 ? `/my-appointments/${id}` : `/appointments/${id}`}`
    );
  };

  useEffect(() => {
    if (value) {
      if (todaysDate.current !== value) {
        dispatch(getAppointmentsForADay(value as Date));
        todaysDate.current = value;
      }
    }

    return () => {
      dispatch(resetAppointmentDay());
    };
  }, [dispatch, value]);

  const cancelAppointmentNow = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    selected: Appointment
  ) => {
    e.stopPropagation();
    if (accessUser) {
      dispatch(cancelAppointment(selected._id)).then((action) => {
        if (typeof action.payload === "object") {
          const selectedInfo = {
            app_date: `${formatDate(
              selected.appointment_date
            )}, ${formatStartEnd(selected.appointment_date)}`,
            doctor_name: `${
              selected.doctor_id.first_name + " " + selected.doctor_id.last_name
            }`,
            doctor_spec: selected.doctor_id.speciality,
          };
          socket.emit(
            "appointment_cancel",
            selectedInfo,
            selected.patient_id.user_id._id,
            accessUser.data.role
          );
          navigate("../", { replace: true });
          toast.error("Appointment cancelled");
        }
      });
    }
  };

  return (
    <Card className="max-w-xs flex justify-end items-start font-Poppins flex-col h-full">
      <div className="mb-auto">
        <p className="text-center mb-1 font-semibold">{monthyear}</p>
        <Calendar
          className="shadow-xl border-gray-300 text-xs w-full rounded-md p-3"
          onChange={setValue}
          locale="eng"
          onViewChange={({ view }) => view === "month"}
          minDate={new Date()}
          maxDate={new Date("01/01/2024")}
          value={value}
          showNavigation={false}
          tileClassName={({ date }) =>
            date.toDateString() === new Date().toDateString()
              ? "rounded-full p-1 !bg-blue-500 text-white hover:!bg-blue-450 cursor-pointer"
              : "!bg-white"
          }
          tileDisabled={() => true}
        />
        <Table className="mt-3">
          <Table.Body>
            {status === "loading" ? (
              <Table.Row>
                <Table.Cell className="text-center py-3 text-gray-500">
                  <Spinner size="sm" />
                </Table.Cell>
              </Table.Row>
            ) : selectedDayAppointments.length > 0 &&
              selectedDayAppointments.some((a) => !a.finished) ? (
              selectedDayAppointments.map(
                (n) =>
                  !n.finished && (
                    <Table.Row
                      key={n._id}
                      onClick={() => handleNavigate(n._id)}
                      className="flex cursor-pointer rounded-sm hover:!bg-gray-100 transition-colors duration-300 !p-0 justify-center border-b border-gray-300"
                    >
                      <Table.Cell className="p-2">
                        <CustomImg
                          url={
                            variant === 1
                              ? n?.doctor_id.user_id.photo
                              : n.patient_id.user_id.photo
                          }
                          className="!w-[120px] rounded-full"
                        />
                      </Table.Cell>
                      <Table.Cell className="w-full">
                        <div className="text-xs flex flex-col">
                          {variant === 1 ? (
                            <span className="text-black font-semibold text-xs mb-1">
                              Dr.{" "}
                              {n?.doctor_id.first_name +
                                " " +
                                n?.doctor_id.last_name}
                            </span>
                          ) : (
                            <span className="text-black font-semibold text-xs mb-1">
                              {n?.patient_id.first_name +
                                " " +
                                n?.patient_id.last_name}
                            </span>
                          )}
                          <span className="text-gray-600 text-[10px]">
                            {formatStartEnd(n.appointment_date)}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="w-1/6">
                        {isCurrentAppointment(n.appointment_date) ? (
                          <div className="w-4 h-4 bg-green-300 rounded-full"></div>
                        ) : variant === 1 ? (
                          <>
                            {new Date() > new Date(n.appointment_date) ? (
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            ) : (
                              new Date() < new Date(n.appointment_date) && (
                                <div className="w-4 h-4 bg-yellow-300 rounded-full"></div>
                              )
                            )}
                          </>
                        ) : (
                          !n.finished &&
                          !isCurrentAppointment(n.appointment_date) && (
                            <button
                              className="h-[30px] w-[30px]"
                              onClick={(e) => cancelAppointmentNow(e, n)}
                            >
                              <HiXCircle className="text-red-600 hover:!text-red-700 !h-[30px] !w-[30px]" />
                            </button>
                          )
                        )}
                      </Table.Cell>
                    </Table.Row>
                  )
              )
            ) : (
              <Table.Row>
                <Table.Cell className="text-center py-3 w-full text-gray-500">
                  You don't have any appointments today!
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </Card>
  );
};

export default AppointmentReviewCalendar;
