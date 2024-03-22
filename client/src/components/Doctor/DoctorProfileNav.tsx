import React from "react";
import { HiOutlineIdentification, HiOutlineLockClosed } from "react-icons/hi2";
import Profile from "../Layout/Profile";
import useSelectedPage from "../../hooks/useSelectedPage";
import ProfileLink from "../Profile/ProfileLink";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";

const DoctorProfile: React.FC = () => {
  const { accessUser } = useSelector(authUser);
  useSelectedPage("Profile");

  return (
    <Profile>
      <ProfileLink
        to={`/profile/d/${accessUser?.data._id}`}
        text="Personal informations"
      >
        <HiOutlineIdentification className="size-5 xxl:!size-7" />
      </ProfileLink>

      <ProfileLink to="security-page" text="Security">
        <HiOutlineLockClosed className="size-5 xxl:!size-7" />
      </ProfileLink>
    </Profile>
  );
};

export default DoctorProfile;
