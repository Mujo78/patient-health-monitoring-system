import React, { useEffect, useState } from "react";
import { Avatar } from "flowbite-react";
import { useSelector } from "react-redux";
import { authUser } from "../features/auth/authSlice";
import { Link } from "react-router-dom";
import { HiOutlineBell } from "react-icons/hi2";
import { useAppDispatch } from "../app/hooks";
import CustomImg from "./UI/CustomImg";
import socket from "../socket";
import {
  addNotification,
  getPersonNotifications,
  notification,
  restartPersonNotifications,
} from "../features/notification/notificationSlice";
import NavBarDropdown from "./NavBarDropdown";

const CustomNavbar: React.FC = () => {
  let route;
  const [show, setShow] = useState<boolean>(false);

  const { notifications, personNotifications } = useSelector(notification);
  const { accessUser, selected } = useSelector(authUser);
  const dispatch = useAppDispatch();

  if (accessUser?.data.role === "PATIENT")
    route = `/profile/p/${accessUser.data._id}`;
  else if (accessUser?.data.role === "DOCTOR")
    route = `/profile/d/${accessUser.data._id}`;
  else route = `/profile/ph/${accessUser?.data._id}`;

  useEffect(() => {
    socket.emit("userLogin", accessUser?.data._id);
    socket.once("first_message", (data) => {
      dispatch(addNotification(data));
    });

    socket.on("appointment_canceled", (data) => {
      dispatch(addNotification(data));
    });

    socket.on("appointment_finished", (data) => {
      dispatch(addNotification(data));
    });

    return () => {
      socket.off("first_message");
      socket.off("appointment_canceled");
      socket.off("appointment_finished");
    };
  }, [dispatch, accessUser]);

  useEffect(() => {
    dispatch(getPersonNotifications());

    return () => {
      dispatch(restartPersonNotifications());
    };
  }, [dispatch, notifications]);

  const showNotifications = () => {
    setShow((n) => !n);
  };

  const notReaded = personNotifications?.map((n) => n.read === false);
  const readed = notReaded.some((value) => value === true);

  const date = new Date();

  return (
    <nav
      className={`border-t-0 p-2 justify-between items-center font-Poppins w-full flex border-x-0 border-b border-b-gray-200`}
    >
      <div className="w-1/3">
        <p className="text-xl font-semibold">
          {selected ? selected : "Dashboard"}
        </p>
      </div>
      <div className="w-1/3">
        <p className="text-sm font-semibold">{date.toString().slice(0, 16)}</p>
      </div>
      <div className="flex flex-row-reverse items-center relative">
        <Link to={route}>
          <div className="flex items-center">
            {accessUser !== undefined && (
              <CustomImg
                url={accessUser?.data.photo}
                className="w-[30px] mr-1"
              />
            )}
            <p className="text-xs font-semibold mr-6">
              {accessUser?.info.name
                ? accessUser?.info.name
                : accessUser?.info.first_name +
                  " " +
                  accessUser?.info.last_name}
            </p>
          </div>
        </Link>
        <div className="relative">
          <div className="relative cursor-pointer">
            <Avatar
              onClick={showNotifications}
              img={HiOutlineBell}
              status={readed ? "busy" : undefined}
              statusPosition="top-right"
              size="xs"
              rounded
              className={`p-2 text-gray-800 rounded-lg cursor-pointer hover:!bg-gray-100 ${
                show && "bg-gray-100"
              } `}
            />
          </div>
          {show && (
            <div className="h-80 absolute top-9 right-0 z-30 bg-gray-100 w-64 shadow-lg rounded-b-lg border-t-0 border border-gray-200 ">
              <NavBarDropdown setShow={setShow} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;
