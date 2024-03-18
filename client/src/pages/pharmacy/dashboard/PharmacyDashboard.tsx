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
import PDashboard from "../../../components/Pharmacy/PDashboard";
import PDashboardInfo from "../../../components/Pharmacy/PDashboardInfo";
import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";

const PharmacyDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { accessUser } = useSelector(authUser);

  const [loading, setLoading] = useState<boolean>(false);
  const [phDash, setPhDash] = useState<PharmacyDashboardType | undefined>();
  const [phDashInfo, setPhDashInfo] = useState<
    PharmacyDashboardInfoType | undefined
  >();

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
        if (accessUser) {
          const response = await pharmacyDashboard(accessUser.token);
          setPhDash(response);
        }
      } catch (err: any) {
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
          const response = await pharmacyDashboardInfo(accessUser.token);
          setPhDashInfo(response);
        }
      } catch (err: any) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessUser]);

  return (
    <>
      {loading ? (
        <CustomSpinner size="lg" />
      ) : (
        <div className="h-full p-3">
          <div className="flex w-full flex-col gap-5 h-full">
            <div className="w-full h-fit gap-3 flex flex-wrap items-center lg:!gap-6 xl:!gap-12 xl:!h-2/4 transition-all duration-300">
              {phDash && <PDashboard data={phDash} />}
            </div>
            <div className="flex h-fit lg:!h-full items-center flex-wrap w-full gap-5 xl:!h-2/4">
              {phDashInfo && <PDashboardInfo data={phDashInfo} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PharmacyDashboard;
