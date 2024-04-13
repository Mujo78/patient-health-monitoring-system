import React from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  to: string;
};

const IconLink: React.FC<Props> = ({ children, to }) => {
  const location = useLocation().pathname;
  return (
    <Link
      to={to}
      className={`${
        location.includes(to) && "rounded-md bg-gray-300"
      } p-2 text-gray-800 transition-all duration-300`}
    >
      {children}
    </Link>
  );
};

export default IconLink;
