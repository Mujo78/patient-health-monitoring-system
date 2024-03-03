import { Card, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  formatDate,
  formatStartEnd,
  getLatestFinished,
} from "../../service/appointmentSideFunctions";
import { useSelector } from "react-redux";
import {
  appointment,
  doctor_id,
  patient_id,
} from "../../features/appointment/appointmentSlice";
import { useAppDispatch } from "../../app/hooks";
import CustomImg from "../../components/UI/CustomImg";
import { useNavigate } from "react-router-dom";
import { authUser, firstTime } from "../../features/auth/authSlice";
import AppointmentsChart from "./AppointmentsChart";
import AppointmentReviewCalendar from "../../components/Appointment/AppointmentReviewCalendar";
import useSelectedPage from "../../hooks/useSelectedPage";
import { yearCalc } from "../../service/personSideFunctions";

type appointment = {
  _id: string;
  appointment_date: Date;
  doctor_id: doctor_id;
};

type latestFinishedType = {
  appointment: appointment | null;
  patient: patient_id;
};

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

  //console.log(object);

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
        <div className="h-full w-full flex justify-center items-center">
          <Spinner size="xl" />
        </div>
      ) : (
        <div className="flex duration-300 transition-all justify-between h-full w-full p-3">
          <div className="flex flex-col flex-grow w-full justify-between">
            <div className="w-full flex flex-grow justify-between">
              {latestFinished && (
                <Card
                  className="w-96 h-auto"
                  href={`/profile/p/${latestFinished.patient._id}`}
                >
                  <p className="text-blue-700 font-semibold">Patient</p>
                  <h1 className="text-md font-bold text-center">
                    {latestFinished?.patient.first_name +
                      " " +
                      latestFinished?.patient.last_name}
                  </h1>
                  <p className="text-gray-500">Details</p>
                  <hr />
                  <p className="flex text-xs text-gray-500 justify-between">
                    <span>Age :</span>
                    <span className="ml-auto text-black">
                      {yearCalc(latestFinished?.patient?.date_of_birth)}
                    </span>
                  </p>
                  <p className="flex text-xs text-gray-500 justify-between">
                    <span>Blood type :</span>
                    <span className="ml-auto text-black">
                      {latestFinished.patient.blood_type}
                    </span>
                  </p>
                  {latestFinished.patient.height && (
                    <p className="flex text-xs text-gray-500 justify-between">
                      <span>Height (m) :</span>
                      <span className="ml-auto text-black">
                        {Number(latestFinished.patient.height) / 100}{" "}
                      </span>
                    </p>
                  )}
                  {latestFinished.patient.weight && (
                    <p className="flex text-xs text-gray-500 justify-between">
                      <span>Weight (kg) :</span>
                      <span className="ml-auto text-black">
                        {latestFinished.patient.weight}
                      </span>
                    </p>
                  )}
                </Card>
              )}
              <div className=" flex flex-col w-1/2 mx-auto pb-5 justify-around h-full">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-400 ">
                  <div>
                    {accessUser?.data.first ? (
                      <div>
                        <h1 className="text-xl font-bold">
                          Welcome back, {accessUser?.info.first_name}!
                        </h1>
                        <p className="text-xs mt-3">
                          Explore your health insights with the PHM System.
                          Let's make every day a healthier one.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-xl font-bold">
                          Welcome to the PHM System!
                        </h1>
                        <p className="text-xs mt-3">
                          Discover a world of personalized health monitoring.
                          Take control of your health journey today
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
                <Card onClick={handleNavigateApp} className="cursor-pointer">
                  {latestFinished && latestFinished.appointment ? (
                    <div className="flex items-center">
                      <CustomImg
                        url={
                          latestFinished?.appointment?.doctor_id.user_id.photo
                        }
                        width="75px"
                      />
                      <div className="mx-auto">
                        <h1 className="text-xl font-semibold">
                          {latestFinished?.appointment?.doctor_id.first_name +
                            " " +
                            latestFinished?.appointment?.doctor_id.last_name}
                        </h1>
                        <p className="text-sm">
                          {latestFinished?.appointment?.doctor_id.speciality}
                        </p>
                        <p className="text-xs text-gray-700 mt-1">
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
          <div className=" h-full w-2/5 flex justify-end">
            <AppointmentReviewCalendar variant={1} />
          </div>
        </div>
      )}
    </>
  );
};

export default PatientDashboard;
