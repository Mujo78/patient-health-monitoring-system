import React, { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { useSelector } from "react-redux";
import { authUser, firstTime } from "../../../features/auth/authSlice";
import {
  PharmacyDashboardInfoType,
  PharmacyDashboardType,
} from "../../../service/pharmacySideFunctions";
import PharmacyDashboardData from "../../../components/Pharmacy/PharmacyDashboardData";
import PharmacyDashboardMedicine from "../../../components/Pharmacy/PharmacyDashboardMedicine";
import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import toast from "react-hot-toast";
import NoDataAvailable from "../../../components/UI/NoDataAvailable";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import useAPI from "../../../hooks/useAPI";

const PharmacyDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accessUser } = useSelector(authUser);

  useSelectedPage("Dashboard");

  useEffect(() => {
    if (accessUser && !accessUser.data.first) {
      dispatch(firstTime());
    }
  }, [dispatch, accessUser]);

  const {
    data: phDashboardData,
    loading,
    error,
  } = useAPI<PharmacyDashboardType>("/pharmacy/dashboard");

  const {
    data: phDashboardMedicine,
    loading: loadingInfo,
    error: errorInfo,
  } = useAPI<PharmacyDashboardInfoType>("/pharmacy/dashboard-info");

  useEffect(() => {
    if (error) {
      toast.error(error);
    } else {
      if (errorInfo) toast.error(errorInfo);
    }
  }, [error, errorInfo]);

  return (
    <>
      {loading || loadingInfo ? (
        <CustomSpinner size="xl" />
      ) : phDashboardData || phDashboardMedicine ? (
        <div className="h-full p-3">
          <div className="flex h-full w-full flex-col gap-5">
            <div className="flex h-fit w-full flex-wrap items-center gap-3 transition-all duration-300 lg:!gap-6 xl:!h-2/4 xl:!gap-12">
              <PharmacyDashboardData data={phDashboardData} />
            </div>
            <div className="flex h-fit w-full flex-wrap items-center gap-5 lg:!h-full xl:!h-2/4">
              <PharmacyDashboardMedicine data={phDashboardMedicine} />
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
        !phDashboardData && (
          <div className="flex h-full w-full items-center justify-center">
            <NoDataAvailable />
          </div>
        )
      )}
    </>
  );
};

export default PharmacyDashboard;
