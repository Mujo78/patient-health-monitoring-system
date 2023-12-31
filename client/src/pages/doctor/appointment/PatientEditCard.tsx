import React from "react";
import { useSelector } from "react-redux";
import { appointment } from "../../../features/appointment/appointmentSlice";
import { Button, Card } from "flowbite-react";
import CustomImg from "../../../components/UI/CustomImg";
import moment from "moment";
import { Link } from "react-router-dom";

type Props = {
  setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
};

const PatientEditCard: React.FC<Props> = ({ setShowMore }) => {
  const { selectedAppointment: selected } = useSelector(appointment);

  const showMore = () => {
    setShowMore(true);
  };

  return (
    <>
      {selected && (
        <Card className="max-w-xs h-fit ml-auto">
          <p className="text-blue-700 font-semibold">Patient</p>
          <CustomImg
            url={selected?.patient_id.user_id.photo}
            className="mx-auto rounded-xl"
            width="150"
          />
          <Link
            to={`/my-patients/${selected?.patient_id?._id}`}
            className="text-xl font-bold text-center"
          >
            {selected?.patient_id.first_name +
              " " +
              selected?.patient_id.last_name}
          </Link>
          <p className="text-gray-500">Details</p>
          <hr />
          <p className="flex text-sm text-gray-500 justify-between">
            <span>Age :</span>
            <span className="ml-auto text-black">
              {moment().diff(
                moment(new Date(selected.patient_id.date_of_birth)),
                "years"
              )}
            </span>
          </p>
          <p className="flex text-sm text-gray-500 justify-between">
            <span>Address :</span>
            <span className="ml-auto text-black">
              {selected?.patient_id.address}
            </span>
          </p>
          <p className="flex text-sm text-gray-500 justify-between">
            <span>Blood type :</span>
            <span className="ml-auto text-black">
              {selected?.patient_id.blood_type}
            </span>
          </p>
          {selected?.patient_id.height && (
            <p className="flex text-sm text-gray-500 justify-between">
              <span>Height (m) :</span>
              <span className="ml-auto text-black">
                {selected?.patient_id.height}
              </span>
            </p>
          )}
          {selected?.patient_id.weight && (
            <p className="flex text-sm text-gray-500 justify-between">
              <span>Weight (kg) :</span>
              <span className="ml-auto text-black">
                {selected?.patient_id.weight}
              </span>
            </p>
          )}
          <p className="flex text-sm text-gray-500 justify-between">
            <span>Gender :</span>
            <span className="ml-auto text-black">
              {selected?.patient_id.gender}
            </span>
          </p>
          <hr />
          <Button
            color="light"
            onClick={showMore}
            className="focus:!ring-gray-100"
          >
            See more
          </Button>
        </Card>
      )}
    </>
  );
};

export default PatientEditCard;
