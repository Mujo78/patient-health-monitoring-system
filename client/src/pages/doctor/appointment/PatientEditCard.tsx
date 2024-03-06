import React from "react";
import { useSelector } from "react-redux";
import { appointment } from "../../../features/appointment/appointmentSlice";
import { Button, Card } from "flowbite-react";
import CustomImg from "../../../components/UI/CustomImg";
import { Link } from "react-router-dom";
import { yearCalc } from "../../../service/personSideFunctions";

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
        <Card className="w-full xl:!ml-auto h-fit">
          <p className="text-blue-700 font-semibold hidden xl:block xxl:text-2xl">
            Patient
          </p>
          <div className="flex flex-col lg:!flex-row xl:!flex-col">
            <CustomImg
              url={selected?.patient_id.user_id.photo}
              className="mx-auto w-20 lg:!w-52 xxl:!w-80 h-auto rounded-xl"
            />
            <div className="flex-grow">
              <div className="flex flex-col text-sm xxl:!text-2xl gap-1 xl:!gap-4 xxl:!gap-8">
                <Link
                  to={`/my-patients/${selected?.patient_id?._id}`}
                  className="text-xl xxl:!text-2xl font-bold text-center lg:!text-start xl:!text-center"
                >
                  {selected?.patient_id.first_name +
                    " " +
                    selected?.patient_id.last_name}
                </Link>
                <p className="text-gray-500 hidden">Details</p>
                <hr />
                <p className="flex text-gray-500 justify-between">
                  <span>Age :</span>
                  <span className="ml-auto text-black">
                    {yearCalc(selected.patient_id.date_of_birth)}
                  </span>
                </p>
                <p className="flex text-gray-500 justify-between">
                  <span>Address :</span>
                  <span className="ml-auto text-black">
                    {selected?.patient_id.address}
                  </span>
                </p>
                <p className="flex text-gray-500 justify-between">
                  <span>Blood type :</span>
                  <span className="ml-auto text-black">
                    {selected?.patient_id.blood_type}
                  </span>
                </p>
                {selected?.patient_id.height && (
                  <p className="flex text-gray-500 justify-between">
                    <span>Height (m) :</span>
                    <span className="ml-auto text-black">
                      {selected?.patient_id.height}
                    </span>
                  </p>
                )}
                {selected?.patient_id.weight && (
                  <p className="flex text-gray-500 justify-between">
                    <span>Weight (kg) :</span>
                    <span className="ml-auto text-black">
                      {selected?.patient_id.weight}
                    </span>
                  </p>
                )}
                <p className="flex text-gray-500 justify-between">
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
                className="focus:!ring-gray-100 w-full mt-1 xl:!mt-2 md:!mt-0"
              >
                <p className="text-sm xxl:!text-xl">See more</p>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default PatientEditCard;
