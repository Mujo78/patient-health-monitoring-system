import React from "react";
import ErrorMessage from "../UI/ErrorMessage";
import { Button, Modal } from "flowbite-react";
import {
  formatDate,
  formatStartEnd,
  modalDataType,
} from "../../service/appointmentSideFunctions";
import { Link } from "react-router-dom";
import { yearCalc } from "../../service/personSideFunctions";
import CustomSpinner from "../UI/CustomSpinner";

type Props = {
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
  latestAppState: modalDataType | undefined;
  loading: boolean;
  error?: string;
  variant: 1 | 2;
};

const PatientModal: React.FC<Props> = ({
  more,
  variant,
  latestAppState,
  setMore,
  error,
  loading,
}) => {
  const handleClose = () => {
    setMore(false);
  };

  return (
    <Modal
      show={more}
      size="7xl"
      className="font-Poppins"
      position="center-right"
      onClose={handleClose}
    >
      <Modal.Header>
        {latestAppState && (
          <p className="text-sm md:!text-lg lg:!text-xl xxl:!text-3xl">
            {latestAppState.patient_id.first_name +
              " " +
              latestAppState.patient_id.last_name +
              " (" +
              formatDate(latestAppState.appointment_date) +
              ")"}
          </p>
        )}
      </Modal.Header>
      <Modal.Body id="content">
        <div className="h-full pb-4">
          {loading ? (
            <div className="h-full">
              <CustomSpinner />
            </div>
          ) : latestAppState ? (
            <div className="flex h-full flex-col justify-evenly">
              <div className="my-auto flex flex-wrap justify-between divide-y rounded-lg border p-1 text-center md:!divide-x md:!divide-y-0 md:!text-start xxl:text-2xl">
                <div className="w-full divide-y md:!w-2/4">
                  <p>
                    <span className="hidden font-semibold md:!inline-block">
                      Name:
                    </span>{" "}
                    {latestAppState.patient_id.first_name +
                      " " +
                      latestAppState.patient_id.last_name}
                  </p>
                  <p>
                    <span className="hidden font-semibold md:!inline-block">
                      Date of birth:
                    </span>{" "}
                    {latestAppState.patient_id.date_of_birth.toString()}
                  </p>
                  <p>
                    <span className="hidden font-semibold md:!inline-block">
                      Blood type:
                    </span>{" "}
                    {latestAppState.patient_id.blood_type}
                  </p>
                </div>
                <div className="w-full divide-y md:!w-2/4 md:pl-1">
                  <p>
                    <span className="hidden font-semibold md:!inline-block">
                      Gender:
                    </span>{" "}
                    {latestAppState.patient_id.gender}
                  </p>
                  <p>
                    <span className="hidden font-semibold md:!inline-block">
                      Age:
                    </span>{" "}
                    {yearCalc(latestAppState?.patient_id.date_of_birth)}
                  </p>
                  <p>
                    <span className="hidden font-semibold md:!inline-block">
                      Address:
                    </span>{" "}
                    {latestAppState.patient_id.address}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h1 className="text-md mb-1 font-bold xxl:text-2xl">
                  Medical report
                </h1>
                <div className="flex flex-col gap-4 divide-y rounded-lg border p-2">
                  {latestAppState.reason.length !== 0 && (
                    <div className="text-sm xxl:!text-xl">
                      <h1 className="font-semibold">Reason</h1>
                      <p>{latestAppState.reason}</p>
                    </div>
                  )}
                  {latestAppState.diagnose.length !== 0 && (
                    <div className="text-sm xxl:!text-xl">
                      <h1 className="font-semibold">Diagnose</h1>
                      <p>{latestAppState.diagnose}</p>
                    </div>
                  )}
                  {latestAppState.therapy.length !== 0 && (
                    <div className="text-sm xxl:!text-xl">
                      <h1 className="font-semibold">Therapy</h1>
                      <div className="flex">
                        {latestAppState.therapy.map((n) => (
                          <p key={n._id} className="mr-2">
                            {n.name} - ({n.strength}),
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {latestAppState.other_medicine.length !== 0 && (
                    <div className="pt-2 text-sm xxl:!text-xl">
                      <h1 className="font-semibold">Other medicine</h1>
                      <p>{latestAppState.other_medicine}</p>
                    </div>
                  )}
                  {latestAppState.description.length !== 0 && (
                    <div className="pt-2 text-sm xxl:!text-xl">
                      <h1 className="font-semibold">Description</h1>
                      <p>{latestAppState.description}</p>
                    </div>
                  )}
                </div>
                <div className="mt-8 flex flex-col items-start justify-between gap-3 md:!flex-row md:!items-center">
                  <div className="text-sm xxl:!text-xl">
                    <p>
                      <span className="font-semibold">Date: </span>{" "}
                      {formatDate(latestAppState.appointment_date)}
                    </p>
                    <p>
                      <span className="font-semibold">Time: </span>{" "}
                      {formatStartEnd(latestAppState.appointment_date)}
                    </p>
                  </div>
                  {variant === 1 && (
                    <Link
                      className="text-sm text-blue-700 hover:underline xxl:!text-xl "
                      to={`/my-patients/${latestAppState.patient_id._id}`}
                    >
                      See patient history {"->"}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center pb-2 md:!pb-0">
              <ErrorMessage text={error} />
            </div>
          ) : (
            <div className="flex items-center justify-center pb-2 md:!pb-0">
              <ErrorMessage text="There are no record for this patient!" />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="hidden md:!flex">
        <Button className="ml-auto" color="gray" onClick={handleClose}>
          <p className="xxl:!text-lg">Close</p>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PatientModal;
