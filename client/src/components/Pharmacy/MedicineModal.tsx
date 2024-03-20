import React from "react";
import { Button, Modal } from "flowbite-react";
import CustomMedicineImg from "./CustomMedicineImg";
import { Medicine } from "../../features/medicine/medicineSlice";

type Props = {
  show: boolean;
  onClose: () => void;
  medicine: Medicine;
  url?: string;
};

const MedicineModal: React.FC<Props> = ({ show, onClose, medicine, url }) => {
  return (
    <Modal show={show} onClose={onClose} size="4xl" className="font-Poppins">
      <Modal.Header>
        {medicine?.name} - {medicine?.strength}
      </Modal.Header>
      <Modal.Body className="flex flex-col md:flex-row items-center justify-around">
        <CustomMedicineImg
          url={url ? url : ""}
          className=" w-52  xxl:!w-72 h-auto"
        />

        <div className="space-y-6  xxl:!text-2xl text-black">
          <p>
            <span className="font-semibold">Category:</span>{" "}
            {medicine?.category}
          </p>
          <p>
            <span className="font-semibold">About:</span>{" "}
            {medicine?.description}
          </p>
          <p>
            <span className="font-semibold">Manufacturer:</span>{" "}
            {medicine?.manufacturer}
          </p>
          <p className="ml-auto">
            <span className="font-semibold">Price:</span> {medicine?.price} BAM
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-between">
        <Button color="gray" onClick={onClose}>
          <p className=" xxl:!text-xl">Close</p>
        </Button>
        <p className="font-semibold  xxl:!text-xl">
          Available now:
          <span
            className={
              medicine?.available
                ? "text-green-500 font-bold"
                : "text-red-600 font-bold"
            }
          >
            {medicine?.available ? " Yes" : " No"}
          </span>
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicineModal;
