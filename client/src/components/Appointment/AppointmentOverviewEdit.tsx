import React, { useEffect, useState } from "react";
import { Tabs, Textarea } from "flowbite-react";
import {
  appointment,
  editAppointment,
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
  getOtherAppsForDay,
  canCancelOrEdit,
  convert12HourTo24Hour,
  getCorrectDate,
  isDSTFunc,
  isDoctorAvailable,
  tabItemTheme,
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

  const isFinished = sApp?.finished ? -1 : 0;
  const [newTime, setNewTime] = useState<string>(formatedAppointmentTime);
  const [reason, setReason] = useState<string>(appointmentReason);
  const [active] = useState<number>(isFinished);
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchData() {
      try {
        if (sApp?.doctor_id._id && value) {
          setLoading(true);

          const response = await getOtherAppsForDay(
            value as Date,
            sApp?.doctor_id._id,
          );

          setTime(response);
        }
      } catch (error: any) {
        setError(error?.response?.data ?? error?.message);
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    }

    if (active === 0) {
      fetchData();
    }
  }, [value, active, sApp?.doctor_id._id]);

  const handleEdit = () => {
    const editObjectData = {
      reason,
      appointment_date: getCorrectDate(value, newTime),
    };

    if (
      reason !== sApp?.reason ||
      editObjectData?.appointment_date?.getTime() !==
        new Date(sApp.appointment_date).getTime()
    ) {
      if (id && time?.length !== 0) {
        dispatch(editAppointment({ id, editObjectData })).then((action) => {
          if (isFulfilled(action)) {
            toast.success("Successfully edited appointment.");
            navigate("../");
          }
        });
      }
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
  };

  return (
    <>
      <Tabs.Group
        aria-label="Default tabs"
        theme={tabItemTheme}
        style="default"
        tabIndex={active}
      >
        {sApp?.finished ||
        (sApp?.finished === false &&
          !canCancelOrEdit(sApp?.appointment_date)) ? (
          <Tabs.Item
            active={active === -1}
            title="Overview"
            icon={HiOutlineDocumentDuplicate}
          >
            <AppointmentOverview />
          </Tabs.Item>
        ) : (
          sApp?.appointment_date &&
          canCancelOrEdit(sApp?.appointment_date) && (
            <Tabs.Item
              active={active === 0}
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
                      className="text-sm focus:border-blue-700 focus:ring-blue-700 xxl:!text-xl"
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
                      docAvailable={sApp?.doctor_id.available_days as string[]}
                    />
                    <div className="my-auto flex h-full w-full flex-col justify-around lg:w-2/5 xxl:!text-xl">
                      <h1 className="text-md font-semibold">
                        Date:
                        {" " +
                          moment(value as MomentInput).format(
                            "DD/MM/YYYY",
                          )}{" "}
                        ({time && time.length})
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
                          <p className="lg:!text-md mx-auto my-auto p-16 text-sm xxl:!text-xl">
                            There are no available appointments!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`${(status === "failed" || error) && "pb-8"} w-full lg:pb-0`}
                >
                  {(status === "failed" || error) && (
                    <ErrorMessage text={message || error} />
                  )}
                </div>
                <div className="mt-auto w-full pb-12 md:pb-0">
                  <CustomButton
                    disabled={time?.length === 0}
                    onClick={handleEdit}
                    className="mx-auto w-full md:w-fit lg:!mx-0 lg:!ml-auto lg:!w-fit"
                  >
                    <p className="xxl:text-lg">Save changes</p>
                  </CustomButton>
                </div>
              </div>
            </Tabs.Item>
          )
        )}
      </Tabs.Group>
    </>
  );
};

export default AppointmentOverviewEdit;
