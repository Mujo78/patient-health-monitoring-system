import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../app/hooks";
import {
  Appointment,
  appointment,
  getSelectedAppointment,
  resetSelectedAppointment,
} from "../../../features/appointment/appointmentSlice";
import { getMedicine } from "../../../features/medicine/medicineSlice";
import { toast } from "react-hot-toast";
import {
  formatStartEnd,
  getLatestAppointment,
} from "../../../service/appointmentSideFunctions";
import PatientEditCard from "./PatientEditCard";
import PatientModal from "./PatientModal";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { authUser } from "../../../features/auth/authSlice";
import AppointmentResultForm from "./AppointmentResultForm";
import { useParams } from "react-router-dom";
import CustomSpinner from "../../../components/UI/CustomSpinner";

const DocAppointment: React.FC = () => {
  const { accessUser } = useSelector(authUser);
  const [latestAppState, setLatestAppState] = useState<Appointment>();
  const [loading, setLoading] = useState<boolean>(false);
  const [more, setMore] = useState<boolean>(false);
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const {
    status,
    message,
    selectedAppointment: selected,
  } = useSelector(appointment);
  useEffect(() => {
    if (id) {
      dispatch(getSelectedAppointment(id));
    }

    return () => {
      dispatch(resetSelectedAppointment());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (!selected?.finished) {
      dispatch(getMedicine({}));
    }
  }, [dispatch, selected]);

  const appDate = selected?.appointment_date.toString().slice(0, 10);

  useEffect(() => {
    const postData = async () => {
      if (selected && accessUser) {
        try {
          setLoading(true);
          const latestApp = {
            appointment_id: selected._id,
            patient_id: selected?.patient_id._id,
          };
          const response = await getLatestAppointment(
            accessUser.token,
            accessUser.data._id,
            latestApp
          );
          setLatestAppState(response);
        } catch (error: unknown) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
      }
    };
    postData();
  }, [selected, accessUser]);

  useEffect(() => {
    if (status === "failed") {
      toast.error("Something went wrong, please try again later!");
    }
  }, [status]);

  return (
    <>
      {status === "loading" || (!selected && status !== "failed") ? (
        <CustomSpinner size="xl" />
      ) : selected ? (
        <>
          <div className="flex flex-col xl:!flex-row-reverse px-2 lg:!px-4 pt-2 justify-start items-center w-full h-full gap-3 xl:!gap-6">
            <div className="w-full xl:!w-1/3 h-full">
              <PatientEditCard setShowMore={setMore} />
            </div>
            <div className="w-full h-full flex flex-col items-start gap-4 lg:!gap-10">
              <div className="h-fit xl:!w-11/12 text-sm flex flex-col gap-2 mt-2 md:mt-0 w-full">
                <p className="flex flex-col xxl:!text-xl">
                  <span className="font-semibold xxl:!text-2xl">Date&Time</span>
                  {appDate} ({formatStartEnd(selected?.appointment_date)})
                </p>
                {selected?.reason && (
                  <div className="h-full xl:!h-48 xxl:!h-80 text-sm xxl:!text-xl flex flex-wrap text-md xxl:!w-11/12 w-full text-justify whitespace-normal">
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
          <PatientModal
            variant={1}
            loading={loading}
            latestAppState={latestAppState}
            setMore={setMore}
            more={more}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <ErrorMessage
            text={message || "Somethin went wrong, please try again later!"}
            className="text-md xxl:!text-2xl"
          />
        </div>
      )}
    </>
  );
};

export default DocAppointment;
