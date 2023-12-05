import React from "react";
import { useSelector } from "react-redux";
import { authUser } from "../features/auth/authSlice";

type Props = {
  children: React.ReactNode;
};

const ProfileLayout: React.FC<Props> = ({ children }) => {
  const { accessUser } = useSelector(authUser);

  return (
    <div className="h-full overflow-x-hidden font-Poppins relative mr-3">
      <div
        className={`${
          accessUser?.data.role === "PHARMACY"
            ? "bg-second-photo-profile"
            : "bg-photo-profile"
        } absolute top-0 left-0 h-[200px] w-full`}
      />
      <div className="flex w-full h-full justify-around items-center relative">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
