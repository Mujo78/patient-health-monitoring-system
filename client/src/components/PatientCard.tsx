import { Card } from "flowbite-react";
import React from "react";
import { Patient } from "../features/medicine/medicineSlice";
import CustomImg from "./UI/CustomImg";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  data: Patient;
  variant: 1 | 2;
  className?: string;
};

const PatientCard: React.FC<Props> = ({ data, variant, className }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (variant === 2) {
      localStorage.setItem("route", location.pathname + "" + location.search);
      navigate(`/my-patients/${data._id}`);
    }
  };
  return (
    <Card
      onClick={handleNavigate}
      className={` ${className} max-w-[290px] w-full font-Poppins h-fit ${
        variant === 2 && "cursor-pointer"
      }`}
    >
      {variant === 1 && <p className="text-blue-700 font-semibold">Patient</p>}
      {variant === 2 && (
        <CustomImg url={data?.user_id?.photo} className="mx-auto" width="70" />
      )}
      <h1 className="text-xl font-bold text-center">
        {data.first_name + " " + data.last_name}
      </h1>
      {variant === 1 && <p className="text-gray-500">Details</p>}
      <hr />
      <p className="flex text-sm text-gray-500 justify-between">
        <span>Age :</span>
        <span className="ml-auto text-black">
          {moment().diff(moment(data.date_of_birth), "years")}
        </span>
      </p>
      {variant === 1 && (
        <>
          <p className="flex text-sm text-gray-500 justify-between">
            <span>Blood type :</span>
            <span className="ml-auto text-black">A+</span>
          </p>
          <p className="flex text-sm text-gray-500 justify-between">
            <span>Height (m) :</span>
            <span className="ml-auto text-black">1.70</span>
          </p>
          <p className="flex text-sm text-gray-500 justify-between">
            <span>Weight (kg) :</span>
            <span className="ml-auto text-black">60</span>
          </p>
        </>
      )}
    </Card>
  );
};

export default PatientCard;
