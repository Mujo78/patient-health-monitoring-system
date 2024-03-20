import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteOneNotification,
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

const Notification: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { oneNotification, status, message } = useSelector(notification);

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
      dispatch(markOneAsRead(oneNotification._id));
    }
  }, [dispatch, oneNotification]);

  const deleteOne = () => {
    if (oneNotification) {
      dispatch(deleteOneNotification(oneNotification._id)).then((action) => {
        if (typeof action === "object") {
          navigate("../");
        }
      });
    }
  };

  const mailtoLink = `mailto:${import.meta.env.VITE_EMAIL_SUPPORT}`;

  return (
    <>
      {status === "loading" ? (
        <CustomSpinner size="lg" />
      ) : oneNotification ? (
        <div className="w-full flex flex-col justify-between h-full">
          <div className="flex justify-center flex-col items-center h-full gap-3">
            {oneNotification?.name.startsWith("Welcome to the") ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <Logo />
                <h2 className="text-lg xxl:!text-2xl font-bold text-blue-700">
                  {oneNotification.name}
                </h2>
                <div className="flex flex-col w-2/3 gap-3">
                  <p className="text-xs xxl:!text-lg text-gray-600 text-justify ">
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
                  <p className="text-xs ml-auto xxl:!text-lg">
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
              <div className="flex flex-col h-full gap-6 justify-center items-center">
                <h2
                  className={`${
                    oneNotification?.type === "ALERT"
                      ? "text-red-600"
                      : "text-green-600"
                  } font-bold text-lg xxl:!text-2xl`}
                >
                  {oneNotification?.name}
                </h2>
                <div className="w-2/3 gap-3">
                  <p className="text-sm xxl:!text-lg text-justify text-gray-600">
                    {oneNotification?.content}
                  </p>
                  <div className="flex justify-between w-full mt-2">
                    {oneNotification?.link && (
                      <Link
                        to={oneNotification?.link}
                        className="text-md xxl:!text-lg underline text-green-600"
                      >
                        See Appointment Results
                      </Link>
                    )}
                    <p className="text-xs xxl:!text-lg ml-auto text-end">
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
            <DeleteNotificationButton
              className="mr-3 mt-3"
              onClick={deleteOne}
            />
          </Footer>
        </div>
      ) : (
        status === "failed" &&
        !oneNotification && (
          <div className="h-full flex items-center text-md xxl:!text-2xl">
            <p>{message || "Something went wrong, please try again later!"}</p>
          </div>
        )
      )}
    </>
  );
};

export default Notification;
