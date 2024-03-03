import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authUser, logout } from "../../features/auth/authSlice";
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
  const { accessUser } = useSelector(authUser);

  useEffect(() => {
    if (!accessUser?.data.active && !accessUser?.data.isVerified) {
      dispatch(logout()).then(() => {
        navigate("/", { replace: true });
      });
    }
  }, [accessUser, navigate, dispatch]);

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
        <div className="flex flex-col w-full h-screen">
          <CustomNavbar />
          <div className="overflow-y-auto flex-grow" id="content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
