import React, { useEffect, useMemo, useState } from "react";
import { Tabs, Textarea } from "flowbite-react";
import {
  appointment,
  editAppointment,
  getAppointmentsForADay,
  reset,
  resetAppointmentDay,
} from "../../features/appointment/appointmentSlice";
import ErrorMessage from "../UI/ErrorMessage";
import { shallowEqual, useSelector } from "react-redux";
import {
  HiOutlinePencilSquare,
  HiOutlineDocumentDuplicate,
} from "react-icons/hi2";
import CalendarAppointment from "./CalendarAppointment";
import { useAppDispatch } from "../../app/hooks";
import {
  Value,
  availableTimeForApp,
  canCancelOrEdit,
  convert12HourTo24Hour,
  getAvailableTime,
  getCorrectDate,
  isDSTFunc,
  isDoctorAvailable,
} from "../../service/appointmentSideFunctions";
import CustomButton from "../UI/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import moment, { MomentInput } from "moment";
import AppointmentOverview from "./AppointmentOverview";
import CustomSpinner from "../UI/CustomSpinner";
import TimeButton from "./TimeButton";
import { isFulfilled } from "@reduxjs/toolkit";

const AppointmentOverviewEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    selectedAppointment: sApp,
    selectedDayAppointments,
    status,
    message,
  } = useSelector(appointment, shallowEqual);
  const dispatch = useAppDispatch();

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
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (sApp?.doctor_id._id && value) {
          setLoading(true);

          const response = await availableTimeForApp(
            value as Date,
            sApp?.doctor_id._id,
          );

          setTime(response);
        }
      } catch (error: any) {
        setError(true);
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    }

    if (active === 1) {
      fetchData();
    }
  }, [value, active, sApp?.doctor_id._id]);

  const handleGetAppForADay = (value: Date) => {
    dispatch(getAppointmentsForADay(value));
    dispatch(resetAppointmentDay());
  };

  const availableTime = useMemo(() => {
    if (active === 1) {
      return getAvailableTime(time, selectedDayAppointments);
    }
  }, [selectedDayAppointments, time, active]);

  const handleEdit = () => {
    const editObjectData = {
      reason,
      appointment_date: getCorrectDate(value, newTime),
    };

    if (
      reason !== sApp?.reason ||
      editObjectData.appointment_date.getTime() !==
        new Date(sApp.appointment_date).getTime()
    ) {
      if (id) {
        dispatch(editAppointment({ id, editObjectData })).then((action) => {
          if (isFulfilled(action)) {
            toast.success("Successfully edited appointment.");
            navigate("../");
            dispatch(reset());
          } else {
            setError(true);
          }
        });
      }
    }
  };

  const handleGet = (tab: number) => {
    setActive(tab);
    if (tab === 1) {
      dispatch(getAppointmentsForADay(value as Date));
      dispatch(resetAppointmentDay());
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
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
                    onChange={onChange}
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
                      ({availableTime && availableTime.length})
                    </h1>
                    <div className="flex w-full flex-wrap rounded-lg border border-gray-300 p-1">
                      {isDoctorAvailable(
                        value as Date,
                        sApp?.doctor_id.available_days as string[],
                      ) ? (
                        <div className="mx-auto my-auto"></div>
                      ) : loading && !error ? (
                        <div className="w-full p-16">
                          <CustomSpinner />
                        </div>
                      ) : availableTime ? (
                        availableTime.map((n) => (
                          <TimeButton
                            key={n}
                            setNewTime={setNewTime}
                            newTime={newTime}
                            time={n}
                          />
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
