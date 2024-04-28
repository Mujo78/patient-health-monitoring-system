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
      aria-label={to}
      className={`${
        location.includes(to)
          ? "rounded-md bg-gray-200 text-gray-800"
          : "text-gray-400"
      } p-2 transition-all duration-700 hover:rounded-md hover:bg-gray-200 hover:text-gray-800`}
    >
      {children}
    </Link>
  );
};

export default IconLink;
