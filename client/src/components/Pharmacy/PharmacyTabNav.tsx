import RootTabNav from "../UI/RootTabNav";
import IconLink from "../UI/IconLink";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import {
  HiOutlineChartBarSquare,
  HiOutlineDocumentText,
  HiOutlineDocumentPlus,
} from "react-icons/hi2";

const PharmacyTabNav = () => {
  const { accessUser } = useSelector(authUser);

  return (
    <RootTabNav>
      <IconLink to={`/pharmacy/${accessUser?.data._id}`}>
        <HiOutlineChartBarSquare size={20} />
      </IconLink>

      <IconLink to={`/medicine`}>
        <HiOutlineDocumentText size={20} />
      </IconLink>

      <IconLink to={`/add-medicine`}>
        <HiOutlineDocumentPlus size={20} />
      </IconLink>
    </RootTabNav>
  );
};

export default PharmacyTabNav;
