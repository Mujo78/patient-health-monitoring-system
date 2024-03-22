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
    <Link
      to={to}
      className={`p-2 flex items-center hover:bg-gray-100 transition-all duration-300 ${
        (location === to && "bg-gray-100") ||
        (location.endsWith(to) && "bg-gray-100")
      }`}
    >
      {children}
      <span className="ml-3 text-sm xxl:!text-lg">{text}</span>
    </Link>
  );
};

export default ProfileLink;
