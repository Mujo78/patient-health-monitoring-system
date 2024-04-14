import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { useSelector } from "react-redux";
import { authUser, firstTime } from "../../../features/auth/authSlice";
import {
  PharmacyDashboardInfoType,
  PharmacyDashboardType,
  pharmacyDashboard,
  pharmacyDashboardInfo,
} from "../../../service/pharmacySideFunctions";
import PharmacyDashboardData from "../../../components/Pharmacy/PharmacyDashboardData";
import PharmacyDashboardMedicine from "../../../components/Pharmacy/PharmacyDashboardMedicine";
import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import toast from "react-hot-toast";
import NoDataAvailable from "../../../components/UI/NoDataAvailable";
import ErrorMessage from "../../../components/UI/ErrorMessage";

const PharmacyDashboard: React.FC = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);
  const [phDashboardData, setPhDashboardData] = useState<
    PharmacyDashboardType | undefined
  >();
  const [phDashboardMedicine, setPhDashboardMedicine] = useState<
    PharmacyDashboardInfoType | undefined
  >();

  const dispatch = useAppDispatch();
  const { accessUser } = useSelector(authUser);

  useSelectedPage("Dashboard");

  useEffect(() => {
    if (accessUser && !accessUser.data.first) {
      dispatch(firstTime());
    }
  }, [dispatch, accessUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await pharmacyDashboard();
        setPhDashboardData(response);
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
        setLoadingInfo(true);
        const response = await pharmacyDashboardInfo();
        setPhDashboardMedicine(response);
      } catch (err: any) {
        setError(err?.response?.data ?? err?.message);
        throw new Error(err);
      } finally {
        setLoadingInfo(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

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
        <div className="flex h-full w-full items-center justify-center">
          <NoDataAvailable />
        </div>
      )}
    </>
  );
};

export default PharmacyDashboard;
