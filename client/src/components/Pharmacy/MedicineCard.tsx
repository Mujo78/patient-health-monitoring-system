import { Card } from "flowbite-react";
import React from "react";
import CustomMedicineImg from "./CustomMedicineImg";
import { MedicineType } from "../../features/medicine/medicineSlice";

type Props = {
  onClick: () => void;
  medicine: MedicineType;
  className?: string;
};

const MedicineCard: React.FC<Props> = ({ onClick, medicine, className }) => {
  return (
    <Card
      className={`my-2 h-auto w-full cursor-pointer hover:bg-gray-50 md:!m-2 md:!w-1/3 ${className}`}
      onClick={onClick}
    >
      <div className="flex w-full flex-col justify-around gap-2">
        <CustomMedicineImg
          url={
            medicine.photo.startsWith(medicine.name)
              ? `http://localhost:3001/uploads/${medicine.photo}`
              : medicine.photo
          }
          className="mx-auto h-auto  w-24 rounded-full xxl:!w-44"
        />
        <p className="text-xl  font-semibold xxl:!text-3xl">{medicine.name}</p>
        <p className="text-xs  xxl:!text-xl">{medicine.category}</p>
        <p className="text-md ml-auto mt-auto font-bold xxl:!text-xl">
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
