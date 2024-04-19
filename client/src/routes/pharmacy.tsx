/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import PharmacyCheck from "../helpers/PharmacyCheck";

const PharmacyDashboard = lazy(
  () => import("../pages/pharmacy/dashboard/PharmacyDashboard"),
);
const MedicineOverview = lazy(
  () => import("../pages/pharmacy/medicine/MedicineOverview"),
);
const AddMedicine = lazy(
  () => import("../pages/pharmacy/medicine/AddMedicine"),
);
const PharmacyProfile = lazy(
  () => import("../components/Pharmacy/PharmacyProfileNav"),
);
const InfoPharmacy = lazy(
  () => import("../pages/pharmacy/profile/InfoPharmacy"),
);
import { Security, Notifications, Notification } from "./shared";

const pharmacyRoutes: RouteObject = {
  loader: PharmacyCheck,
  children: [
    {
      path: "/pharmacy/:id",
      element: <PharmacyDashboard />,
    },
    {
      path: "/medicine",
      element: <MedicineOverview />,
    },
    {
      path: "/add-medicine",
      element: <AddMedicine />,
    },
    {
      path: "/profile/ph/:id",
      element: <PharmacyProfile />,
      children: [
        {
          path: "",
          element: <InfoPharmacy />,
        },
        {
          path: "page-security",
          element: <Security />,
        },
      ],
    },
    {
      path: "/pharmacy-notifications",
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

export default pharmacyRoutes;
