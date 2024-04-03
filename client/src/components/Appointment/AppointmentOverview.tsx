import { ListGroup } from "flowbite-react";
import React, { useState } from "react";
import { appointment } from "../../features/appointment/appointmentSlice";
import { shallowEqual, useSelector } from "react-redux";
import ErrorMessage from "../UI/ErrorMessage";
import moment from "moment";
import MedicineModal from "../Pharmacy/MedicineModal";
import { Medicine } from "../../features/medicine/medicineSlice";

const AppointmentOverview: React.FC = () => {
  const [medicine, setMedicine] = useState<Medicine>();
  const [show, setShow] = useState<boolean>(false);
  const { selectedAppointment: sApp } = useSelector(appointment, shallowEqual);

  const onClose = () => {
    setShow(false);
  };

  const handleShowMedicine = (med: Medicine) => {
    setMedicine(med);
    setShow(true);
  };

  return (
    <>
      {sApp?.finished ? (
        <div className="flex h-full w-full flex-col flex-wrap justify-between gap-3 divide-gray-300 pb-6 lg:flex-row lg:gap-0 lg:pb-0 xl:!flex-nowrap xl:divide-x xxl:!text-xl">
          <div className="flex h-full w-full flex-grow flex-col lg:w-1/4">
            <h1 className="text-center">Diagnose</h1>
            <hr />
            <p className="p-4 text-justify text-xs text-gray-500 xxl:!text-xl">
              {sApp?.diagnose}
            </p>
          </div>
          <div className="flex h-full w-full flex-grow flex-col lg:w-1/4">
            <h1 className="text-center">Therapy</h1>
            <hr />
            <ListGroup className="rounded-none xxl:!text-xl">
              {sApp.therapy.map((n) => (
                <ListGroup.Item
                  className="rounded-none hover:text-blue-600"
                  key={n._id}
                  onClick={() => handleShowMedicine(n)}
                >
                  <p>
                    {n.name} - {n.strength}mg
                  </p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <div className="flex h-full w-full flex-grow flex-col lg:w-1/4">
            <h1 className="text-center">Other medicine</h1>
            <hr />
            <p className="p-4  text-justify text-xs text-gray-500 xxl:!text-xl">
              {sApp?.other_medicine}
            </p>
          </div>
          <div className="flex h-full w-full flex-grow flex-col pb-6 lg:w-1/4 lg:pb-0">
            <h1 className="text-center">Description</h1>
            <hr />
            <p className="p-4  text-justify text-xs text-gray-500 xxl:!text-xl">
              {sApp?.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex h-80 flex-col items-center justify-center gap-6 text-center md:!gap-0 md:text-balance">
          <ErrorMessage
            className="xxl:!text-xl"
            text={`Your appointment date: ${moment(sApp?.appointment_date).format("DD/MM/YYYY")}`}
          />
          <p className="mt-2 text-xs text-gray-400 xxl:!mt-4 xxl:!text-xl">
            You will be able to see overview after doctor make it finished
          </p>
        </div>
      )}

      {medicine && (
        <MedicineModal show={show} medicine={medicine} onClose={onClose} />
      )}
    </>
  );
};

export default AppointmentOverview;
