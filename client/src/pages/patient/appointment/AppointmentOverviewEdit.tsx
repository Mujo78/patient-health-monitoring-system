import React, { useEffect, useState } from "react";
import { Tabs, ListGroup, Textarea, Badge } from "flowbite-react";
import {
  appointment,
  editAppointment,
  getAppointmentsForADay,
  reset,
  resetAppointmentDay,
} from "../../../features/appointment/appointmentSlice";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { useSelector } from "react-redux";
import {
  HiOutlinePencilSquare,
  HiOutlineDocumentDuplicate,
} from "react-icons/hi2";
import CalendarAppointment from "../../../components/CalendarAppointment";
import { Value } from "./MakeAppointment";
import { useAppDispatch } from "../../../app/hooks";
import {
  availableTimeForApp,
  convert12HourTo24Hour,
  isDSTFunc,
  isDoctorAvailable,
} from "../../../service/appointmentSideFunctions";
import CustomButton from "../../../components/UI/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import moment from "moment";
import { Medicine } from "../../../features/medicine/medicineSlice";
import MedicineModal from "../../../components/MedicineModal";
import { authUser } from "../../../features/auth/authSlice";

const workTime = [
  "9:00",
  "9:20",
  "9:40",
  "10:00",
  "10:20",
  "10:40",
  "11:00",
  "11:20",
  "11:40",
  "12:00",
  "1:00",
  "1:20",
  "1:40",
  "2:00",
  "2:20",
  "2:40",
  "3:00",
  "3:20",
  "3:40",
  "4:00",
];

const AppointmentOverviewEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    selectedAppointment: sApp,
    selectedDayAppointments,
    status,
    message,
  } = useSelector(appointment);
  const { accessUser } = useSelector(authUser);
  const d = sApp?.appointment_date;
  const r = sApp?.reason === "" ? "" : (sApp?.reason as string);
  const t = convert12HourTo24Hour(
    moment
      .utc(sApp?.appointment_date)
      .add(isDSTFunc(), "hours")
      .toString()
      .slice(15, 21) as string
  );
  const [time, setTime] = useState<string[] | null>();
  const [value, setValue] = useState<Value>(
    new Date(sApp?.appointment_date as Date)
  );
  const [newTime, setNewTime] = useState<string>(t);
  const [reason, setReason] = useState<string>(r);
  const [medicine, setMedicine] = useState<Medicine>();
  const [show, setShow] = useState<boolean>(false);
  let active;

  useEffect(() => {
    async function fetchData() {
      try {
        if (accessUser && sApp?.doctor_id._id) {
          const response = await availableTimeForApp(
            value as Date,
            sApp?.doctor_id._id,
            accessUser?.token
          );
          setTime(response);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (value) {
      fetchData();
    }
  }, [value, accessUser, sApp?.doctor_id._id]);

  const dispatch = useAppDispatch();

  const handleGetAppForADay = (value: Date) => {
    dispatch(getAppointmentsForADay(value));
    dispatch(resetAppointmentDay());
  };

  const date = new Date(d as Date).getTime();
  const diff = date - new Date().getTime();
  const canEdit = (diff / (1000 * 60)).toFixed(0);

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

  const mergedArrayForTime = time && appTime.concat(time);

  const availableTime =
    mergedArrayForTime &&
    workTime.filter((m) => !mergedArrayForTime.includes(m));
  const setTimeForDate = (time: string) => {
    setNewTime(time);
  };

  const handleEdit = () => {
    const time = convert12HourTo24Hour(newTime);
    const index = value
      ?.toLocaleString()
      .indexOf(new Date().getFullYear().toString());
    const date = value
      ?.toLocaleString()
      .slice(0, Number(index) + 4)
      .replace(/\s+/g, "")
      .replace(/\./g, "-");

    const newAppDate =
      date?.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, (_, p1, p2, p3) => {
        const month = p1.padStart(2, "0");
        const day = p2.padStart(2, "0");
        return `${p3}-${month}-${day}`;
      }) +
      "T" +
      time +
      ":00";

    const editObjectData = {
      reason,
      appointment_date: new Date(newAppDate.replace(/\./g, "-").trim()),
    };

    if (
      reason !== sApp?.reason ||
      new Date(newAppDate.replace(/\./g, "-").trim()).getTime() !==
        new Date(sApp.appointment_date).getTime()
    ) {
      if (id) {
        dispatch(editAppointment({ id, editObjectData })).then((action) => {
          if (typeof action.payload === "object") {
            toast.success("Successfully edited appointment.");
            navigate("../");
            dispatch(reset());
          }
        });
      }
    }
    active = 1;
  };

  const handleGet = (tab: number) => {
    if (tab === 1 && status !== "failed") {
      dispatch(getAppointmentsForADay(value as Date));
      dispatch(resetAppointmentDay());
    }
  };

  const handleShowMedicine = (med: Medicine) => {
    setMedicine(med);
    setShow(true);
  };
  const onClose = () => {
    setShow(false);
  };

  const url = medicine?.photo.startsWith(medicine.name)
    ? `http://localhost:3001/uploads/${medicine.photo}`
    : medicine?.photo;

  return (
    <>
      <Tabs.Group
        aria-label="Default tabs"
        style="default"
        onActiveTabChange={(tab) => handleGet(tab)}
      >
        <Tabs.Item active title="Overview" icon={HiOutlineDocumentDuplicate}>
          {sApp?.finished ? (
            <div className="flex divide-x divide-gray-300 h-[280px] w-full justify-between">
              <div className="h-full w-1/4 flex flex-col flex-grow">
                <h1 className="text-center">Diagnose</h1>
                <hr className="border-b border-gray-300" />
                <p className="text-xs text-gray-500 p-4 text-justify">
                  {sApp?.diagnose}
                </p>
              </div>
              <div className="h-full w-1/4 flex flex-grow flex-col">
                <h1 className="text-center">Therapy</h1>
                <hr className="border-b border-gray-300" />
                <ListGroup>
                  {sApp?.therapy?.length > 0 &&
                    sApp.therapy.map((n) => (
                      <ListGroup.Item
                        key={n._id}
                        onClick={() => handleShowMedicine(n)}
                      >
                        <p>
                          {n.name} - {n.strength}
                        </p>
                      </ListGroup.Item>
                    ))}
                </ListGroup>
              </div>
              <div className="h-full w-1/4 flex flex-grow flex-col">
                <h1 className="text-center">Other medicine</h1>
                <hr className="border-b border-gray-300" />
                <p className="text-xs p-4 text-gray-500 text-justify">
                  {sApp?.other_medicine}
                </p>
              </div>
              <div className="h-full w-1/4 flex flex-grow flex-col">
                <h1 className="text-center">Description</h1>
                <hr className="border-b border-gray-300" />
                <p className="text-xs p-4 text-gray-500 text-justify">
                  {sApp?.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center flex-col items-center h-[300px]">
              <ErrorMessage
                size="md"
                text={`Your appointment date: ${sApp?.appointment_date
                  .toString()
                  .slice(0, 10)} `}
              />
              <p className="text-xs text-gray-400 mt-2">
                You will be able to see overview after doctor make it finished
              </p>
            </div>
          )}
        </Tabs.Item>
        {Number(canEdit) > 60 && !sApp?.finished ? (
          <Tabs.Item
            title="Edit"
            className="flex"
            active={active === 1}
            icon={HiOutlinePencilSquare}
          >
            <div className="flex w-full flex-col">
              <div className="flex w-full justify-between">
                <div className="w-1/5 ml-1 flex flex-col">
                  <h1 className="mb-2 font-semibold text-sm">Reason</h1>
                  <Textarea
                    placeholder="Reason"
                    name="reason"
                    className="text-sm"
                    onChange={(e) => setReason(e.currentTarget.value)}
                    value={reason}
                    rows={10}
                  />
                </div>
                <div className="flex justify-between w-3/4">
                  <CalendarAppointment
                    variant={2}
                    value={value}
                    setValue={setValue}
                    handleGetAppForADay={handleGetAppForADay}
                    docAvailable={sApp?.doctor_id.available_days as string[]}
                  />
                  <div className="w-2/5 flex flex-col my-auto mr-3 justify-around h-full">
                    <h1 className="font-semibold text-md">
                      Date:{" "}
                      {value
                        ?.toLocaleString()
                        .slice(
                          0,
                          value
                            .toLocaleString()
                            .indexOf(
                              new Date(value.toString())
                                .getFullYear()
                                .toString()
                            ) + 4
                        )}{" "}
                      ({availableTime && availableTime.length})
                    </h1>
                    <div className="flex flex-wrap w-full p-1 border-gray-300 border rounded-lg">
                      {isDoctorAvailable(
                        value as Date,
                        sApp?.doctor_id.available_days as string[]
                      ) ? (
                        <div className="my-auto mx-auto">
                          <ErrorMessage
                            text="You can not make appointment today"
                            size="sm"
                          />
                        </div>
                      ) : availableTime && availableTime.length > 0 ? (
                        availableTime.map((n) => (
                          <Badge
                            size="sm"
                            key={n}
                            onClick={() => setTimeForDate(n)}
                            color="gray"
                            className={`m-1 ${
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
                        <p className="text-sm mx-auto my-auto">
                          There are no more available appointments for this day
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto w-1/6">
                    <CustomButton onClick={handleEdit}>
                      Save changes
                    </CustomButton>
                  </div>
                </div>
              </div>
              <div className="mt-2 h-3 w-full">
                {status === "failed" && <ErrorMessage text={message} />}
              </div>
            </div>
          </Tabs.Item>
        ) : (
          ""
        )}
      </Tabs.Group>
      {medicine && url && (
        <MedicineModal
          show={show}
          medicine={medicine}
          url={url}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default AppointmentOverviewEdit;
