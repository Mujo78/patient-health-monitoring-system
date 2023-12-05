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
      className="bg-white shadow-md m-4 cursor-pointer rounded-lg p-1 md:p-4 flex flex-col border max-w-[200px]"
    >
      {children}
    </div>
  );
};

export default CustomCard;
