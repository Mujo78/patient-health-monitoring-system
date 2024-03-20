import { Button } from "flowbite-react";
import React from "react";

type Props = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  onClick: () => void;
};

const DeleteNotificationButton: React.FC<Props> = ({
  size,
  className,
  onClick,
}) => {
  const deleteOne = () => {
    onClick();
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
