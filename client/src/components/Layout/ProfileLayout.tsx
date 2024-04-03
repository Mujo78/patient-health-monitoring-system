import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";

type Props = {
  children: React.ReactNode;
};

const ProfileLayout: React.FC<Props> = ({ children }) => {
  const { accessUser } = useSelector(authUser, shallowEqual);

  return (
    <div className="relative mb-16 h-full overflow-x-hidden py-2 sm:!mb-2 md:!mb-0 md:!py-6 lg:!mb-0">
      <div
        className={`${
          accessUser?.data.role === "PHARMACY"
            ? "bg-second-photo-profile"
            : "bg-photo-profile"
        } absolute left-0 top-0 h-52 w-full`}
      />
      <div className="relative flex h-[85%] w-full flex-col items-center gap-6 lg:!h-full lg:!flex-row lg:!justify-around lg:!gap-0 xl:!h-[85%]">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
