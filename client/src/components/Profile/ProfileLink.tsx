import React from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  to: string;
  text: string;
};

const ProfileLink: React.FC<Props> = ({ children, to, text }) => {
  const location = useLocation().pathname;

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center p-2 transition-all duration-300 hover:bg-gray-100 ${
          (location === to && "bg-gray-100") ||
          (location.endsWith(to) && "bg-gray-100")
        }`}
      >
        {children}
        <span className="ml-3 text-sm xxl:!text-lg">{text}</span>
      </Link>
    </li>
  );
};

export default ProfileLink;
