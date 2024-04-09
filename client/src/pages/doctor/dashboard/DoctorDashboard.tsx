import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { useSelector } from "react-redux";
import { authUser, firstTime } from "../../../features/auth/authSlice";
import AppointmentReviewCalendar from "../../../components/Appointment/AppointmentReviewCalendar";
import DocDashboardInfo from "../../../components/Doctor/DocDashboardInfo";
import DocDashboard from "../../../components/Doctor/DocDashboard";
import {
  DocDashboardInfoType,
  DocDashboardType,
  doctorDashboard,
  doctorDashboardInfo,
} from "../../../service/appointmentSideFunctions";

import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import toast from "react-hot-toast";
import NoDataAvailable from "../../../components/UI/NoDataAvailable";

const DoctorDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accessUser } = useSelector(authUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDoctorInfo, setLoadingDoctorInfo] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [docDashInfo, setDocDashInfo] = useState<
    DocDashboardType | undefined
  >();
  const [docDash, setDocDash] = useState<DocDashboardInfoType | undefined>();

  useEffect(() => {
    if (accessUser && !accessUser.data.first) {
      dispatch(firstTime());
    }
  }, [dispatch, accessUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await doctorDashboard();
        setDocDashInfo(response);
      } catch (err: any) {
        setError(err?.response?.data ?? err?.message);
        throw new Error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingDoctorInfo(true);
        const response = await doctorDashboardInfo();
        setDocDash(response);
      } catch (err: any) {
        setError(err?.response?.data ?? err?.message);
        throw new Error(err);
      } finally {
        setLoadingDoctorInfo(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

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
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <NoDataAvailable />
        </div>
      )}
    </>
  );
};

export default DoctorDashboard;
