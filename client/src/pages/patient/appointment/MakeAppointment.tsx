import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/UI/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Textarea } from "flowbite-react";
import CustomImg from "../../../components/UI/CustomImg";
import {
  availableTimeForApp,
  convert12HourTo24Hour,
  getDoctor,
  isDoctorAvailable,
  workTime,
} from "../../../service/appointmentSideFunctions";
import { HiOutlineClock } from "react-icons/hi2";
import { useAppDispatch } from "../../../app/hooks";
import { useSelector } from "react-redux";
import {
  appointment,
  bookAppointment,
  getAppointmentsForADay,
  reset,
  resetAppointmentDay,
} from "../../../features/appointment/appointmentSlice";
import { toast } from "react-hot-toast";
import Footer from "../../../components/UI/Footer";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import CalendarAppointment from "../../../components/Appointment/CalendarAppointment";
import { authUser } from "../../../features/auth/authSlice";
import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import { DoctorType } from "../../../service/departmentSideFunctions";

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

const MakeAppointment: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accessUser } = useSelector(authUser);
  const { status, message, selectedDayAppointments } = useSelector(appointment);
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [time, setTime] = useState<string[] | null>();
  const [value, setValue] = useState<Value>(new Date());
  const [newTime, setNewTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [doc, setDoc] = useState<DoctorType>();

  useSelectedPage("Book appointment");

  useEffect(() => {
    dispatch(reset());
    if (value && doc) {
      if (isDoctorAvailable(value as Date, doc.available_days as string[])) {
        dispatch(getAppointmentsForADay(value as Date));
      }
    }
  }, [value, dispatch, doc]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (accessUser && doctorId) {
          const response = await getDoctor(accessUser.token, doctorId);
          setDoc(response);

          const resTime = await availableTimeForApp(value as Date, doctorId);
          setTime(resTime);
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [doctorId, accessUser, value]);

  const handleGetAppForADay = (value: Date) => {
    dispatch(getAppointmentsForADay(value));
    dispatch(resetAppointmentDay());
  };

  const makeNewAppointment = () => {
    const time = convert12HourTo24Hour(newTime);

    const index = value
      ?.toLocaleString()
      .indexOf(new Date(value.toString()).getFullYear().toString());

    const date = value
      ?.toLocaleString()
      .slice(0, Number(index) + 4)
      .replace(/\./g, "-")
      .replace(/\s+/g, "");

    const newAppDate =
      date?.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, (_, p1, p2, p3) => {
        const month = p1.padStart(2, "0");
        const day = p2.padStart(2, "0");
        return `${p3}-${month}-${day}`;
      }) +
      "T" +
      time +
      ":00";

    const appointmentData = {
      doctor_id: doctorId ? doctorId : "",
      reason: reason,
      appointment_date: new Date(newAppDate.replace(/\//g, "-").trim()),
    };

    if (doctorId && newTime) {
      dispatch(bookAppointment(appointmentData)).then((action) => {
        if (typeof action.payload === "object") {
          toast.success("Appointment successfully created!");
          navigate("/appointment", { replace: true });
        }
      });
    }
  };

  const appTime =
    selectedDayAppointments &&
    selectedDayAppointments.map((n) => {
      const date = new Date(n.appointment_date);
      const localTime = new Date(date.getTime());
      const formattedTime = localTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      const newTime = formattedTime.slice(0, 5).trim();
      return newTime;
    });

  const mergedArrayForTime = time && appTime.concat(time);

  const availableTime =
    mergedArrayForTime &&
    workTime.filter((m) => !mergedArrayForTime.includes(m));

  const setTimeForDate = (time: string) => {
    setNewTime(time);
  };

  return (
    <div className="mt-6 xl:!mt-0 xl:!h-full">
      {!doc ? (
        <CustomSpinner size="xl" />
      ) : (
        <div className="mx-1.5 flex h-full flex-col lg:!mx-3">
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 xl:!flex-row xl:!gap-12">
            <div className="h-full w-full xl:!my-auto xl:!flex-grow">
              <div className="my-auto flex h-full flex-col justify-center gap-3 xl:!gap-12">
                <Card horizontal className="flex justify-center lg:mx-auto">
                  {loading ? (
                    <CustomSpinner size="md" />
                  ) : (
                    <div className="flex items-center justify-around gap-4">
                      <CustomImg
                        url={doc?.user_id.photo}
                        className=" h-auto w-16 lg:w-24 xxl:w-40"
                      />
                      <div className="w-full">
                        <h1 className="text-md mb-1 font-bold text-blue-700 xxl:text-3xl">
                          {"Dr. " + doc?.first_name + " " + doc?.last_name}
                        </h1>
                        <p className="text-xs xxl:!text-lg">
                          {doc?.bio.split(".")[0]}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>
                <div className="flex flex-col justify-around">
                  <div className="mb-3">
                    <h1 className="text-xl font-semibold xxl:!text-2xl">
                      {doc?.speciality}
                    </h1>
                    <div className="mt-1 flex items-center text-gray-600">
                      <HiOutlineClock className="xxl:h-8 xxl:w-8" />
                      <p className="ml-1 text-xs xxl:!text-xl">20min</p>
                    </div>
                  </div>
                  <div className="divide-y text-xs text-gray-500 xxl:!text-xl">
                    <p className="leading-4.5">
                      With years of expertise and advanced training, our doctors
                      are equipped to address a wide spectrum of health
                      concerns. From routine check-ups to intricate medical
                      cases, our team is dedicated to delivering precise
                      diagnoses and effective treatment plans. Schedule an
                      appointment now.
                    </p>
                    <div className="mt-3">
                      <p className="mt-3 font-semibold">
                        Before scheduling an appointment, please be aware of the
                        following:
                      </p>
                      <ul className="ml-3 flex list-disc flex-col gap-3 p-2 leading-4 xxl:leading-8">
                        <li>
                          Your appointment is a one-to-one meeting with the
                          doctor you have selected.
                        </li>
                        <li>
                          Ensure that you have all required documentation ready
                          to participate in the appointment.
                        </li>
                        <li>
                          Prior to your appointment, you will receive an email
                          notification.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-auto flex w-full flex-col xl:!flex-grow">
              <h1 className="text-xl font-semibold xxl:!text-2xl">Set Date</h1>
              <div className="flex flex-col flex-nowrap gap-8 lg:flex-row xl:!flex-wrap xl:!gap-3">
                <div>
                  <div className="flex justify-between text-sm xxl:!text-lg">
                    <p>
                      <span className="text-xl text-yellow-300">•</span> today{" "}
                    </p>
                    <p>
                      <span className="text-xl text-gray-400">•</span> out of
                      bounds{" "}
                    </p>
                    <p>
                      <span className="text-xl text-blue-500">•</span> choosen{" "}
                    </p>
                  </div>
                  <CalendarAppointment
                    variant={1}
                    value={value}
                    setValue={setValue}
                    handleGetAppForADay={handleGetAppForADay}
                    docAvailable={doc?.available_days as string[]}
                  />
                </div>
                <Textarea
                  placeholder="Note for the doctor"
                  title="Note"
                  rows={4}
                  className="mt-2 text-sm lg:!mt-10 xxl:!text-lg"
                  value={reason}
                  name="reason"
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className="mt-2 hidden h-3 xl:!flex">
                {status === "failed" && (
                  <p className="text-xs  font-bold text-red-600 xxl:!text-xl">
                    {message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex h-1/4 w-full flex-col justify-center gap-3 xl:!flex-grow">
              <h1 className="my-1 text-xl font-semibold xxl:!text-2xl">
                Date:{" "}
                {value
                  ?.toLocaleString()
                  .slice(
                    0,
                    value
                      .toLocaleString()
                      .indexOf(
                        new Date(value.toString()).getFullYear().toString(),
                      ) + 4,
                  )}{" "}
                ({availableTime && availableTime.length})
              </h1>
              <div className="flex h-fit w-full flex-wrap rounded-lg border border-gray-300 p-1.5">
                {isDoctorAvailable(
                  value as Date,
                  doc?.available_days as string[],
                ) ? (
                  <div className="h-20 w-full text-center">
                    <ErrorMessage
                      className="mt-5"
                      text="You can not make appointment today"
                      size="sm"
                    />
                  </div>
                ) : status === "loading" ? (
                  <CustomSpinner />
                ) : availableTime && availableTime.length > 0 ? (
                  availableTime.map((n) => (
                    <Button
                      size="sm"
                      key={n}
                      onClick={() => setTimeForDate(n)}
                      color="light"
                      className={`m-1.5 ${
                        newTime === n &&
                        "bg-blue-500 text-white hover:text-black"
                      }  focus:!ring-blue-600`}
                    >
                      <p className="xxl:text-xl">
                        {parseInt(n.split(":")[0]) < 9 ? `${n} PM` : `${n} AM`}
                      </p>
                    </Button>
                  ))
                ) : (
                  <p className="mx-auto my-auto text-sm">
                    There are no more available appointments for this day
                  </p>
                )}
              </div>
            </div>

            <div className="mb-5 h-4 xl:hidden">
              {status === "failed" && (
                <p className="text-xs font-bold text-red-600">{message}</p>
              )}
            </div>
          </div>
          <Footer variant={2}>
            <CustomButton
              disabled={
                !value ||
                !newTime ||
                isDoctorAvailable(
                  value as Date,
                  doc?.available_days as string[],
                )
              }
              size="md"
              className="mb-12 w-full md:!mb-0 lg:!w-fit"
              onClick={makeNewAppointment}
            >
              <p className="xxl:text-xl">Finish</p>
            </CustomButton>
          </Footer>
        </div>
      )}
    </div>
  );
};

export default MakeAppointment;
