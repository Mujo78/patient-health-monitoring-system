import React from "react";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";

type Props = {
  children: React.ReactNode;
};

const ProfileLayout: React.FC<Props> = ({ children }) => {
  const { accessUser } = useSelector(authUser);

  return (
    <div className="h-full py-2 md:!py-6 md:!mb-0 mb-16 sm:!mb-2 lg:!mb-0 overflow-x-hidden relative">
      <div
        className={`${
          accessUser?.data.role === "PHARMACY"
            ? "bg-second-photo-profile"
            : "bg-photo-profile"
        } absolute top-0 left-0 h-52 w-full`}
      />
      <div className="flex flex-col gap-6 lg:!gap-0 lg:!flex-row w-full h-[85%] lg:!h-full xl:!h-[85%] items-center lg:!justify-around relative">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
