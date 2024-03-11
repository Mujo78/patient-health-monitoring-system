import { Card } from "flowbite-react";
import React from "react";
import CustomMedicineImg from "./CustomMedicineImg";
import { MedicineType } from "../../validations/medicineValidation";

type Props = {
  onClick: () => void;
  medicine: MedicineType;
  className?: string;
};

const MedicineCard: React.FC<Props> = ({ onClick, medicine, className }) => {
  return (
    <Card
      className={`h-auto w-full md:!w-1/3 my-2 md:!m-2 cursor-pointer hover:bg-gray-50 ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col gap-2 w-full justify-around">
        <CustomMedicineImg
          url={
            medicine.photo.startsWith(medicine.name)
              ? `http://localhost:3001/uploads/${medicine.photo}`
              : medicine.photo
          }
          className="mx-auto w-24  xxl:!w-44 h-auto"
        />
        <p className="text-xl  xxl:!text-3xl font-semibold">{medicine.name}</p>
        <p className="text-xs  xxl:!text-xl">{medicine.category}</p>
        <p className="text-md font-bold mt-auto xxl:!text-xl ml-auto">
          {medicine.available ? (
            <span className="text-green-800">{medicine.price} BAM</span>
          ) : (
            <span className="text-red-600">Not available</span>
          )}
        </p>
      </div>
    </Card>
  );
};

export default MedicineCard;
