import RootTabNav from "../UI/RootTabNav";
import IconLink from "../UI/IconLink";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import {
  HiOutlineChartPie,
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
} from "react-icons/hi2";

const DoctorTabNav = () => {
  const { accessUser } = useSelector(authUser);
  return (
    <RootTabNav>
      <IconLink to={`/doctor/${accessUser?.data._id}`}>
        <HiOutlineChartPie size={20} />
      </IconLink>

      <IconLink to={`/appointments`}>
        <HiOutlineCalendarDays size={20} />
      </IconLink>

      <IconLink to={`/my-patients`}>
        <HiOutlineUsers size={20} />
      </IconLink>

      <IconLink to={`/my-department`}>
        <HiOutlineBuildingOffice2 size={20} />
      </IconLink>
    </RootTabNav>
  );
};

export default DoctorTabNav;
