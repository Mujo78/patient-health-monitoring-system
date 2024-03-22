import React from "react";
import { HiOutlineCog6Tooth, HiOutlineLockClosed } from "react-icons/hi2";
import Profile from "../Layout/Profile";
import useSelectedPage from "../../hooks/useSelectedPage";
import ProfileLink from "../Profile/ProfileLink";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";

const PharmacyProfile: React.FC = () => {
  const { accessUser } = useSelector(authUser);
  useSelectedPage("Profile");

  return (
    <Profile>
      <ProfileLink to={`/profile/ph/${accessUser?.data._id}`} text="General">
        <HiOutlineCog6Tooth className="size-5 xxl:!size-7" />
      </ProfileLink>

      <ProfileLink to="page-security" text="Security">
        <HiOutlineLockClosed className="size-5 xxl:!size-7" />
      </ProfileLink>
    </Profile>
  );
};

export default PharmacyProfile;
