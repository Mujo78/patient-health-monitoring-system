import React from "react";
import {
  HiOutlineCog6Tooth,
  HiOutlineIdentification,
  HiOutlineLockClosed,
} from "react-icons/hi2";
import Profile from "../Layout/Profile";
import useSelectedPage from "../../hooks/useSelectedPage";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import ProfileLink from "../Profile/ProfileLink";

const PatientProfile: React.FC = () => {
  const { accessUser } = useSelector(authUser);
  useSelectedPage("Profile");

  return (
    <Profile>
      <ProfileLink to={`/profile/p/${accessUser?.data._id}`} text="General">
        <HiOutlineCog6Tooth className="size-5 xxl:!size-7" />
      </ProfileLink>

      <ProfileLink to="personal-info" text="Personal informations">
        <HiOutlineIdentification className="size-5 xxl:!size-7" />
      </ProfileLink>

      <ProfileLink to="security" text="Security">
        <HiOutlineLockClosed className="size-5 xxl:!size-7" />
      </ProfileLink>
    </Profile>
  );
};

export default PatientProfile;
