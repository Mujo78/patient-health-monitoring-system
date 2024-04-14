import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/UI/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "flowbite-react";
import {
  Value,
  getOtherAppsForDay,
  getCorrectDate,
  getDoctor,
  isDoctorAvailable,
} from "../../../service/appointmentSideFunctions";
import { useAppDispatch } from "../../../app/hooks";
import { useSelector } from "react-redux";
import {
  appointment,
  bookAppointment,
} from "../../../features/appointment/appointmentSlice";
import { toast } from "react-hot-toast";
import Footer from "../../../components/UI/Footer";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import CalendarAppointment from "../../../components/Appointment/CalendarAppointment";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import { DoctorType } from "../../../service/departmentSideFunctions";
import Header from "../../../components/UI/Header";
import moment, { MomentInput } from "moment";
import MakeAppointmentInfo from "../../../components/Appointment/MakeAppointmentInfo";
import TimeButton from "../../../components/Appointment/TimeButton";
import { isFulfilled } from "@reduxjs/toolkit";
import NoDataAvailable from "../../../components/UI/NoDataAvailable";

const MakeAppointment: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDoc, setLoadingDoc] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [time, setTime] = useState<string[] | null>();
  const [value, setValue] = useState<Value>(new Date());
  const [newTime, setNewTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [doctor, setDoctor] = useState<DoctorType>();

  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, message } = useSelector(appointment);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDoc(true);
        if (doctorId && !doctor) {
          const response = await getDoctor(doctorId);
          setDoctor(response);
        }
      } catch (error: any) {
        setError(error?.response?.data ?? error?.message);
        throw new Error(error);
      } finally {
        setLoadingDoc(false);
      }
    };
    fetchData();
  }, [doctorId, doctor]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (doctorId && !error) {
          const resTime = await getOtherAppsForDay(value as Date, doctorId);
          setTime(resTime);
        }
      } catch (error: any) {
        setError(error?.response?.data ?? error?.message);
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId, value, error]);

  const makeNewAppointment = () => {
    if (doctorId && newTime) {
      const appointmentData = {
        doctor_id: doctorId,
        reason: reason,
        appointment_date: getCorrectDate(value, newTime),
      };

      dispatch(bookAppointment(appointmentData)).then((action) => {
        if (isFulfilled(action)) {
          toast.success("Appointment successfully created!");
          navigate("/appointment", { replace: true });
        }
      });
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
  };

  return (
    <div className="mt-6 xl:!mt-0 xl:!h-full">
      {!doctor && loadingDoc ? (
        <CustomSpinner size="xl" />
      ) : doctor && !error ? (
        <div className="mx-1.5 flex h-full flex-col lg:!mx-3">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 xl:!flex-row xl:!gap-12">
            <div className="h-full w-full xl:!my-auto xl:!flex-grow">
              <MakeAppointmentInfo loading={loadingDoc} doctor={doctor} />
            </div>
            <div className="my-auto flex w-full flex-col xl:!flex-grow">
              <Header size={1} position="start" text="Set Date" />
              <div className="flex flex-col flex-nowrap gap-8 lg:flex-row xl:!flex-wrap xl:!gap-3">
                <div>
                  <div className="flex justify-between text-sm xxl:!text-lg">
                    <p className="flex items-center gap-1">
                      <span className="text-5xl text-yellow-300">•</span> today
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="text-5xl text-gray-400">•</span> out of
                      bounds
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="text-5xl text-blue-500">•</span> choosen
                    </p>
                  </div>
                  <CalendarAppointment
                    variant={1}
                    value={value}
                    setValue={setValue}
                    docAvailable={doctor?.available_days as string[]}
                  />
                </div>
                <Textarea
                  placeholder="Note for the doctor"
                  title="Note"
                  rows={4}
                  className="mt-2 text-sm focus:!border-blue-700 focus:!ring-blue-700 lg:!mt-10 xxl:!text-lg"
                  value={reason}
                  name="reason"
                  onChange={onChange}
                />
              </div>
              <ErrorMessage smHide text={message} />
            </div>
            <div className="flex h-1/4 w-full flex-col justify-center gap-3 xl:!flex-grow">
              <Header
                size={1}
                text={`Date: ${moment(value as MomentInput).format("DD/MM/YYYY")} (${isDoctorAvailable(value as Date, doctor.available_days) ? 0 : time && time.length})`}
                position="start"
              />
              <div className="flex h-fit w-full flex-wrap rounded-lg border border-gray-300 p-1.5">
                {status === "loading" || loading ? (
                  <div className="w-full p-12 xl:!h-60 xl:!p-0">
                    <CustomSpinner />
                  </div>
                ) : isDoctorAvailable(
                    value as Date,
                    doctor?.available_days as string[],
                  ) ? (
                  <div className="flex h-20 w-full items-center justify-center">
                    <ErrorMessage text="You can not make appointment today" />
                  </div>
                ) : time && time.length > 0 ? (
                  time.map((n) => (
                    <TimeButton
                      key={n}
                      setNewTime={setNewTime}
                      newTime={newTime}
                      time={n}
                    />
                  ))
                ) : (
                  <p className="mx-auto my-auto px-12 py-16 text-sm">
                    There are no more available appointments for this day
                  </p>
                )}
              </div>
            </div>

            <ErrorMessage text={message || error} xlHide className="pb-6" />
          </div>
          <Footer variant={2} className="mt-5 xl:!mt-0">
            <CustomButton
              disabled={
                !value ||
                !newTime ||
                isDoctorAvailable(
                  value as Date,
                  doctor?.available_days as string[],
                )
              }
              size="md"
              className="mb-12 w-full md:!mb-0 lg:!w-fit"
              onClick={makeNewAppointment}
            >
              <p className="xxl:text-lg">Finish</p>
            </CustomButton>
          </Footer>
        </div>
      ) : error || message ? (
        <div className="mt-12 h-full w-full text-center">
          <ErrorMessage text={error || message} />
        </div>
      ) : (
        !doctor && status === "idle" && <NoDataAvailable className="mt-5" />
      )}
    </div>
  );
};

export default MakeAppointment;
