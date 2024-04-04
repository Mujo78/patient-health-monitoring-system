import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { shallowEqual, useSelector } from "react-redux";
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
import AppointmentOverviewEdit from "../../../components/Appointment/AppointmentOverviewEdit";
import {
  canCancelOrEdit,
  formatStartEnd,
} from "../../../service/appointmentSideFunctions";
import Header from "../../../components/UI/Header";
import moment from "moment";
import toast from "react-hot-toast";
import { isFulfilled } from "@reduxjs/toolkit";

const Appointment: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAppointment: selected, message } = useSelector(
    appointment,
    shallowEqual,
  );

  useEffect(() => {
    if (id) {
      dispatch(getSelectedAppointment(id));
    }

    return () => {
      dispatch(resetSelectedAppointment());
    };
  }, [id, dispatch]);

  const mailtoLink = `mailto:${selected?.doctor_id.user_id.email}`;
  const appDate = moment(selected?.appointment_date).format("DD/MM/YYYY");

  const cancelAppointmentNow = () => {
    if (selected) {
      dispatch(cancelAppointment(selected._id)).then((action: any) => {
        if (isFulfilled(action)) {
          toast.success("Successfully deleted appointment!");
          navigate("../", { replace: true });
        } else {
          toast.error(action.payload);
        }
      });
    }
  };

  return (
    <>
      {selected !== null ? (
        <div className="flex h-full flex-col p-3">
          <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
            <Card className="h-auto xl:w-full xxl:!w-fit xxl:p-12">
              <div className="flex flex-col items-center gap-2 p-0 xl:!flex-row xl:justify-center">
                <CustomImg
                  url={selected.doctor_id.user_id.photo}
                  className="h-auto w-28 xxl:!w-48"
                />
                <div>
                  <Header
                    text={
                      "Dr. " +
                      selected.doctor_id.first_name +
                      " " +
                      selected.doctor_id.last_name
                    }
                    size={1}
                    bold
                    position="start"
                    className="!text-blue-700"
                  />
                  <div className="xl:!text-md text-xs text-gray-600 xxl:!text-xl">
                    <p>
                      Age: {selected.doctor_id.age} |{" "}
                      {selected.doctor_id.speciality}{" "}
                    </p>
                    <p className="mb mt-2">
                      Qualification: {selected.doctor_id.qualification}
                    </p>
                    <p>
                      Email:{" "}
                      <Link
                        to={mailtoLink}
                        className="cursor-pointer text-blue-500 underline hover:text-blue-700"
                      >
                        {selected.doctor_id.user_id.email}
                      </Link>
                    </p>
                  </div>
                  <p className="xl:!text-md mt-2 line-clamp-2 text-justify text-xs text-gray-500 xxl:!text-xl">
                    {selected.doctor_id.bio}
                  </p>
                </div>
              </div>
            </Card>
            <div className="flex h-full w-full flex-col gap-3">
              <div className="flex flex-col gap-3 xl:!text-sm xxl:!text-2xl">
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

              {canCancelOrEdit(selected.appointment_date) &&
                !selected.finished && (
                  <Button
                    onClick={cancelAppointmentNow}
                    className="w-full md:ml-auto md:mt-auto lg:!w-fit"
                    color="failure"
                  >
                    <p className="xxl:text-lg">Cancel Appointment</p>
                  </Button>
                )}
            </div>
          </div>
          <div className="mt-6 flex h-full flex-col justify-between">
            <AppointmentOverviewEdit />
            <Footer variant={2} />
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <ErrorMessage text={message} />
        </div>
      )}
    </>
  );
};

export default Appointment;
