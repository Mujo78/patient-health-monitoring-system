import { Card } from "flowbite-react";
import React, { useEffect } from "react";
import {
  getDateTime,
  latestFinishedType,
} from "../../../service/appointmentSideFunctions";
import { shallowEqual, useSelector } from "react-redux";
import CustomImg from "../../../components/UI/CustomImg";
import { useNavigate } from "react-router-dom";
import { authUser } from "../../../features/auth/authSlice";

const AppointmentsChart = React.lazy(
  () => import("../../../components/Patient/AppointmentsChart"),
);
const AppointmentReviewCalendar = React.lazy(
  () => import("../../../components/Appointment/AppointmentReviewCalendar"),
);

import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import Header from "../../../components/UI/Header";
import PatientCard from "../../../components/Patient/PatientCard";
import NoDataAvailable from "../../../components/UI/NoDataAvailable";
import toast from "react-hot-toast";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import useAPI from "../../../hooks/useAPI";

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { accessUser } = useSelector(authUser, shallowEqual);

  useSelectedPage("Dashboard");

  const {
    error,
    setError,
    loading,
    data: latestFinished,
  } = useAPI<latestFinishedType>("/appointment/", {
    checkData: true,
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleNavigateApp = () => {
    if (latestFinished && latestFinished.appointment) {
      navigate(`/my-appointments/${latestFinished.appointment._id}`);
    }
  };

  return (
    <>
      {loading ? (
        <CustomSpinner size="xl" />
      ) : latestFinished ? (
        <div className="flex h-full w-full flex-col justify-between gap-3 p-1 transition-all duration-300 sm:!p-3 xl:!flex-row xl:!gap-10 xxl:!p-6">
          <div className="flex w-full flex-grow flex-col gap-3 xl:!gap-6 xxl:!gap-12">
            <div className="flex w-full flex-grow flex-col justify-between gap-2 md:flex-row xl:!gap-4">
              <PatientCard
                data={latestFinished?.patient}
                variant={1}
                className="xl:!max-w-md xxl:!max-w-2xl"
              />

              <div className="mx-auto flex h-full w-full flex-col justify-center gap-2 lg:!w-1/2 xl:!gap-4 xxl:!gap-8">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-400 xl:!h-32 xxl:!h-48 ">
                  <div>
                    {accessUser?.data?.first ? (
                      <div>
                        <Header
                          text={`Welcome back, ${accessUser?.info?.first_name}`}
                          bold
                          position="start"
                          size={2}
                        />
                        <p className="mt-3 text-xs xxl:!text-lg">
                          Explore your health insights with the PHM System.
                          Let's make every day a healthier one.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <Header
                          text="Welcome to the PHM System!"
                          bold
                          size={2}
                          position="start"
                        />
                        <p className="mt-3 text-xs xxl:!text-lg">
                          Discover a world of personalized health monitoring.
                          Take control of your health journey today
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card
                  onClick={handleNavigateApp}
                  className="w-full cursor-pointer"
                >
                  {latestFinished && latestFinished?.appointment ? (
                    <div className="flex flex-wrap items-center">
                      <CustomImg
                        url={
                          latestFinished?.appointment?.doctor_id?.user_id?.photo
                        }
                        className="mx-auto h-auto w-20 xl:!w-24 xxl:!w-40"
                      />
                      <div className="mx-auto">
                        <Header
                          text={
                            latestFinished?.appointment?.doctor_id?.first_name +
                            " " +
                            latestFinished?.appointment?.doctor_id?.last_name
                          }
                          position="start"
                          size={1}
                        />

                        <p className="text-sm xxl:!text-lg">
                          {latestFinished?.appointment?.doctor_id?.speciality}
                        </p>
                        <p className="mt-1 text-xs text-gray-700 xxl:!text-lg">
                          {getDateTime(
                            latestFinished?.appointment?.appointment_date,
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <NoDataAvailable />
                  )}
                </Card>
              </div>
            </div>
            {latestFinished && (
              <AppointmentsChart setError={setError} error={error} />
            )}
          </div>
          <div className="flex h-fit w-full justify-end xl:!h-full xl:!w-2/5">
            {latestFinished && <AppointmentReviewCalendar variant={1} />}
          </div>
        </div>
      ) : error ? (
        <div className="flex h-full w-full items-center justify-center">
          <ErrorMessage text={error} />
        </div>
      ) : (
        !error &&
        !loading &&
        !latestFinished && (
          <div className="flex h-full w-full items-center justify-center ">
            <NoDataAvailable />
          </div>
        )
      )}
    </>
  );
};

export default PatientDashboard;
