import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Notification,
  deleteOneNotification,
  getPersonNotifications,
  markOneAsRead,
  notification,
  restartNotification,
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

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const { personNotifications, status, message } = useSelector(notification);

  useSelectedPage("Notifications");

  const handleNavigate = (id: string) => {
    navigate(`${id}`);
  };

  useEffect(() => {
    if (id === undefined) {
      dispatch(getPersonNotifications());
    }
  }, [dispatch, id]);

  const deleteOne = (notificationId: string) => {
    if (notificationId) {
      dispatch(deleteOneNotification(notificationId)).then((action) => {
        if (typeof action === "object") {
          dispatch(restartNotification());
        }
      });
    }
  };

  const markAsRead = (notification: Notification) => {
    if (notification && !notification.read) {
      dispatch(markOneAsRead(notification._id));
    }
  };

  const mailtoLink = `mailto:${import.meta.env.VITE_EMAIL_SUPPORT}`;

  return (
    <>
      {status === "loading" && !id ? (
        <CustomSpinner size="lg" />
      ) : personNotifications && personNotifications.length > 0 ? (
        <div className="h-full flex lg:!divide-x pb-16 sm:!pb-2">
          <div
            id="content"
            className={`h-full ${
              id === "" ? "w-full flex lg:!w-1/4" : "w-full lg:!w-1/4 lg:!flex"
            } w-1/4 overflow-y-auto flex-col gap-1`}
          >
            <NotificationHeader className="lg:!hidden" />
            <Table className="overflow-y-auto">
              <Table.Body className="divide-y overflow-y-auto">
                {personNotifications.map((n) => (
                  <Table.Row
                    key={n._id}
                    onClick={() => {
                      if (window.innerWidth > 768) {
                        handleNavigate(n._id);
                      } else {
                        markAsRead(n);
                      }
                    }}
                    className={`cursor-pointer hover:!bg-gray-200 ${
                      id === n._id && "!bg-gray-200"
                    }  ${n.read ? "bg-gray-100" : "bg-white"}`}
                  >
                    <Table.Cell className="flex gap-2 items-center p-2">
                      <div className="flex flex-col w-full text-xs">
                        <h3
                          className={`font-bold xxl:!text-lg text-sm ${colorPick(
                            n.type
                          )}`}
                        >
                          {n.name}
                        </h3>
                        <div className="text-[0.7rem] xxl:!text-sm flex gap-3 flex-col w-full">
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
                              <p className="text-xs mr-auto lg:!hidden">
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
                            <div className="flex justify-between flex-wrap">
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
                              onClick={() => deleteOne(n._id)}
                              className="mt-1 ml-auto lg:!hidden"
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

          <div className="w-full hidden lg:!flex justify-between flex-col h-full items-center">
            <NotificationHeader />
            {id ? (
              <Outlet />
            ) : (
              <div className="hidden w-full h-full lg:flex items-center justify-center">
                <p className="text-gray-400">
                  Please, choose notification for review.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <ErrorMessage
            className="xxl:!text-2xl"
            text={message || "There are no notifications."}
            size="md"
          />
        </div>
      )}
    </>
  );
};

export default Notifications;
