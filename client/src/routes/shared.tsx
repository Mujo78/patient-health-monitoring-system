import { lazy } from "react";

export const Security = lazy(() => import("../pages/Security"));
export const Notifications = lazy(
  () => import("../pages/notification/Notifications"),
);
export const Notification = lazy(
  () => import("../components/Notification/Notification"),
);
