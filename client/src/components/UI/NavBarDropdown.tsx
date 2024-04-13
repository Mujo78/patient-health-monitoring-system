import React from "react";
import CustomButton from "./CustomButton";
import { Table } from "flowbite-react";
import {
  HiOutlineXCircle,
  HiOutlineUserGroup,
  HiOutlineInformationCircle,
} from "react-icons/hi2";
import { shallowEqual, useSelector } from "react-redux";
import {
  markAllAsRead,
  notification,
} from "../../features/notification/notificationSlice";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import moment from "moment";
import { useAppDispatch } from "../../app/hooks";
import { authUser } from "../../features/auth/authSlice";
import { colorPick } from "../../service/authSideFunctions";
import CustomSpinner from "./CustomSpinner";
import { isRejected } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

type Props = {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  hasNewNotification: boolean;
};

const NavBarDropdown: React.FC<Props> = ({ setShow, hasNewNotification }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { personNotifications, status, message } = useSelector(
    notification,
    shallowEqual,
  );
  const { accessUser } = useSelector(authUser, shallowEqual);

  const role = accessUser?.data?.role;
  let route;

  if (role === "PATIENT") route = "/notifications";
  else if (role === "DOCTOR") route = "/doctor-notifications";
  else route = "/pharmacy-notifications";

  const markAll = () => {
    if (hasNewNotification) {
      dispatch(markAllAsRead()).then((action: any) => {
        if (isRejected(action)) {
          toast.error(action.payload);
        }
      });
    }
  };

  const navigateNotifications = () => {
    if (route) {
      setShow(false);
      navigate(route);
    }
  };

  const handleNavigateNotification = (id: string) => {
    if (route) {
      setShow(false);
      navigate(`${route}/${id}`);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <p className="mb-2 flex flex-wrap justify-between px-3 pt-3 text-center">
        <span className="text-sm font-semibold xxl:!text-xl">
          Notifications
        </span>
        <button
          onClick={markAll}
          className="text-xs text-blue-700 underline xxl:!text-lg"
        >
          Mark All as read
        </button>
      </p>
      <hr />
      {personNotifications.length > 0 ? (
        <>
          <Table className="rounded-none">
            <Table.Body className="divide-y">
              {status === "loading" ? (
                <Table.Row>
                  <Table.Cell>
                    <CustomSpinner />
                  </Table.Cell>
                </Table.Row>
              ) : (
                personNotifications.map((n) => (
                  <Table.Row
                    onClick={() => handleNavigateNotification(n._id)}
                    key={n._id}
                    className={`cursor-pointer hover:!bg-gray-200 ${
                      n.read ? "bg-gray-100" : "bg-white"
                    } transition-colors duration-300`}
                  >
                    <Table.Cell className="flex items-center gap-2 p-2">
                      {n.type === "MESSAGE" ? (
                        <HiOutlineUserGroup className="h-8 w-8 xxl:!h-12 xxl:!w-12" />
                      ) : n.type === "INFO" ? (
                        <HiOutlineInformationCircle className="h-8 w-8 text-green-600 xxl:!h-12 xxl:!w-12" />
                      ) : (
                        <HiOutlineXCircle className="h-8 w-8 text-red-600 xxl:!h-12 xxl:!w-12" />
                      )}
                      <div className="flex w-full flex-col text-xs">
                        <h3
                          className={`text-[10px] font-bold xxl:!text-lg ${colorPick(
                            n.type,
                          )}`}
                        >
                          {n.name}
                        </h3>
                        <div className="flex w-full justify-between text-[9px] xxl:!text-lg">
                          <p className="line-clamp-2 w-3/4">{n.content}</p>
                          <p className="mt-auto">
                            {moment(n.createdAt).format("hh:mm A")}
                          </p>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
          <CustomButton
            onClick={navigateNotifications}
            className="absolute bottom-0 mt-auto w-full"
            size="xs"
          >
            <p className="xxl:!text-lg">See all</p>
          </CustomButton>
        </>
      ) : (
        <ErrorMessage className="mt-6 text-center" text={message} />
      )}
    </div>
  );
};

export default NavBarDropdown;
