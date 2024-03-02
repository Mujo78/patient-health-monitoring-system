import React from "react";
import RootSidebar from "../UI/RootSidebar";
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
import SidebarItemText from "../UI/SidebarItemText";

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
        <SidebarItemText>Dashboard</SidebarItemText>
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        to={`/medicine`}
        onClick={() => onClickSelect("Medicine overview")}
        active={location.pathname.startsWith("/medicine")}
        icon={HiOutlineDocumentText}
      >
        <SidebarItemText>Overview</SidebarItemText>
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        to={`/add-medicine`}
        onClick={() => onClickSelect("Add medicine")}
        active={location.pathname === "/add-medicine"}
        icon={HiOutlineDocumentPlus}
      >
        <SidebarItemText>Add medicine</SidebarItemText>
      </Sidebar.Item>
    </RootSidebar>
  );
};

export default PharmacySidebar;
