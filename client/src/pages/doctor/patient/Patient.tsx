import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../../components/UI/Footer";
import CustomImg from "../../../components/UI/CustomImg";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { yearCalc } from "../../../service/personSideFunctions";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import { getPatient } from "../../../service/patientSideFunctions";
import { patient_id } from "../../../features/appointment/appointmentSlice";
import PatientFinishedAppointments from "../../../components/Patient/PatientFinishedAppointments";
import Header from "../../../components/UI/Header";

const Patient: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [patient, setPatient] = useState<patient_id>();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await getPatient(id);
          setPatient(response);
        } catch (err: any) {
          setMessage(err?.response?.data ?? err?.message);
          throw new Error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="h-full w-full">
      {loading ? (
        <CustomSpinner size="lg" />
      ) : patient ? (
        <div className="flex h-full w-full flex-wrap gap-4 px-4 lg:!flex-nowrap lg:!gap-16">
          <div className="flex h-fit w-full flex-grow flex-col lg:!my-auto lg:!h-full xl:!w-2/4">
            <div className="my-auto flex h-fit w-full flex-col gap-4">
              <div className="flex w-full flex-col flex-wrap items-center justify-center text-center md:w-full md:flex-row md:gap-8 lg:!gap-3">
                <CustomImg
                  url={patient.user_id?.photo}
                  className="h-auto w-28 md:w-32 xxl:w-44"
                />
                <div className="flex w-fit flex-col gap-1.5 text-center">
                  <Header
                    size={1}
                    text={patient.first_name + " " + patient.last_name}
                  />
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
              <div className="flex h-full flex-grow flex-col justify-center gap-4">
                <p className="hidden lg:block xxl:!text-xl">Details</p>
                <hr className="hidden lg:block" />
                <p className="flex justify-between text-sm text-gray-500 xxl:!text-lg">
                  Date of birth :
                  <span className="text-black">
                    {patient.date_of_birth.toString()}
                  </span>
                </p>
                <p className="flex justify-between text-sm text-gray-500 xxl:!text-lg">
                  Address :<span className="text-black">{patient.address}</span>
                </p>
                <p className="flex justify-between text-sm text-gray-500 xxl:!text-lg">
                  Blood type :
                  <span className="text-black">{patient.blood_type}</span>
                </p>
                {patient.height && (
                  <p className="flex justify-between text-sm text-gray-500 xxl:!text-lg">
                    Height (m) :
                    <span className="text-black">
                      {Number(patient.height) / 100}
                    </span>
                  </p>
                )}
                {patient.weight && (
                  <p className="flex justify-between text-sm text-gray-500 xxl:!text-lg">
                    Weight (kg) :
                    <span className="text-black">{patient.weight}</span>
                  </p>
                )}
                <p className="flex justify-between text-sm text-gray-500 xxl:!text-lg">
                  Gender :<span className="text-black">{patient.gender}</span>
                </p>
              </div>
            </div>
            <Footer variant={2} className="hidden lg:block" />
          </div>

          <PatientFinishedAppointments patient={patient} />
        </div>
      ) : (
        <div className="mt-12 text-center">
          <ErrorMessage text={message} />
        </div>
      )}
    </div>
  );
};

export default Patient;
