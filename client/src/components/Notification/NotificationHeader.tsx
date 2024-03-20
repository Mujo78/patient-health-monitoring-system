import { useAppDispatch } from "../../app/hooks";
import { useSelector } from "react-redux";
import {
  deleteAllNotifications,
  markAllAsRead,
  notification,
} from "../../features/notification/notificationSlice";
import { useNavigate } from "react-router-dom";
import React from "react";

type Props = {
  className?: string;
};

const NotificationHeader: React.FC<Props> = ({ className }) => {
  const dispatch = useAppDispatch();
  const { personNotifications } = useSelector(notification);
  const navigate = useNavigate();

  const toMark = personNotifications?.some((n) => n.read === false);

  const markAll = () => {
    if (toMark) {
      dispatch(markAllAsRead());
    }
  };

  const deleteAll = () => {
    dispatch(deleteAllNotifications());
    navigate("../", { replace: true });
  };

  return (
    <div
      className={`bg-blue-700  text-xs underline w-full flex ${className} items-center justify-between p-4 text-white h-8 xxl:!text-lg xxl:!p-6`}
    >
      <button onClick={markAll}>Make All As Read</button>
      <button onClick={deleteAll}>Delete All Notifications</button>
    </div>
  );
};

export default NotificationHeader;
