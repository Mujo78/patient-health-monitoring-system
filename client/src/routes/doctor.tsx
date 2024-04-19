/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import DoctorCheck from "../helpers/DoctorCheck";

const DoctorDashboard = lazy(
  () => import("../pages/doctor/dashboard/DoctorDashboard"),
);
const DoctorAppointments = lazy(
  () => import("../pages/doctor/appointment/DoctorAppointments"),
);
const DocAppointment = lazy(
  () => import("../pages/doctor/appointment/DocAppointment"),
);
const MyPatients = lazy(() => import("../pages/doctor/patient/MyPatients"));
const Patient = lazy(() => import("../pages/doctor/patient/Patient"));
const DoctorProfile = lazy(
  () => import("../components/Doctor/DoctorProfileNav"),
);
const PersonalInfoDoc = lazy(
  () => import("../pages/doctor/profile/PersonalInfoDoc"),
);
import { Security, Notifications, Notification } from "./shared";
const MyDepartment = lazy(
  () => import("../pages/doctor/department/MyDepartment"),
);

const doctorRoutes: RouteObject = {
  loader: DoctorCheck,
  children: [
    {
      path: "/doctor/:id",
      element: <DoctorDashboard />,
    },
    {
      path: "/appointments",
      element: <DoctorAppointments />,
      children: [
        {
          path: ":id",
          element: <DocAppointment />,
        },
      ],
    },
    {
      path: "/my-patients",
      element: <MyPatients />,
      children: [
        {
          path: ":id",
          element: <Patient />,
        },
      ],
    },
    {
      path: "/profile/d/:id",
      element: <DoctorProfile />,
      children: [
        {
          path: "",
          element: <PersonalInfoDoc />,
        },
        {
          path: "security-page",
          element: <Security />,
        },
      ],
    },
    {
      path: "/my-department",
      element: <MyDepartment />,
    },
    {
      path: "/doctor-notifications",
      element: <Notifications />,
      children: [
        {
          path: ":id",
          element: <Notification />,
        },
      ],
    },
  ],
};

export default doctorRoutes;
