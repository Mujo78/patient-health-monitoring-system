import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../../components/UI/Footer";
import CustomImg from "../../../components/UI/CustomImg";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { useSelector } from "react-redux";
import { authUser } from "../../../features/auth/authSlice";
import { yearCalc } from "../../../service/personSideFunctions";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import { getPatient } from "../../../service/patientSideFunctions";
import { patient_id } from "../../../features/appointment/appointmentSlice";
import PatientFinishedAppointments from "../../../components/Patient/PatientFinishedAppointments";

const Patient: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [patient, setPatient] = useState<patient_id>();
  const { accessUser } = useSelector(authUser);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (id && accessUser) {
        try {
          setLoading(true);
          const response = await getPatient(accessUser.token, id);
          setPatient(response);
        } catch (err: any) {
          setMessage(err.response?.data);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, accessUser]);

  return (
    <div className="h-full w-full">
      {loading ? (
        <CustomSpinner size="lg" />
      ) : patient ? (
        <div className="flex flex-wrap gap-4 h-full lg:!gap-12 lg:!flex-nowrap w-full px-4">
          <div className="flex flex-grow h-fit lg:!h-full w-full lg:!my-auto lg:!w-fit xl:!w-full flex-col">
            <div className="w-full h-fit my-auto flex flex-col gap-4">
              <div className="flex flex-col flex-wrap text-center items-center justify-center w-full md:flex-row md:w-full md:gap-8 lg:!gap-3">
                <CustomImg
                  url={patient.user_id?.photo}
                  className="w-28 md:w-32 xxl:w-44 h-auto"
                />
                <div className="text-center flex flex-col w-fit gap-1.5">
                  <p className="text-xl xxl:!text-3xl font-semibold">
                    {patient.first_name + " " + patient.last_name}
                  </p>
                  <p className="text-sm md:text-end xxl:!text-xl">
                    {yearCalc(patient.date_of_birth)} years old
                  </p>
                  <Link
                    to={`mailto:${patient.user_id?.email}`}
                    className="text-sm text-blue-700 xxl:!text-xl"
                  >
                    {patient.user_id?.email}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col h-full justify-center gap-4 flex-grow">
                <p className="hidden lg:block xxl:!text-xl">Details</p>
                <hr className="hidden lg:block" />
                <p className="flex text-sm xxl:!text-lg text-gray-500 justify-between">
                  <span>Date of birth :</span>
                  <span className="text-black">
                    {patient.date_of_birth.toString()}
                  </span>
                </p>
                <p className="flex text-sm text-gray-500 xxl:!text-lg justify-between">
                  <span>Address :</span>
                  <span className="text-black">{patient.address}</span>
                </p>
                <p className="flex text-sm text-gray-500 xxl:!text-lg justify-between">
                  <span>Blood type :</span>
                  <span className="text-black">{patient.blood_type}</span>
                </p>
                {patient.height && (
                  <p className="flex text-sm xxl:!text-lg text-gray-500 justify-between">
                    <span>Height (m) :</span>
                    <span className="text-black">
                      {Number(patient.height) / 100}
                    </span>
                  </p>
                )}
                {patient.weight && (
                  <p className="flex text-sm xxl:!text-lg text-gray-500 justify-between">
                    <span>Weight (kg) :</span>
                    <span className="text-black">{patient.weight}</span>
                  </p>
                )}
                <p className="flex text-sm xxl:!text-lg text-gray-500 justify-between">
                  <span>Gender :</span>
                  <span className="text-black">{patient.gender}</span>
                </p>
              </div>
            </div>
            <Footer variant={2} className="hidden lg:block" />
          </div>

          <PatientFinishedAppointments patient={patient} />
        </div>
      ) : (
        <div className="text-center mt-12">
          <ErrorMessage
            className="text-sm md:!text-md xl:!text-lg xxl:!text-2xl"
            text={message || "Something went wrong, please try again later."}
            size="md"
          />
        </div>
      )}
    </div>
  );
};

export default Patient;
