import { Card } from "flowbite-react";
import React from "react";
import CustomSpinner from "../UI/CustomSpinner";
import CustomImg from "../UI/CustomImg";
import Header from "../UI/Header";
import { HiOutlineClock } from "react-icons/hi2";
import { DoctorType } from "../../service/departmentSideFunctions";

type Props = {
  loading: boolean;
  doctor: DoctorType;
};

const MakeAppointmentInfo: React.FC<Props> = ({ loading, doctor }) => {
  return (
    <div className="my-auto flex h-full flex-col justify-center gap-3 xl:!gap-12">
      <Card horizontal className="flex justify-center lg:mx-auto">
        {loading ? (
          <CustomSpinner size="md" />
        ) : (
          <div className="flex items-center justify-around gap-4">
            <CustomImg
              url={doctor.user_id.photo}
              className=" h-auto w-16 lg:w-24 xxl:w-40"
            />
            <div className="w-full">
              <h1 className="text-md mb-1 font-bold text-blue-700 xxl:text-3xl">
                Dr. {doctor.first_name + " " + doctor.last_name}
              </h1>
              <p className="line-clamp-2 text-xs xxl:!text-lg">{doctor.bio}</p>
            </div>
          </div>
        )}
      </Card>
      <div className="flex flex-col justify-around">
        <div className="mb-3">
          <Header text={doctor.speciality} size={1} position="start" />
          <div className="mt-1 flex items-center text-gray-600">
            <HiOutlineClock className="xxl:h-8 xxl:w-8" />
            <p className="ml-1 text-xs xxl:!text-xl">20min</p>
          </div>
        </div>
        <div className="divide-y text-xs text-gray-500 xxl:!text-xl">
          <p className="leading-4.5">
            With years of expertise and advanced training, our doctors are
            equipped to address a wide spectrum of health concerns. From routine
            check-ups to intricate medical cases, our team is dedicated to
            delivering precise diagnoses and effective treatment plans. Schedule
            an appointment now.
          </p>
          <div className="mt-3">
            <p className="mt-3 font-semibold">
              Before scheduling an appointment, please be aware of the
              following:
            </p>
            <ul className="ml-3 flex list-disc flex-col gap-3 p-2 leading-4 xxl:leading-8">
              <li>
                Your appointment is a one-to-one meeting with the doctor you
                have selected.
              </li>
              <li>
                Ensure that you have all required documentation ready to
                participate in the appointment.
              </li>
              <li>
                Prior to your appointment, you will receive an email
                notification.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeAppointmentInfo;
