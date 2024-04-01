import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Textarea, Badge } from "flowbite-react";
import {
  appointment,
  editAppointment,
  getAppointmentsForADay,
  reset,
  resetAppointmentDay,
} from "../../../features/appointment/appointmentSlice";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { shallowEqual, useSelector } from "react-redux";
import {
  HiOutlinePencilSquare,
  HiOutlineDocumentDuplicate,
} from "react-icons/hi2";
import CalendarAppointment from "../../../components/Appointment/CalendarAppointment";
import { Value } from "./MakeAppointment";
import { useAppDispatch } from "../../../app/hooks";
import {
  availableTimeForApp,
  canCancelOrEdit,
  convert12HourTo24Hour,
  getCorrectDate,
  isDSTFunc,
  isDoctorAvailable,
  workTime,
} from "../../../service/appointmentSideFunctions";
import CustomButton from "../../../components/UI/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import moment, { MomentInput } from "moment";
import AppointmentOverview from "../../../components/Appointment/AppointmentOverview";
import CustomSpinner from "../../../components/UI/CustomSpinner";

const AppointmentOverviewEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    selectedAppointment: sApp,
    selectedDayAppointments,
    status,
    message,
  } = useSelector(appointment, shallowEqual);

  const appointmentReason = sApp?.reason ?? "";
  const formatedAppointmentTime = convert12HourTo24Hour(
    moment
      .utc(sApp?.appointment_date)
      .add(isDSTFunc(), "hours")
      .format("HH:mm"),
  );

  const [time, setTime] = useState<string[] | null>();
  const [value, setValue] = useState<Value>(
    new Date(sApp?.appointment_date as Date),
  );
  const [newTime, setNewTime] = useState<string>(formatedAppointmentTime);
  const [reason, setReason] = useState<string>(appointmentReason);
  const [active, setActive] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      try {
        if (sApp?.doctor_id._id && active === 1) {
          setLoading(true);
          const response = await availableTimeForApp(
            value as Date,
            sApp?.doctor_id._id,
          );
          setTime(response);
        }
      } catch (error: any) {
        setError(error.message);
        throw new Error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (value) {
      fetchData();
    }
  }, [value, active, sApp?.doctor_id._id]);

  useEffect(() => {
    if (error) toast.error("Something went wrong, please try again later!");
  }, [error]);

  const dispatch = useAppDispatch();

  const handleGetAppForADay = (value: Date) => {
    dispatch(getAppointmentsForADay(value));
    dispatch(resetAppointmentDay());
  };

  const availableTime = useMemo(() => {
    if (time && selectedDayAppointments) {
      const appTime = selectedDayAppointments.map((n) => {
        const date = new Date(n.appointment_date);
        const localTime = new Date(date.getTime());
        const formattedTime = localTime.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
        const newTime = formattedTime.slice(0, 5).trim();
        return newTime;
      });

      const mergedArrayTime = appTime.concat(time);

      return (
        mergedArrayTime && workTime.filter((m) => !mergedArrayTime.includes(m))
      );
    }
  }, [selectedDayAppointments, time]);

  const setTimeForDate = (time: string) => {
    setNewTime(time);
  };

  const handleEdit = () => {
    const editObjectData = {
      reason,
      appointment_date: getCorrectDate({ value, newTime }),
    };

    if (
      reason !== sApp?.reason ||
      editObjectData.appointment_date.getTime() !==
        new Date(sApp.appointment_date).getTime()
    ) {
      if (id) {
        dispatch(editAppointment({ id, editObjectData })).then((action) => {
          if (typeof action.payload === "object") {
            toast.success("Successfully edited appointment.");
            navigate("../");
            dispatch(reset());
          } else {
            setActive(1);
          }
        });
      }
    }
  };

  const handleGet = (tab: number) => {
    setActive(tab);
    if (tab === 1 && status !== "failed") {
      dispatch(getAppointmentsForADay(value as Date));
      dispatch(resetAppointmentDay());
    }
  };

  return (
    <>
      <Tabs.Group
        aria-label="Default tabs"
        style="default"
        onActiveTabChange={(tab) => handleGet(tab)}
        tabIndex={active}
      >
        <Tabs.Item
          active={active === 0}
          title="Overview"
          icon={HiOutlineDocumentDuplicate}
        >
          <AppointmentOverview />
        </Tabs.Item>
        {sApp?.appointment_date &&
        canCancelOrEdit(sApp?.appointment_date) &&
        !sApp?.finished ? (
          <Tabs.Item
            active={active === 1}
            title="Edit"
            icon={HiOutlinePencilSquare}
          >
            <div className="flex h-full w-full flex-col gap-2 xxl:!h-[60vh]">
              <div className="flex h-full w-full flex-col gap-4 lg:flex-row xxl:items-center">
                <div className="flex w-full flex-col text-sm lg:!w-2/5 xxl:!text-xl">
                  <p className="mb-2 font-semibold">Reason</p>
                  <Textarea
                    placeholder="Reason"
                    name="reason"
                    id="content"
                    className="text-sm xxl:!text-xl"
                    onChange={(e) => setReason(e.currentTarget.value)}
                    value={reason}
                    rows={10}
                  />
                </div>
                <div className="flex w-full flex-col justify-between gap-4 lg:w-3/4 lg:flex-row">
                  <CalendarAppointment
                    variant={2}
                    value={value}
                    setValue={setValue}
                    handleGetAppForADay={handleGetAppForADay}
                    docAvailable={sApp?.doctor_id.available_days as string[]}
                  />
                  <div className="my-auto flex h-full w-full flex-col justify-around lg:w-2/5 xxl:!text-xl">
                    <h1 className="text-md font-semibold">
                      Date:
                      {" " +
                        moment(value as MomentInput).format("DD/MM/YYYY")}{" "}
                      {availableTime && availableTime.length}
                    </h1>
                    <div className="flex w-full flex-wrap rounded-lg border border-gray-300 p-1">
                      {isDoctorAvailable(
                        value as Date,
                        sApp?.doctor_id.available_days as string[],
                      ) ? (
                        <div className="mx-auto my-auto">
                          <ErrorMessage text="You can not make appointment today" />
                        </div>
                      ) : loading && !error ? (
                        <CustomSpinner />
                      ) : availableTime ? (
                        availableTime.map((n) => (
                          <Badge
                            size="sm"
                            key={n}
                            onClick={() => setTimeForDate(n)}
                            color="gray"
                            className={`m-1 xxl:!text-xl ${
                              (newTime === convert12HourTo24Hour(n) ||
                                newTime === n) &&
                              "bg-blue-700 text-white hover:text-white"
                            } cursor-pointer  focus:!ring-blue-600`}
                          >
                            {parseInt(n.split(":")[0]) < 9
                              ? `${n} PM`
                              : `${n} AM`}
                          </Badge>
                        ))
                      ) : (
                        <p className="lg:!text-md mx-auto my-auto text-sm xxl:!text-xl">
                          There are no available appointments!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`${status === "failed" && "pb-8"} w-full lg:pb-0`}
              >
                {status === "failed" && <ErrorMessage text={message} />}
              </div>
              <div className="mt-auto w-full pb-12 md:pb-0">
                <CustomButton
                  onClick={handleEdit}
                  className="mx-auto w-full md:w-fit lg:!mx-0 lg:!ml-auto lg:!w-fit"
                >
                  <p className="xxl:text-lg">Save changes</p>
                </CustomButton>
              </div>
            </div>
          </Tabs.Item>
        ) : (
          ""
        )}
      </Tabs.Group>
    </>
  );
};

export default AppointmentOverviewEdit;
