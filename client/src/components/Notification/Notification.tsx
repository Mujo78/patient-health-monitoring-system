import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  ContextTyped,
  getOneNotification,
  markOneAsRead,
  notification,
  restartNotification,
} from "../../features/notification/notificationSlice";
import { useAppDispatch } from "../../app/hooks";
import Footer from "../UI/Footer";
import Logo from "../UI/Logo";
import DeleteNotificationButton from "./DeleteNotificationButton";
import CustomSpinner from "../UI/CustomSpinner";
import { isRejected } from "@reduxjs/toolkit";
import ErrorMessage from "../UI/ErrorMessage";

const Notification: React.FC = () => {
  const { setError } = useOutletContext<ContextTyped>();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { oneNotification, status, message } = useSelector(
    notification,
    shallowEqual,
  );

  useEffect(() => {
    if (id) {
      dispatch(getOneNotification(id));
    }

    return () => {
      dispatch(restartNotification());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (oneNotification && !oneNotification.read) {
      dispatch(markOneAsRead(oneNotification._id)).then((action: any) => {
        if (isRejected(action)) {
          setError(action.payload);
        }
      });
    }
  }, [dispatch, oneNotification, setError]);

  const handleNavigate = () => {
    navigate("../");
  };

  const mailtoLink = `mailto:${import.meta.env.VITE_EMAIL_SUPPORT}`;

  return (
    <>
      {status === "loading" ? (
        <CustomSpinner size="lg" />
      ) : oneNotification ? (
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex h-full flex-col items-center justify-center gap-3">
            {oneNotification?.name.startsWith("Welcome to the") ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <Logo />
                <h2 className="text-lg font-bold text-blue-700 xxl:!text-2xl">
                  {oneNotification.name}
                </h2>
                <div className="flex w-2/3 flex-col gap-3">
                  <p className="text-justify text-xs text-gray-600 xxl:!text-lg ">
                    Welcome to the Patient Health Monitoring System! 🏥 We're
                    delighted to have you here. Your health and well-being are
                    our top priorities. Our platform is designed to help you
                    stay informed about your health, connect with healthcare
                    professionals, and track your progress. If you have any
                    questions about using our system or need assistance with
                    anything, don't hesitate to reach out. Our team is here to
                    support you on your health journey. Stay healthy and stay
                    connected
                  </p>
                  <p className="ml-auto text-xs xxl:!text-lg">
                    Support email:{" "}
                    <Link
                      className="text-blue-700 hover:!underline"
                      to={mailtoLink}
                    >
                      {import.meta.env.VITE_EMAIL_SUPPORT}
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-6">
                <h2
                  className={`${
                    oneNotification?.type === "ALERT"
                      ? "text-red-600"
                      : "text-green-600"
                  } text-lg font-bold xxl:!text-2xl`}
                >
                  {oneNotification?.name}
                </h2>
                <div className="w-2/3 gap-3">
                  <p className="text-justify text-sm text-gray-600 xxl:!text-lg">
                    {oneNotification?.content}
                  </p>
                  <div className="mt-2 flex w-full justify-between">
                    {oneNotification?.link && (
                      <Link
                        to={oneNotification?.link}
                        className="text-md text-green-600 underline xxl:!text-lg"
                      >
                        See Appointment Results
                      </Link>
                    )}
                    <p className="ml-auto text-end text-xs xxl:!text-lg">
                      Support email:{" "}
                      <Link
                        className="text-blue-700 hover:!underline"
                        to={mailtoLink}
                      >
                        {import.meta.env.VITE_EMAIL_SUPPORT}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Footer variant={1}>
            {oneNotification && (
              <DeleteNotificationButton
                className="mr-3 mt-3"
                notificationId={oneNotification._id}
                onClick={handleNavigate}
              />
            )}
          </Footer>
        </div>
      ) : (
        status === "failed" &&
        !oneNotification && (
          <div className="flex h-full items-center">
            <ErrorMessage text={message} />
          </div>
        )
      )}
    </>
  );
};

export default Notification;
