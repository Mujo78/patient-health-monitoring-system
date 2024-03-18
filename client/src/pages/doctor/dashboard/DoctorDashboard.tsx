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

const DoctorDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accessUser } = useSelector(authUser);
  const [loading, setLoading] = useState<boolean>(false);
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
        if (accessUser) {
          const response = await doctorDashboard(accessUser.token);
          setDocDashInfo(response);
        }
      } catch (err) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (accessUser) {
          const response = await doctorDashboardInfo(accessUser.token);
          setDocDash(response);
        }
      } catch (err) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accessUser]);

  useSelectedPage("Dashboard");

  return (
    <>
      {loading ? (
        <CustomSpinner size="xl" />
      ) : (
        <div className="h-full w-full p-3 gap-5 flex flex-col transition-all duration-600">
          <div className="w-full flex gap-4 flex-col xl:!flex-row justify-between h-full">
            <div className="w-full xl:!w-2/5 h-full flex justify-between flex-col mb-8 sm:!mb-0">
              {docDashInfo && <DocDashboard docDashInfo={docDashInfo} />}
            </div>
            <div className="w-full xl:!w-1/3 xl:!px-2 xxl:!px-0 h-full flex">
              <div className="flex flex-col lg:!flex-row xl:!flex-col w-full gap-3 justify-between xl:!items-center">
                {docDash && <DocDashboardInfo docDash={docDash} />}
              </div>
            </div>
            <div className="h-fit xl:!h-full w-full xl:!w-1/4 flex ">
              <AppointmentReviewCalendar variant={2} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDashboard;
