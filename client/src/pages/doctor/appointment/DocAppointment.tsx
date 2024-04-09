import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/hooks";
import {
  appointment,
  getSelectedAppointment,
  resetSelectedAppointment,
} from "../../../features/appointment/appointmentSlice";
import { toast } from "react-hot-toast";
import {
  formatDate,
  formatStartEnd,
} from "../../../service/appointmentSideFunctions";
import PatientAppointmentCard from "../../../components/Patient/PatientAppointmentCard";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import AppointmentResultForm from "./AppointmentResultForm";
import { useParams } from "react-router-dom";
import CustomSpinner from "../../../components/UI/CustomSpinner";

const DocAppointment: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const {
    status,
    message,
    selectedAppointment: selected,
  } = useSelector(appointment, shallowEqual);

  useEffect(() => {
    if (id) {
      dispatch(getSelectedAppointment(id));
    }

    return () => {
      dispatch(resetSelectedAppointment());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (status === "failed") {
      toast.error(
        "Something went wrong while getting data, please try again later!",
      );
    }
  }, [status]);

  return (
    <>
      {status === "loading" ? (
        <CustomSpinner size="xl" />
      ) : selected !== null ? (
        <div className="flex h-full w-full flex-col items-center justify-start gap-3 px-2 pt-2 lg:!px-4 xl:!flex-row-reverse xl:!gap-6">
          <div className="h-full w-full xl:!w-1/3">
            {selected && <PatientAppointmentCard />}
          </div>
          <div className="flex h-full w-full flex-col items-start gap-4 lg:!gap-10">
            <div className="mt-2 flex h-fit w-full flex-col gap-2 text-sm md:mt-0 xl:!w-11/12">
              <p className="flex flex-col xxl:!text-xl">
                <span className="font-semibold xxl:!text-2xl">Date&Time</span>
                {formatDate(selected.appointment_date)} (
                {formatStartEnd(selected?.appointment_date)})
              </p>
              {selected?.reason && (
                <div className="text-md flex h-full w-full flex-wrap whitespace-normal text-justify text-sm xl:!h-48 xxl:!h-80 xxl:!w-11/12 xxl:!text-xl">
                  <p className="font-semibold xxl:!text-2xl">Reason</p>
                  <div className="h-full w-full overflow-y-auto">
                    {selected?.reason}
                  </div>
                </div>
              )}
            </div>
            <AppointmentResultForm />
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

export default DocAppointment;
