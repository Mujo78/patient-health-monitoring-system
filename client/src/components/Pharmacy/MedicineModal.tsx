import React from "react";
import { Button, Modal } from "flowbite-react";
import CustomMedicineImg from "./CustomMedicineImg";
import { Medicine } from "../../features/medicine/medicineSlice";

type Props = {
  show: boolean;
  onClose: () => void;
  medicine: Medicine;
};

const MedicineModal: React.FC<Props> = ({ show, onClose, medicine }) => {
  const URLToUse = medicine?.photo?.startsWith(medicine.name)
    ? `http://localhost:3001/uploads/${medicine.photo}`
    : medicine?.photo;

  const isAvailable = medicine.available;

  return (
    <Modal show={show} onClose={onClose} size="4xl" className="font-Poppins">
      <Modal.Header>
        {medicine?.name} - {medicine?.strength}
      </Modal.Header>
      <Modal.Body className="flex flex-col items-center justify-around md:flex-row">
        <CustomMedicineImg
          url={URLToUse ?? ""}
          className="h-auto w-52 xxl:!w-72"
        />

        <div className="space-y-6 text-black xxl:!text-2xl">
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
          <p>
            <span className="font-semibold">Price:</span> {medicine?.price} BAM
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-between">
        <Button color="gray" onClick={onClose}>
          <p className="xxl:!text-lg">Close</p>
        </Button>
        <p className="font-semibold xxl:!text-xl">
          Available now:
          <span
            className={
              isAvailable
                ? "font-bold text-green-500"
                : "font-bold text-red-600"
            }
          >
            {isAvailable ? " Yes" : " No"}
          </span>
        </p>
      </Modal.Footer>
    </Modal>
  );
};

export default MedicineModal;
