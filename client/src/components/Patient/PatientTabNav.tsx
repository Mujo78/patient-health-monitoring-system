import RootTabNav from "../UI/RootTabNav";
import IconLink from "../UI/IconLink";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import {
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineCalendarDays,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentText,
} from "react-icons/hi2";

const PatientTabNav = () => {
  const { accessUser } = useSelector(authUser);

  return (
    <RootTabNav>
      <IconLink to={`/patient/${accessUser?.data._id}`}>
        <HiOutlineChartBar size={20} />
      </IconLink>

      <IconLink to={`/my-appointments`}>
        <HiOutlineCalendarDays size={20} />
      </IconLink>

      <IconLink to={`/appointment`}>
        <HiOutlineClock size={20} />
      </IconLink>

      <IconLink to={`/staff`}>
        <HiOutlineBuildingOffice2 size={20} />
      </IconLink>

      <IconLink to={`/medicine-overview`}>
        <HiOutlineDocumentText size={20} />
      </IconLink>
    </RootTabNav>
  );
};

export default PatientTabNav;
