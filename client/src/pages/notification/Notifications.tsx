import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  getPersonNotifications,
  markOneAsRead,
  notification,
} from "../../features/notification/notificationSlice";
import { Table } from "flowbite-react";
import ErrorMessage from "../../components/UI/ErrorMessage";
import moment from "moment";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import useSelectedPage from "../../hooks/useSelectedPage";
import { colorPick } from "../../service/authSideFunctions";
import NotificationHeader from "../../components/Notification/NotificationHeader";
import DeleteNotificationButton from "../../components/Notification/DeleteNotificationButton";
import CustomSpinner from "../../components/UI/CustomSpinner";
import NoDataAvailable from "../../components/UI/NoDataAvailable";
import { isRejected } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export type ContextTyped = {
  error: string | undefined;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const Notifications: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { personNotifications, status, message } = useSelector(
    notification,
    shallowEqual,
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useSelectedPage("Notifications");

  const handleNavigate = (id: string) => {
    navigate(`${id}`);
  };

  useEffect(() => {
    if (!id && !personNotifications) {
      dispatch(getPersonNotifications());
    }
  }, [dispatch, id, personNotifications]);

  useEffect(() => {
    if (windowWidth < 1020 && id) {
      navigate(-1);
    }
  }, [navigate, windowWidth, id]);

  const markAsRead = (id: string) => {
    dispatch(markOneAsRead(id)).then((action: any) => {
      if (isRejected(action)) setError(action.payload);
    });
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const mailtoLink = `mailto:${import.meta.env.VITE_EMAIL_SUPPORT}`;

  return (
    <>
      {status === "loading" && !id ? (
        <CustomSpinner size="lg" />
      ) : personNotifications && personNotifications?.length > 0 ? (
        <div className="flex h-full pb-16 sm:!pb-2 lg:!divide-x">
          <div
            id="content"
            className={`h-full ${
              id === "" ? "flex w-full lg:!w-1/4" : "w-full lg:!flex lg:!w-1/4"
            } w-1/4 flex-col gap-1 overflow-y-auto`}
          >
            <NotificationHeader setError={setError} className="lg:!hidden" />
            <Table className="overflow-y-auto">
              <Table.Body className="divide-y overflow-y-auto">
                {personNotifications.map((n) => (
                  <Table.Row
                    key={n._id}
                    onClick={() => {
                      if (windowWidth > 1020) {
                        handleNavigate(n._id);
                      } else {
                        if (!n.read) {
                          markAsRead(n._id);
                        }
                      }
                    }}
                    className={`cursor-pointer hover:!bg-gray-200 ${
                      id === n._id && "!bg-gray-200"
                    }  ${n.read ? "bg-gray-100" : "bg-white"}`}
                  >
                    <Table.Cell className="flex items-center gap-2 p-2">
                      <div className="flex w-full flex-col text-xs">
                        <h3
                          className={`text-sm font-bold xxl:!text-lg ${colorPick(
                            n.type,
                          )}`}
                        >
                          {n.name}
                        </h3>
                        <div className="flex w-full flex-col gap-3 text-[0.7rem] xxl:!text-sm">
                          {n?.name.startsWith("Welcome to the") ? (
                            <>
                              <p className="lg:!line-clamp-2">
                                Welcome to the Patient Health Monitoring System!
                                🏥 We're delighted to have you here. Your health
                                and well-being are our top priorities. Our
                                platform is designed to help you stay informed
                                about your health, connect with healthcare
                                professionals, and track your progress. If you
                                have any questions about using our system or
                                need assistance with anything, don't hesitate to
                                reach out. Our team is here to support you on
                                your health journey. Stay healthy and stay
                                connected
                              </p>
                              <p className="mr-auto text-xs lg:!hidden">
                                Support email:{" "}
                                <Link
                                  className="text-blue-700 hover:!underline"
                                  to={mailtoLink}
                                >
                                  {import.meta.env.VITE_EMAIL_SUPPORT ||
                                    "application.supp.2023@gmail.com"}
                                </Link>
                              </p>
                            </>
                          ) : (
                            <p className="lg:!line-clamp-2">{n.content}</p>
                          )}

                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap justify-between">
                              {n.link && (
                                <Link
                                  to={n.link}
                                  className="underline lg:!hidden"
                                >
                                  See results
                                </Link>
                              )}

                              <p className=" ml-auto">
                                {moment(n.createdAt).format("hh:mm A")}
                              </p>
                            </div>
                            <DeleteNotificationButton
                              notificationId={n._id}
                              className="ml-auto mt-1 lg:!hidden"
                            />
                          </div>
                        </div>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <div className="hidden h-full w-full flex-col items-center justify-between lg:!flex">
            <NotificationHeader setError={setError} />
            {id ? (
              <Outlet context={{ error, setError } satisfies ContextTyped} />
            ) : (
              <div className="hidden h-full w-full items-center justify-center lg:flex">
                <p className="text-gray-400">
                  Please, choose notification for review.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : status === "failed" && message ? (
        <div className="flex h-full items-center justify-center">
          <ErrorMessage text={message} />
        </div>
      ) : (
        personNotifications?.length === 0 &&
        status === "idle" && <NoDataAvailable className="mt-12" />
      )}
    </>
  );
};

export default Notifications;
