import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  to?: string;
};

const CustomCard: React.FC<Props> = ({ children, to }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (to) {
      navigate(to, { replace: true });
    }
  };

  return (
    <div
      onClick={handleNavigate}
      className="m-4 flex max-w-[200px] cursor-pointer flex-col rounded-lg border bg-white p-1 shadow-md md:p-4"
    >
      {children}
    </div>
  );
};

export default CustomCard;
