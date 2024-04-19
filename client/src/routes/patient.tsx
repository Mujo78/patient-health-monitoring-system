/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import PatientCheck from "../helpers/PatientCheck";
import { RouteObject } from "react-router-dom";

const PatientDashboard = lazy(
  () => import("../pages/patient/dashboard/PatientDashboard"),
);
const MyAppointments = lazy(
  () => import("../pages/patient/appointment/MyAppointments"),
);
const Appointment = lazy(
  () => import("../pages/patient/appointment/Appointment"),
);
const AppointmentLayout = lazy(
  () => import("../components/Layout/AppointmentLayout"),
);
const AppointmentDepartment = lazy(
  () => import("../pages/patient/appointment/AppointmentDepartment"),
);
const MakeAppointment = lazy(
  () => import("../pages/patient/appointment/MakeAppointment"),
);
const PatientProfile = lazy(
  () => import("../components/Patient/PatientProfileNav"),
);
const GeneralSettings = lazy(
  () => import("../pages/patient/profile/GeneralSettings"),
);
const PersonalInformation = lazy(
  () => import("../pages/patient/profile/PersonalInformation"),
);
import { Security, Notifications, Notification } from "./shared";
const MedicalStaff = lazy(() => import("../pages/patient/staff/MedicalStaff"));
const MedicalStaffDepartment = lazy(
  () => import("../pages/patient/staff/MedicalStaffDepartment"),
);
const Medicine = lazy(() => import("../pages/patient/medicine/Medicine"));

const patientRoutes: RouteObject = {
  loader: PatientCheck,
  children: [
    {
      path: "/patient/:id",
      element: <PatientDashboard />,
    },
    {
      path: "/my-appointments",
      element: <MyAppointments />,
      children: [
        {
          path: ":id",
          element: <Appointment />,
        },
      ],
    },
    {
      path: "/appointment",
      element: <AppointmentLayout />,
      children: [
        {
          path: "new",
          element: <AppointmentDepartment />,
          children: [
            {
              path: ":doctorId",
              element: <MakeAppointment />,
            },
          ],
        },
      ],
    },
    {
      path: "/profile/p/:id",
      element: <PatientProfile />,
      children: [
        {
          path: "",
          element: <GeneralSettings />,
        },
        {
          path: "personal-info",
          element: <PersonalInformation />,
        },
        {
          path: "security",
          element: <Security />,
        },
      ],
    },
    {
      path: "/staff",
      element: <MedicalStaff />,
      children: [
        {
          path: ":departmentName",
          element: <MedicalStaffDepartment />,
        },
      ],
    },
    {
      path: "/medicine-overview",
      element: <Medicine />,
    },
    {
      path: "/notifications",
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

export default patientRoutes;
