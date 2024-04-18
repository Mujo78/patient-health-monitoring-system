import React, { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { useSelector } from "react-redux";
import { authUser, firstTime } from "../../../features/auth/authSlice";
import AppointmentReviewCalendar from "../../../components/Appointment/AppointmentReviewCalendar";
import DocDashboardInfo from "../../../components/Doctor/DocDashboardInfo";
import DocDashboard from "../../../components/Doctor/DocDashboard";
import {
  DocDashboardInfoType,
  DocDashboardType,
} from "../../../service/appointmentSideFunctions";

import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import toast from "react-hot-toast";
import NoDataAvailable from "../../../components/UI/NoDataAvailable";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import useAPI from "../../../hooks/useAPI";

const DoctorDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accessUser } = useSelector(authUser);

  useEffect(() => {
    if (accessUser && !accessUser.data.first) {
      dispatch(firstTime());
    }
  }, [dispatch, accessUser]);

  const {
    data: docDashInfo,
    loading,
    error,
  } = useAPI<DocDashboardType>("/appointment/doctor-dashboard");

  const {
    data: docDash,
    loading: loadingDoctorInfo,
    error: typeError,
  } = useAPI<DocDashboardInfoType>("/appointment/doctor-dashboard-info");

  useEffect(() => {
    if (error) {
      toast.error(error);
    } else {
      if (typeError) toast.error(typeError);
    }
  }, [error, typeError]);

  useSelectedPage("Dashboard");

  return (
    <>
      {loading || loadingDoctorInfo ? (
        <CustomSpinner size="xl" />
      ) : docDash || docDashInfo ? (
        <div className="duration-600 flex h-full w-full flex-col gap-5 p-3 transition-all">
          <div className="flex h-full w-full flex-col justify-between gap-4 xl:!flex-row">
            <div className="mb-8 flex h-full w-full flex-col justify-between sm:!mb-0 xl:!w-2/5">
              <DocDashboard docDashInfo={docDashInfo} />
            </div>
            <div className="flex h-full w-full xl:!w-1/3 xl:!px-2 xxl:!px-0">
              <div className="flex w-full flex-col justify-between gap-3 lg:!flex-row xl:!flex-col xl:!items-center">
                <DocDashboardInfo docDash={docDash} />
              </div>
            </div>
            <div className="flex h-fit w-full xl:!h-full xl:!w-1/4 ">
              <AppointmentReviewCalendar variant={2} />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-full w-full items-center justify-center">
          <ErrorMessage text={error} />
        </div>
      ) : (
        !error &&
        !loading &&
        !docDash && (
          <div className="flex h-full w-full items-center justify-center">
            <NoDataAvailable />
          </div>
        )
      )}
    </>
  );
};

export default DoctorDashboard;
