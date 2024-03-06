import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { useSelector } from "react-redux";
import {
  appointment,
  cancelAppointment,
  getSelectedAppointment,
  resetSelectedAppointment,
} from "../../../features/appointment/appointmentSlice";
import { Button, Card } from "flowbite-react";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import CustomImg from "../../../components/UI/CustomImg";
import Footer from "../../../components/UI/Footer";
import AppointmentOverviewEdit from "./AppointmentOverviewEdit";
import { formatStartEnd } from "../../../service/appointmentSideFunctions";
import CustomSpinner from "../../../components/UI/CustomSpinner";

const Appointment: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    selectedAppointment: selected,
    status,
    message,
  } = useSelector(appointment);

  useEffect(() => {
    if (id) {
      dispatch(getSelectedAppointment(id));
    }

    return () => {
      dispatch(resetSelectedAppointment());
    };
  }, [id, dispatch]);

  const mailtoLink = `mailto:${selected?.doctor_id.user_id.email}`;
  const appDate = selected?.appointment_date.toString().slice(0, 10);

  const date = new Date(selected?.appointment_date as Date).getTime();
  const diff = date - new Date().getTime();
  const canCancel = (diff / (1000 * 60)).toFixed(0);

  const cancelAppointmentNow = () => {
    if (selected) {
      dispatch(cancelAppointment(selected._id)).then((action: any) => {
        if (typeof action.payload === "object") {
          navigate("../", { replace: true });
        }
      });
    }
  };

  return (
    <>
      {status === "loading" ? (
        <CustomSpinner size="xl" />
      ) : (
        <>
          {selected !== null ? (
            <div className="h-full flex flex-col p-3">
              <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
                <Card className="xl:w-full xxl:!w-fit h-auto xxl:p-12">
                  <div className="flex flex-col xl:!flex-row xl:justify-center gap-2 items-center p-0">
                    <CustomImg
                      url={selected.doctor_id.user_id.photo}
                      className="w-md h-auto"
                    />
                    <div>
                      <h1 className="font-bold text-xl text-blue-700">
                        {"Dr. " +
                          selected.doctor_id.first_name +
                          " " +
                          selected.doctor_id.last_name}
                      </h1>
                      <div className="text-xs xl:!text-md xxl:!text-xl text-gray-600">
                        <p>
                          {" "}
                          Age: {selected.doctor_id.age} |{" "}
                          {selected.doctor_id.speciality}{" "}
                        </p>
                        <p className="mt-2 mb">
                          <span className="text-gray-600"> Qualification:</span>{" "}
                          {selected.doctor_id.qualification}
                        </p>
                        <p className="">
                          <span className="text-gray-600"> Email: </span>
                          <Link
                            to={mailtoLink}
                            className="text-blue-500 underline hover:text-blue-700 cursor-pointer"
                          >
                            {selected.doctor_id.user_id.email}
                          </Link>
                        </p>
                      </div>
                      <p className="text-xs xl:!text-md xxl:!text-xl text-gray-500 mt-2 text-justify">
                        {selected.doctor_id.bio.split(".")[0]}
                      </p>
                    </div>
                  </div>
                </Card>
                <div className="h-full w-full flex flex-col gap-3">
                  <div className="flex flex-col gap-3 xxl:!text-2xl xl:!text-sm">
                    <p className="flex flex-col">
                      <span className="text-md font-semibold">Date&Time</span>
                      {appDate} ({formatStartEnd(selected.appointment_date)})
                    </p>
                    {selected.reason.length > 0 && (
                      <p className="flex flex-col">
                        <span className="text-md font-semibold">Reason</span>
                        {selected.reason}
                      </p>
                    )}
                  </div>

                  {Number(canCancel) > 60 && !selected.finished && (
                    <Button
                      onClick={cancelAppointmentNow}
                      className="md:mt-auto md:ml-auto w-full lg:!w-fit"
                      color="failure"
                    >
                      <p className="xxl:text-xl">Cancel Appointment</p>
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex justify-between flex-col h-full mt-6">
                <AppointmentOverviewEdit />
                <Footer variant={2} />
              </div>
              <div></div>
            </div>
          ) : (
            <div className="flex h-full justify-center items-center">
              <ErrorMessage size="md" text={message} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Appointment;
