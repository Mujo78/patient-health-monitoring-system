import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { authUser, firstTime, logout } from "../../features/auth/authSlice";
import PatientSidebar from "../Patient/PatientSidebar";
import DoctorSidebar from "../Doctor/DoctorSidebar";
import PharmacySidebar from "../Pharmacy/PharmacySidebar";
import CustomNavbar from "../UI/CustomNavbar";
import { useAppDispatch } from "../../app/hooks";
import PatientTabNav from "../Patient/PatientTabNav";
import DoctorTabNav from "../Doctor/DoctorTabNav";
import PharmacyTabNav from "../Pharmacy/PharmacyTabNav";

const HomeLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessUser } = useSelector(authUser, shallowEqual);

  useEffect(() => {
    if (!accessUser?.data.active && !accessUser?.data.isVerified) {
      dispatch(logout()).then(() => {
        navigate("/", { replace: true });
      });
    }
  }, [accessUser, navigate, dispatch]);

  useEffect(() => {
    if (accessUser && !accessUser.data.first) {
      dispatch(firstTime());
    }
  }, [dispatch, accessUser]);

  return (
    <div className="flex w-full">
      <div className=" flex w-full">
        {accessUser?.data.role === "PATIENT" && (
          <>
            <PatientSidebar />
            <PatientTabNav />
          </>
        )}
        {accessUser?.data.role === "DOCTOR" && (
          <>
            <DoctorSidebar />
            <DoctorTabNav />
          </>
        )}
        {accessUser?.data.role === "PHARMACY" && (
          <>
            <PharmacySidebar />
            <PharmacyTabNav />
          </>
        )}
        <div className="flex h-screen w-full flex-col">
          <CustomNavbar />
          <div className="flex-grow overflow-y-auto" id="content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
