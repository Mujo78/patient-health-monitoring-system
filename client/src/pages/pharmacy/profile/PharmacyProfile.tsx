import React from "react";
import { HiOutlineCog6Tooth, HiOutlineLockClosed } from "react-icons/hi2";
import { Link } from "react-router-dom";
import Profile from "../../../components/Profile";
import useSelectedPage from "../../../hooks/useSelectedPage";

const PharmacyProfile: React.FC = () => {
  useSelectedPage("Profile");

  return (
    <Profile>
      <Link to="." className="p-2 flex items-center hover:bg-gray-100">
        <HiOutlineCog6Tooth className="text-[20px]" />
        <span className="ml-3 text-sm">General</span>
      </Link>
      <Link
        to="page-security"
        className="p-2 flex items-center hover:bg-gray-100"
      >
        <HiOutlineLockClosed className="text-[20px]" />
        <span className="ml-3 text-sm">Security</span>
      </Link>
    </Profile>
  );
};

export default PharmacyProfile;
