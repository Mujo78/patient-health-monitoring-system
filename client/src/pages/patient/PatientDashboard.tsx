import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  formatDate,
  formatStartEnd,
  getLatestFinished,
  latestFinishedType,
} from "../../service/appointmentSideFunctions";
import { useSelector } from "react-redux";
import { appointment } from "../../features/appointment/appointmentSlice";
import { useAppDispatch } from "../../app/hooks";
import CustomImg from "../../components/UI/CustomImg";
import { useNavigate } from "react-router-dom";
import { authUser, firstTime } from "../../features/auth/authSlice";
import AppointmentsChart from "../../components/Patient/AppointmentsChart";
import AppointmentReviewCalendar from "../../components/Appointment/AppointmentReviewCalendar";
import useSelectedPage from "../../hooks/useSelectedPage";
import { yearCalc } from "../../service/personSideFunctions";
import CustomSpinner from "../../components/UI/CustomSpinner";

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [latestFinished, setLatestFinished] = useState<latestFinishedType>();
  const [loading, setLoading] = useState<boolean>(false);
  const { accessUser } = useSelector(authUser);

  const { status } = useSelector(appointment);
  const dispatch = useAppDispatch();

  useSelectedPage("Dashboard");

  useEffect(() => {
    if (accessUser && !accessUser.data.first) {
      dispatch(firstTime());
    }
  }, [dispatch, accessUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (accessUser) {
          const response = await getLatestFinished(accessUser.token);
          setLatestFinished(response);
        }
      } catch (err: any) {
        throw new Error(err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessUser]);

  const handleNavigateApp = () => {
    if (latestFinished && latestFinished.appointment) {
      navigate(`/my-appointments/${latestFinished.appointment._id}`);
    }
  };

  return (
    <>
      {loading || status === "loading" ? (
        <CustomSpinner size="xl" />
      ) : (
        <div className="flex flex-col xl:!flex-row duration-300 transition-all gap-3 xl:!gap-10 justify-between h-full w-full p-1 sm:!p-3 xxl:!p-6">
          <div className="flex flex-col flex-grow w-full gap-3 xl:!gap-6 xxl:!gap-12">
            <div className="w-full flex flex-col gap-2 xl:!gap-4 md:flex-row flex-grow justify-between">
              {latestFinished && (
                <Card
                  className="w-full xl:!max-w-md xxl:!max-w-2xl h-auto"
                  href={`/profile/p/${latestFinished.patient._id}`}
                >
                  <p className="text-blue-700 font-semibold text-md xxl:text-2xl">
                    Patient
                  </p>
                  <div className="flex flex-col gap-4 xxl:!gap-7 my-auto">
                    <h1 className="text-md xxl:!text-3xl font-bold text-center">
                      {latestFinished?.patient.first_name +
                        " " +
                        latestFinished?.patient.last_name}
                    </h1>
                    <p className="text-gray-500 xxl:!text-xl">Details</p>
                    <hr />
                    <div className="text-xs xxl:!text-lg flex flex-col gap-4 xxl:!gap-8">
                      <p className="flex text-gray-500 justify-between">
                        <span>Age :</span>
                        <span className="ml-auto text-black">
                          {yearCalc(latestFinished?.patient?.date_of_birth)}
                        </span>
                      </p>
                      <p className="flex text-gray-500 justify-between">
                        <span>Blood type :</span>
                        <span className="ml-auto text-black">
                          {latestFinished.patient.blood_type}
                        </span>
                      </p>
                      {latestFinished.patient.height && (
                        <p className="flex text-gray-500 justify-between">
                          <span>Height (m) :</span>
                          <span className="ml-auto text-black">
                            {Number(latestFinished.patient.height) / 100}{" "}
                          </span>
                        </p>
                      )}
                      {latestFinished.patient.weight && (
                        <p className="flex text-gray-500 justify-between">
                          <span>Weight (kg) :</span>
                          <span className="ml-auto text-black">
                            {latestFinished.patient.weight}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              )}
              <div className="flex flex-col gap-2 xl:!gap-4 xxl:!gap-8 w-full lg:!w-1/2 mx-auto justify-center h-full">
                <Card className="bg-gradient-to-r xl:!h-32 xxl:!h-48 from-blue-500 to-blue-400 ">
                  <div>
                    {accessUser?.data.first ? (
                      <div>
                        <h1 className="text-xl xxl:!text-3xl font-bold">
                          Welcome back, {accessUser?.info.first_name}!
                        </h1>
                        <p className="text-xs xxl:!text-lg mt-3">
                          Explore your health insights with the PHM System.
                          Let's make every day a healthier one.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-xl xxl:!text-3xl font-bold">
                          Welcome to the PHM System!
                        </h1>
                        <p className="text-xs xxl:!text-lg mt-3">
                          Discover a world of personalized health monitoring.
                          Take control of your health journey today
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
                <Card
                  onClick={handleNavigateApp}
                  className="cursor-pointer w-full"
                >
                  {latestFinished && latestFinished.appointment ? (
                    <div className="flex flex-wrap items-center">
                      <CustomImg
                        url={
                          latestFinished?.appointment?.doctor_id.user_id.photo
                        }
                        className="w-20 xl:!w-24 xxl:!w-40 mx-auto h-auto"
                      />
                      <div className="mx-auto">
                        <h1 className="md:text-lg lg:!text-xl xxl:!text-3xl font-semibold">
                          {latestFinished?.appointment?.doctor_id.first_name +
                            " " +
                            latestFinished?.appointment?.doctor_id.last_name}
                        </h1>
                        <p className="text-sm xxl:!text-lg">
                          {latestFinished?.appointment?.doctor_id.speciality}
                        </p>
                        <p className="text-xs xxl:!text-lg text-gray-700 mt-1">
                          {formatDate(
                            latestFinished?.appointment?.appointment_date
                          )}{" "}
                          (
                          {formatStartEnd(
                            latestFinished?.appointment?.appointment_date
                          )}
                          )
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 text-center">
                      <p className="text-sm text-gray-400">
                        No data available.
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
            <AppointmentsChart />
          </div>
          <div className="h-fit xl:!h-full w-full xl:!w-2/5 flex justify-end">
            <AppointmentReviewCalendar variant={1} />
          </div>
        </div>
      )}
    </>
  );
};

export default PatientDashboard;
