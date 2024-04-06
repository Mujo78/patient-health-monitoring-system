import { Button } from "flowbite-react";
import React from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  deleteOneNotification,
  restartNotification,
} from "../../features/notification/notificationSlice";
import { isFulfilled } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

type Props = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  notificationId: string;
  onClick?: () => void;
};

const DeleteNotificationButton: React.FC<Props> = ({
  size,
  className,
  notificationId,
  onClick,
}) => {
  const dispatch = useAppDispatch();

  const deleteOne = () => {
    dispatch(deleteOneNotification(notificationId)).then((action: any) => {
      if (isFulfilled(action)) {
        toast.success("Notification successfully deleted!");
        dispatch(restartNotification());
        if (onClick) onClick();
      } else {
        toast.error(action.payload);
      }
    });
  };

  return (
    <Button
      onClick={deleteOne}
      color="failure"
      size={size ?? "xs"}
      className={className}
    >
      <p className="xxl:!text-xl">Delete Notification</p>
    </Button>
  );
};

export default DeleteNotificationButton;
