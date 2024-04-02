import React, { useEffect, useMemo, useState } from "react";
import CustomButton from "../../../components/UI/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "flowbite-react";
import {
  Value,
  availableTimeForApp,
  getAvailableTime,
  getCorrectDate,
  getDoctor,
  isDoctorAvailable,
} from "../../../service/appointmentSideFunctions";
import { useAppDispatch } from "../../../app/hooks";
import { useSelector } from "react-redux";
import {
  appointment,
  bookAppointment,
  getAppointmentsForADay,
  resetAppointmentDay,
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

const MakeAppointment: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, message, selectedDayAppointments } = useSelector(appointment);
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [time, setTime] = useState<string[] | null>();
  const [value, setValue] = useState<Value>(new Date());
  const [newTime, setNewTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [doctor, setDoctor] = useState<DoctorType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (doctorId) {
          const response = await getDoctor(doctorId);
          setDoctor(response);
        }
      } catch (error: any) {
        setError(true);
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (doctorId && !error) {
          const resTime = await availableTimeForApp(value as Date, doctorId);
          setTime(resTime);
        }
      } catch (error: any) {
        setError(true);
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId, value, error]);

  useEffect(() => {
    if (error) toast.error("Something went wrong, please try again later!");
  }, [error]);

  const handleGetAppForADay = (value: Date) => {
    dispatch(getAppointmentsForADay(value));
    dispatch(resetAppointmentDay());
  };

  const makeNewAppointment = () => {
    if (doctorId && newTime) {
      const appointmentData = {
        doctor_id: doctorId,
        reason: reason,
        appointment_date: getCorrectDate(value, newTime),
      };

      dispatch(bookAppointment(appointmentData)).then((action) => {
        if (typeof action.payload === "object") {
          toast.success("Appointment successfully created!");
          navigate("/appointment", { replace: true });
        }
      });
    }
  };

  const availableTime = useMemo(() => {
    return getAvailableTime(time, selectedDayAppointments);
  }, [time, selectedDayAppointments]);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
  };

  return (
    <div className="mt-6 xl:!mt-0 xl:!h-full">
      {!doctor && loading ? (
        <CustomSpinner size="xl" />
      ) : doctor ? (
        <div className="mx-1.5 flex h-full flex-col lg:!mx-3">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 xl:!flex-row xl:!gap-12">
            <div className="h-full w-full xl:!my-auto xl:!flex-grow">
              <MakeAppointmentInfo loading={loading} doctor={doctor} />
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
                    handleGetAppForADay={handleGetAppForADay}
                    docAvailable={doctor?.available_days as string[]}
                  />
                </div>
                <Textarea
                  placeholder="Note for the doctor"
                  title="Note"
                  rows={4}
                  className="mt-2 text-sm lg:!mt-10 xxl:!text-lg"
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
                text={`Date: ${moment(value as MomentInput).format("DD/MM/YYYY")} (${isDoctorAvailable(value as Date, doctor.available_days) ? 0 : availableTime && availableTime.length})`}
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
                ) : availableTime && availableTime.length > 0 ? (
                  availableTime.map((n) => (
                    <TimeButton
                      key={n}
                      setNewTime={setNewTime}
                      newTime={newTime}
                      time={n}
                    />
                  ))
                ) : (
                  error && (
                    <p className="mx-auto my-auto text-sm">
                      There are no more available appointments for this day
                    </p>
                  )
                )}
              </div>
            </div>

            <ErrorMessage text={message} xlHide className=" pb-6" />
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
      ) : (
        error && (
          <div className="mt-12 h-full w-full text-center">
            <ErrorMessage text="Something went went wrong, please try again later!" />
          </div>
        )
      )}
    </div>
  );
};

export default MakeAppointment;
