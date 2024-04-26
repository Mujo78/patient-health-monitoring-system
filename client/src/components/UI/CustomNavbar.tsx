import React, { useEffect, useMemo, useState } from "react";
import { Avatar, CustomFlowbiteTheme } from "flowbite-react";
import { shallowEqual, useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import { HiOutlineBell } from "react-icons/hi2";
import { useAppDispatch } from "../../app/hooks";
import CustomImg from "./CustomImg";
import socket from "../../socket";
import {
  addNotification,
  getPersonNotifications,
  notification,
  restartNotifications,
} from "../../features/notification/notificationSlice";
import NavBarDropdown from "./NavBarDropdown";
import LogoutButton from "./LogoutButton";
import moment from "moment";

const customTheme: CustomFlowbiteTheme["avatar"] = {
  root: {
    size: {
      xs: "w-6 h-6 xxl:!w-12 xxl:!h-10",
      sm: "w-8 h-8",
      md: "w-10 h-10",
      lg: "w-20 h-20",
      xl: "w-36 h-36",
    },
  },
};

const CustomNavbar: React.FC = () => {
  const [show, setShow] = useState<boolean>(false);

  const { personNotifications } = useSelector(notification, shallowEqual);
  const { accessUser, selected } = useSelector(authUser, shallowEqual);
  const dispatch = useAppDispatch();

  const _id = accessUser?.data?._id;
  const role = accessUser?.data?.role;

  let route;
  if (role === "DOCTOR") route = `/profile/d/${_id}`;
  else if (role === "PATIENT") route = `/profile/p/${_id}`;
  else route = `/profile/ph/${_id}`;

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
      dispatch(restartNotifications());
    };
  }, [dispatch]);

  const showNotifications = () => {
    setShow((n) => !n);
  };

  const hasNewNotifications = useMemo(() => {
    return personNotifications?.some((notification) => !notification.read);
  }, [personNotifications]);

  return (
    <nav className="sticky flex w-full items-center justify-between border-x-0 border-b border-t-0 border-b-gray-200 p-2 md:relative">
      <div className="w-1/3">
        <p className="text-sm font-semibold lg:text-xl xxl:!text-3xl">
          {selected ?? "Dashboard"}
        </p>
      </div>
      <div className="hidden w-1/3 sm:block">
        <p className="text-sm font-semibold xxl:!text-2xl">
          {moment().toDate().toDateString()}
        </p>
      </div>
      <div className="relative flex flex-row-reverse items-center">
        <div className="flex items-center gap-1">
          <Link to={route}>
            <div className="flex items-center">
              {accessUser && (
                <div className="flex flex-wrap items-center justify-center">
                  <CustomImg
                    url={accessUser?.data.photo}
                    className="mr-1 xxl:!w-14"
                    width={32}
                  />
                  <p className="mr-0 text-xs font-semibold sm:mr-3 xxl:!text-2xl">
                    {accessUser?.info?.name ??
                      accessUser?.info.first_name +
                        " " +
                        accessUser?.info.last_name}
                  </p>
                </div>
              )}
            </div>
          </Link>
          <div className="flex sm:!hidden">
            <LogoutButton />
          </div>
        </div>
        <div className="relative">
          <div className="relative cursor-pointer">
            <Avatar
              theme={customTheme}
              onClick={showNotifications}
              img={HiOutlineBell}
              status={hasNewNotifications ? "busy" : undefined}
              statusPosition="top-right"
              rounded
              size="xs"
              className={`cursor-pointer rounded-lg p-1 text-gray-800 hover:!bg-gray-100 ${
                show && "bg-gray-100"
              } `}
            />
          </div>
          {show && (
            <div className="absolute -right-24 top-9 z-30 h-80 w-fit rounded-b-lg border border-t-0 border-gray-200 bg-gray-100 shadow-lg sm:right-0 sm:w-64 xxl:!h-96 xxl:!w-96 ">
              <NavBarDropdown
                setShow={setShow}
                hasNewNotification={hasNewNotifications}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;
