import React, { useState } from "react";
import RootSidebar from "../UI/RootSidebar";
import { Alert, Button, Sidebar } from "flowbite-react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { authUser, setSelected } from "../../features/auth/authSlice";
import {
  HiOutlineChartPie,
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineCalendarDays,
} from "react-icons/hi2";
import { useAppDispatch } from "../../app/hooks";
import SidebarItemText from "../UI/SidebarItemText";

const welcomeMessages = [
  "Welcome! We're excited to have you on board.",
  "Hello there! Wishing you a great day in healthcare.",
  "Glad you're here! Best wishes for an impactful day.",
  "Hello and welcome! We're here to make healthcare better.",
  "Thanks for joining us! Your work in healthcare matters.",
];

const DoctorSidebar: React.FC = () => {
  const { accessUser } = useSelector(authUser);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [show, setShow] = useState<boolean>(true);

  const handleDissmis = () => {
    setShow(false);
  };
  const onClickSelect = (name: string) => {
    dispatch(setSelected(name));
  };

  const randomNumber = Math.floor(Math.random() * 5);

  return (
    <RootSidebar>
      <Sidebar.Item
        as={NavLink}
        onClick={() => onClickSelect("Dashboard")}
        to={`/doctor/${accessUser?.data._id}`}
        active={location.pathname.startsWith("/doctor/")}
        icon={HiOutlineChartPie}
      >
        <SidebarItemText>Dashboard</SidebarItemText>
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        to={`/appointments`}
        onClick={() => onClickSelect("My appointments")}
        active={location.pathname.startsWith("/appointments")}
        icon={HiOutlineCalendarDays}
      >
        <SidebarItemText>My Appointments</SidebarItemText>
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        to={`/my-patients`}
        onClick={() => onClickSelect("My patients")}
        active={location.pathname.startsWith("/my-patients")}
        icon={HiOutlineUsers}
      >
        <SidebarItemText>My Patients</SidebarItemText>
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        onClick={() => onClickSelect("Department")}
        active={location.pathname.startsWith("/my-department")}
        to="/my-department"
        icon={HiOutlineBuildingOffice2}
      >
        <SidebarItemText>Department</SidebarItemText>
      </Sidebar.Item>
      {location.pathname.startsWith("/doctor/") && (
        <div className="hidden h-2/3 w-52 flex-grow flex-col items-center justify-center xl:!flex">
          {show && (
            <Alert
              className="mr-3 flex h-fit w-full flex-col justify-between gap-2 bg-gradient-to-b from-blue-600  to-blue-300 text-white"
              additionalContent={
                <div className="flex flex-col gap-2">
                  <p className="text-xs xxl:!text-lg">
                    {welcomeMessages[randomNumber]}
                  </p>
                  <Button
                    className="ml-auto mt-3 bg-white text-blue-700 hover:!bg-gray-200"
                    onClick={handleDissmis}
                    size="xs"
                  >
                    <p className="xxl:!text-lg">Dismiss</p>
                  </Button>
                </div>
              }
              rounded
            >
              <div className="w-full">
                <p className="mt-3 text-sm font-semibold xxl:!text-xl">
                  {`Welcome, Dr. ${accessUser?.info.last_name}`}!
                </p>
              </div>
            </Alert>
          )}
        </div>
      )}
    </RootSidebar>
  );
};

export default DoctorSidebar;
