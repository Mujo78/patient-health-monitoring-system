import { Card } from "flowbite-react";
import React from "react";
import { Patient } from "../../features/medicine/medicineSlice";
import CustomImg from "../UI/CustomImg";
import { useLocation, useNavigate } from "react-router-dom";
import { yearCalc } from "../../service/personSideFunctions";

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
      className={` ${className} w-full md:!w-2/5 xxl:!w-1/4 md:!flex-grow-0 h-auto ${
        variant === 2 && "cursor-pointer"
      }`}
    >
      {variant === 1 && <p className="text-blue-700 font-semibold">Patient</p>}
      {variant === 2 && (
        <CustomImg
          url={data?.user_id?.photo}
          className="mx-auto w-20 xxl:!w-40 h-auto"
        />
      )}
      <h1 className="text-xl xxl:!text-2xl font-bold text-center">
        {data.first_name + " " + data.last_name}
      </h1>
      {variant === 1 && <p className="text-gray-500">Details</p>}
      <hr />
      <p className="flex text-sm xxl:!text-xl text-gray-500 justify-between">
        Age:
        <span className="ml-auto text-black">
          {yearCalc(data?.date_of_birth)}
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
