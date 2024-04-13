import { Button } from "flowbite-react";
import React from "react";

type Props = {
  children: string | React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: string;
  disabled?: boolean;
  className?: string;
  size?: string;
};

const CustomButton: React.FC<Props> = ({
  children,
  className,
  type,
  disabled,
  size,
  onClick,
}) => {
  return (
    <Button
      size={size ? size : "sm"}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${className} !bg-blue-700 transition-colors duration-300 hover:!bg-blue-600 xxl:!h-14`}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
