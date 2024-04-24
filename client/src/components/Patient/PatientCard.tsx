import { Card } from "flowbite-react";
import React from "react";
import { Patient } from "../../features/medicine/medicineSlice";
import CustomImg from "../UI/CustomImg";
import { useNavigate } from "react-router-dom";
import { yearCalc } from "../../service/personSideFunctions";
import Header from "../UI/Header";
import NoDataAvailable from "../UI/NoDataAvailable";

type Props = {
  data?: Patient;
  variant: 1 | 2;
  className?: string;
};

const PatientCard: React.FC<Props> = ({ data, variant, className }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (data) {
      if (variant === 2) {
        navigate(`/my-patients/${data._id}`);
      } else {
        navigate(`/profile/p/${data._id}`);
      }
    }
  };
  return (
    <Card
      onClick={handleNavigate}
      className={` ${className} h-auto w-full cursor-pointer`}
    >
      {data ? (
        <>
          {variant === 1 && (
            <p className="mb-auto font-semibold text-blue-700">Patient</p>
          )}
          {variant === 2 && (
            <CustomImg
              url={data?.user_id?.photo}
              className="mx-auto h-auto w-20 xxl:!w-40"
            />
          )}
          <div className="mb-auto flex flex-col gap-3">
            <Header
              text={data.first_name + " " + data.last_name}
              bold
              size={1}
            />
            {variant === 1 && (
              <p className="text-gray-500 xxl:!text-lg">Details</p>
            )}
            <hr />
            <p className="flex justify-between text-sm text-gray-500 xxl:!text-xl">
              Age:
              <span className="ml-auto text-black">
                {yearCalc(data?.date_of_birth)}
              </span>
            </p>
            {variant === 1 && (
              <>
                <p className="flex justify-between text-sm text-gray-500 xxl:!text-xl">
                  Blood type :<span className="ml-auto text-black">A+</span>
                </p>
                {data?.height && (
                  <p className="flex justify-between text-sm text-gray-500 xxl:!text-xl">
                    Height (m) :
                    <span className="ml-auto text-black">{data.height}</span>
                  </p>
                )}
                {data?.weight && (
                  <p className="flex justify-between text-sm text-gray-500 xxl:!text-xl">
                    Weight (kg) :
                    <span className="ml-auto text-black">{data.weight}</span>
                  </p>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <NoDataAvailable />
      )}
    </Card>
  );
};

export default PatientCard;
