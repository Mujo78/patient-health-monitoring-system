import React, { useState } from "react";
import RootSidebar from "../../components/RootSidebar";
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

const welcomeMessages = [
  "Welcome! We're excited to have you on board.",
  "Hello there! Wishing you a great day in healthcare.",
  "Glad you're here! Best wishes for an impactful day.",
  "Hello and welcome! We're here to make healthcare better.",
  "Thanks for joining us! Your work in healthcare matters.",
  "We're thrilled to have you here! Best wishes for another impactful day in healthcare.",
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

  const randomNumber = Math.floor(Math.random() * 6);

  return (
    <RootSidebar>
      <Sidebar.Item
        as={NavLink}
        onClick={() => onClickSelect("Dashboard")}
        to={`/doctor/${accessUser?.data._id}`}
        active={location.pathname.startsWith("/doctor/")}
        icon={HiOutlineChartPie}
      >
        Dashboard
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        to={`/appointments`}
        onClick={() => onClickSelect("My appointments")}
        active={location.pathname.startsWith("/appointments")}
        icon={HiOutlineCalendarDays}
      >
        My Appointments
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        to={`/my-patients`}
        onClick={() => onClickSelect("My patients")}
        active={location.pathname.startsWith("/my-patients")}
        icon={HiOutlineUsers}
      >
        My Patients
      </Sidebar.Item>
      <Sidebar.Item
        as={NavLink}
        onClick={() => onClickSelect("Department")}
        active={location.pathname.startsWith("/my-department")}
        to="/my-department"
        icon={HiOutlineBuildingOffice2}
      >
        Department
      </Sidebar.Item>
      {location.pathname.startsWith("/doctor/") && (
        <div className="flex h-2/3 flex-col justify-center mr-3 flex-grow w-full items-center">
          {show && (
            <Alert
              className="bg-gradient-to-b flex justify-between gap-4 flex-col from-blue-600 to-blue-300 mr-3 text-white  w-full h-fit"
              additionalContent={
                <div className="flex flex-col gap-3">
                  <p className="text-xs">{welcomeMessages[randomNumber]}</p>
                  <Button
                    className="bg-white ml-auto text-blue-700 mt-3 hover:!bg-gray-200"
                    onClick={handleDissmis}
                    size="xs"
                  >
                    Dismiss
                  </Button>
                </div>
              }
              rounded
            >
              <div className="w-full">
                <p className="text-[16px] mt-3 font-semibold">
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
