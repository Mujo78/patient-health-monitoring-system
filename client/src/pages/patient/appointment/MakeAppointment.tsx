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

          const resTime = await availableTimeForApp(
            value as Date,
            doctorId,
            accessUser.token
          );
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
        <div className="flex flex-col h-full mx-1.5 lg:!mx-3">
          <div className="flex flex-col xl:!flex-row gap-4 xl:!gap-12 w-full h-full items-center justify-center">
            <div className="w-full xl:!flex-grow xl:!my-auto h-full">
              <div className="my-auto h-full flex flex-col justify-center gap-3 xl:!gap-12">
                <Card horizontal className="flex justify-center lg:mx-auto">
                  {loading ? (
                    <CustomSpinner size="md" />
                  ) : (
                    <div className="flex gap-4 justify-around items-center">
                      <CustomImg
                        url={doc?.user_id.photo}
                        className=" w-16 lg:w-24 xxl:w-40 h-auto"
                      />
                      <div className="w-full">
                        <h1 className="font-bold text-md xxl:text-3xl mb-1 text-blue-700">
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
                    <h1 className="text-xl xxl:!text-2xl font-semibold">
                      {doc?.speciality}
                    </h1>
                    <div className="flex items-center mt-1 text-gray-600">
                      <HiOutlineClock className="xxl:w-8 xxl:h-8" />
                      <p className="ml-1 text-xs xxl:!text-xl">20min</p>
                    </div>
                  </div>
                  <div className="divide-y text-gray-500 text-xs xxl:!text-xl">
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
                      <ul className="list-disc flex flex-col gap-3 p-2 ml-3 leading-4 xxl:leading-8">
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
            <div className="flex flex-col my-auto w-full xl:!flex-grow">
              <h1 className="text-xl xxl:!text-2xl font-semibold">Set Date</h1>
              <div className="flex flex-col lg:flex-row gap-8 xl:!gap-3 flex-nowrap xl:!flex-wrap">
                <div>
                  <div className="text-sm xxl:!text-lg flex justify-between">
                    <p>
                      <span className="text-yellow-300 text-xl">•</span> today{" "}
                    </p>
                    <p>
                      <span className="text-gray-400 text-xl">•</span> out of
                      bounds{" "}
                    </p>
                    <p>
                      <span className="text-blue-500 text-xl">•</span> choosen{" "}
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
                  className="lg:!mt-10 mt-2 text-sm xxl:!text-lg"
                  value={reason}
                  name="reason"
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <div className="hidden xl:!flex h-3 mt-2">
                {status === "failed" && (
                  <p className="text-xs  xxl:!text-xl text-red-600 font-bold">
                    {message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full xl:!flex-grow flex flex-col gap-3 justify-center h-1/4">
              <h1 className="font-semibold text-xl xxl:!text-2xl my-1">
                Date:{" "}
                {value
                  ?.toLocaleString()
                  .slice(
                    0,
                    value
                      .toLocaleString()
                      .indexOf(
                        new Date(value.toString()).getFullYear().toString()
                      ) + 4
                  )}{" "}
                ({availableTime && availableTime.length})
              </h1>
              <div className="flex flex-wrap h-fit w-full p-1.5 border-gray-300 border rounded-lg">
                {isDoctorAvailable(
                  value as Date,
                  doc?.available_days as string[]
                ) ? (
                  <div className="text-center w-full h-20">
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
                  <p className="text-sm mx-auto my-auto">
                    There are no more available appointments for this day
                  </p>
                )}
              </div>
            </div>

            <div className="xl:hidden h-4 mb-5">
              {status === "failed" && (
                <p className="text-xs text-red-600 font-bold">{message}</p>
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
                  doc?.available_days as string[]
                )
              }
              size="md"
              className="w-full mb-12 lg:!w-fit md:!mb-0"
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
