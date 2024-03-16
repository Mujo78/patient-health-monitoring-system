import { Card, Spinner, Table } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import { Value } from "../../pages/patient/appointment/MakeAppointment";
import {
  formatDate,
  formatStartEnd,
  isCurrentAppointment,
} from "../../service/appointmentSideFunctions";
import CustomImg from "../UI/CustomImg";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { useSelector } from "react-redux";
import {
  Appointment,
  appointment,
  cancelAppointment,
  getAppointmentsForADay,
  resetAppointmentDay,
} from "../../features/appointment/appointmentSlice";
import { HiXCircle } from "react-icons/hi2";
import toast from "react-hot-toast";
import socket from "../../socket";
import { authUser } from "../../features/auth/authSlice";

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
    <Card className="w-full xl:!max-w-sm xxl:!max-w-xl h-fit xl:!h-full sm:mb-3 mb-20 flex justify-start">
      <div className="flex flex-col lg:!flex-row xl:!flex-col gap-3 h-5/6 xl:!h-full max-w-full items-start justify-start">
        <div className="lg:!max-w-xs xxl:!max-w-full xl:!mx-auto">
          <p className="text-center text-md xxl:!text-xl mb-1 font-semibold">
            {monthyear}
          </p>
          <Calendar
            className="shadow-xl border-gray-300 text-xs xxl:!text-lg w-full  rounded-md p-3"
            onChange={setValue}
            locale="eng"
            onViewChange={({ view }) => view === "month"}
            minDate={new Date()}
            maxDate={new Date("01/01/2025")}
            value={value}
            showNavigation={false}
            tileClassName={({ date }) =>
              date.toDateString() === new Date().toDateString()
                ? "rounded-full p-1 !bg-blue-500 text-white hover:!bg-blue-450 cursor-pointer"
                : "!bg-white"
            }
            tileDisabled={() => true}
          />
        </div>
        <div className="w-full h-64 xl:!h-full overflow-y-auto" id="content">
          <Table className="w-full h-full">
            <Table.Body className="overflow-y-auto h-full w-full">
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
                            className="w-32 xxl:!w-44 h-auto rounded-full"
                          />
                        </Table.Cell>
                        <Table.Cell className="w-full h-full">
                          <div className="flex justify-center flex-col">
                            {variant === 1 ? (
                              <span className="text-black font-semibold text-xs xxl:!text-lg mb-1">
                                Dr.{" "}
                                {n?.doctor_id.first_name +
                                  " " +
                                  n?.doctor_id.last_name}
                              </span>
                            ) : (
                              <span className="text-black font-semibold text-xs xxl:!text-lg mb-1">
                                {n?.patient_id.first_name +
                                  " " +
                                  n?.patient_id.last_name}
                              </span>
                            )}
                            <span className="text-gray-600 xxl:!text-lg text-[10px]">
                              {formatStartEnd(n.appointment_date)}
                            </span>
                          </div>
                        </Table.Cell>
                        <Table.Cell className="w-1/6">
                          {isCurrentAppointment(n.appointment_date) ? (
                            <div className="size-4 xxl:size-6 bg-green-300 rounded-full"></div>
                          ) : variant === 1 ? (
                            <>
                              {new Date() > new Date(n.appointment_date) ? (
                                <div className="size-4 xxl:size-6 bg-red-500 rounded-full"></div>
                              ) : (
                                new Date() < new Date(n.appointment_date) && (
                                  <div className="size-4 xxl:size-6 bg-yellow-300 rounded-full"></div>
                                )
                              )}
                            </>
                          ) : (
                            !n.finished &&
                            !isCurrentAppointment(n.appointment_date) && (
                              <button
                                className="size-8"
                                onClick={(e) => cancelAppointmentNow(e, n)}
                              >
                                <HiXCircle className="text-red-600 hover:!text-red-700 size-6" />
                              </button>
                            )
                          )}
                        </Table.Cell>
                      </Table.Row>
                    )
                )
              ) : (
                <Table.Row className="h-52">
                  <Table.Cell className="text-center text-md xxl:text-lg py-3 w-full mx-auto text-gray-500">
                    You don't have any appointments today!
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentReviewCalendar;
