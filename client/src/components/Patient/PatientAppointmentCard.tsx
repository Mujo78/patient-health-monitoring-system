import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Appointment,
  appointment,
} from "../../features/appointment/appointmentSlice";
import { Button, Card } from "flowbite-react";
import CustomImg from "../UI/CustomImg";
import { Link } from "react-router-dom";
import { yearCalc } from "../../service/personSideFunctions";
import { getLatestAppointment } from "../../service/appointmentSideFunctions";
import PatientModal from "./PatientModal";

const PatientAppointmentCard: React.FC = () => {
  const [more, setMore] = useState<boolean>(false);
  const [latestAppState, setLatestAppState] = useState<Appointment>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const { selectedAppointment: selected } = useSelector(
    appointment,
    shallowEqual,
  );

  useEffect(() => {
    const fetchData = async () => {
      if (selected?._id) {
        try {
          setLoading(true);
          const response = await getLatestAppointment(selected._id);
          setLatestAppState(response);
        } catch (error: any) {
          setError(error?.response?.data ?? error?.message);
          throw new Error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [selected?._id]);

  const showMore = () => {
    setMore(true);
  };

  return (
    <>
      {selected && (
        <>
          <Card className="h-fit w-full xl:!ml-auto">
            <p className="hidden font-semibold text-blue-700 xl:block xxl:text-2xl">
              Patient
            </p>
            <div className="flex flex-col lg:!flex-row xl:!flex-col">
              <CustomImg
                url={selected?.patient_id.user_id.photo}
                className="mx-auto h-auto w-20 rounded-xl lg:!w-52 xxl:!w-80"
              />
              <div className="flex-grow">
                <div className="flex flex-col gap-1 text-sm xl:!gap-4 xxl:!gap-8 xxl:!text-2xl">
                  <Link
                    to={`/my-patients/${selected?.patient_id?._id}`}
                    className="text-center text-xl font-bold lg:!text-start xl:!text-center xxl:!text-2xl"
                  >
                    {selected?.patient_id.first_name +
                      " " +
                      selected?.patient_id.last_name}
                  </Link>
                  <p className="hidden text-gray-500">Details</p>
                  <hr />
                  <p className="flex justify-between text-gray-500">
                    <span>Age :</span>
                    <span className="ml-auto text-black">
                      {yearCalc(selected.patient_id.date_of_birth)}
                    </span>
                  </p>
                  <p className="flex justify-between text-gray-500">
                    <span>Address :</span>
                    <span className="ml-auto text-black">
                      {selected?.patient_id.address}
                    </span>
                  </p>
                  <p className="flex justify-between text-gray-500">
                    <span>Blood type :</span>
                    <span className="ml-auto text-black">
                      {selected?.patient_id.blood_type}
                    </span>
                  </p>
                  {selected?.patient_id.height && (
                    <p className="flex justify-between text-gray-500">
                      <span>Height (m) :</span>
                      <span className="ml-auto text-black">
                        {selected?.patient_id.height}
                      </span>
                    </p>
                  )}
                  {selected?.patient_id.weight && (
                    <p className="flex justify-between text-gray-500">
                      <span>Weight (kg) :</span>
                      <span className="ml-auto text-black">
                        {selected?.patient_id.weight}
                      </span>
                    </p>
                  )}
                  <p className="flex justify-between text-gray-500">
                    <span>Gender :</span>
                    <span className="ml-auto text-black">
                      {selected?.patient_id.gender}
                    </span>
                  </p>
                </div>
                <hr />
                <Button
                  color="light"
                  onClick={showMore}
                  className="mt-1 w-full focus:!ring-gray-100 md:!mt-0 xl:!mt-2"
                >
                  <p className="text-sm xxl:!text-lg">See more</p>
                </Button>
              </div>
            </div>
          </Card>
          <PatientModal
            variant={1}
            error={error}
            loading={loading}
            latestAppState={latestAppState}
            setMore={setMore}
            more={more}
          />
        </>
      )}
    </>
  );
};

export default PatientAppointmentCard;
