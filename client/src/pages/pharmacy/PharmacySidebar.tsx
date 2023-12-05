import React from "react";
import RootSidebar from "../../components/RootSidebar";
import { Sidebar } from "flowbite-react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { authUser, setSelected } from "../../features/auth/authSlice";
import {
  HiOutlineChartBarSquare,
  HiOutlineDocumentText,
  HiOutlineDocumentPlus,
} from "react-icons/hi2";
import { useAppDispatch } from "../../app/hooks";
import { reset } from "../../features/medicine/medicineSlice";

const PharmacySidebar: React.FC = () => {
  const location = useLocation();
  const { accessUser } = useSelector(authUser);
  const dispatch = useAppDispatch();

  const onClickSelect = (name: string) => {
    dispatch(reset());
    dispatch(setSelected(name));
  };

  return (
    <RootSidebar>
      <Sidebar.Item
        as={NavLink}
        to={`/pharmacy/${accessUser?.data._id}`}
        onClick={() => onClickSelect("Dashboard")}
        active={location.pathname.startsWith("/pharmacy/")}
        icon={HiOutlineChartBarSquare}
      >
        Dashboard
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        to={`/medicine`}
        onClick={() => onClickSelect("Medicine overview")}
        active={location.pathname.startsWith("/medicine")}
        icon={HiOutlineDocumentText}
      >
        Overview
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        to={`/add-medicine`}
        onClick={() => onClickSelect("Add medicine")}
        active={location.pathname === "/add-medicine"}
        icon={HiOutlineDocumentPlus}
      >
        Add medicine
      </Sidebar.Item>
    </RootSidebar>
  );
};

export default PharmacySidebar;
