import { useAppDispatch } from "../../app/hooks";
import { shallowEqual, useSelector } from "react-redux";
import {
  deleteAllNotifications,
  markAllAsRead,
  notification,
} from "../../features/notification/notificationSlice";
import { useNavigate } from "react-router-dom";
import React from "react";
import { isRejected } from "@reduxjs/toolkit";

type Props = {
  className?: string;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const NotificationHeader: React.FC<Props> = ({ className, setError }) => {
  const dispatch = useAppDispatch();
  const { personNotifications } = useSelector(notification, shallowEqual);
  const navigate = useNavigate();

  const toMark = personNotifications?.some((n) => n.read === false);

  const markAll = () => {
    if (toMark) {
      dispatch(markAllAsRead()).then((action: any) => {
        if (isRejected(action)) {
          setError(action.payload);
        }
      });
    }
  };

  const deleteAll = () => {
    dispatch(deleteAllNotifications()).then((action: any) => {
      if (isRejected(action)) {
        setError(action.payload);
      } else {
        navigate("../", { replace: true });
      }
    });
  };

  return (
    <div
      className={`flex  w-full bg-blue-700 text-xs underline ${className} h-8 items-center justify-between p-4 text-white xxl:!p-6 xxl:!text-lg`}
    >
      <button onClick={markAll}>Make All As Read</button>
      <button onClick={deleteAll}>Delete All Notifications</button>
    </div>
  );
};

export default NotificationHeader;
