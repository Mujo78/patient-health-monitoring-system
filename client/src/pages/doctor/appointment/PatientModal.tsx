import React from "react";
import ErrorMessage from "../../../components/UI/ErrorMessage";
import { Button, Modal } from "flowbite-react";
import {
  formatDate,
  formatStartEnd,
} from "../../../service/appointmentSideFunctions";
import { Link } from "react-router-dom";
import { modalDataType } from "../Patient";
import { yearCalc } from "../../../service/personSideFunctions";
import CustomSpinner from "../../../components/UI/CustomSpinner";

type Props = {
  more: boolean;
  setMore: React.Dispatch<React.SetStateAction<boolean>>;
  latestAppState: modalDataType | undefined;
  loading: boolean;
  variant: 1 | 2;
};

const PatientModal: React.FC<Props> = ({
  more,
  variant,
  latestAppState,
  setMore,
  loading,
}) => {
  return (
    <Modal
      show={more}
      size="7xl"
      className="font-Poppins"
      position="center-right"
      onClose={() => setMore(false)}
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
            <div className="h-80">
              <CustomSpinner />
            </div>
          ) : latestAppState ? (
            <div className="h-full flex justify-evenly flex-col">
              <div className="flex p-1 border rounded-lg my-auto divide-y xxl:text-2xl md:!divide-x md:!divide-y-0 justify-between flex-wrap text-center md:!text-start">
                <div className="divide-y w-full md:!w-2/4">
                  <p>
                    <span className="font-semibold hidden md:!inline-block">
                      Name:
                    </span>{" "}
                    {latestAppState.patient_id.first_name +
                      " " +
                      latestAppState.patient_id.last_name}
                  </p>
                  <p>
                    <span className="font-semibold hidden md:!inline-block">
                      Date of birth:
                    </span>{" "}
                    {latestAppState.patient_id.date_of_birth.toString()}
                  </p>
                  <p>
                    <span className="font-semibold hidden md:!inline-block">
                      Blood type:
                    </span>{" "}
                    {latestAppState.patient_id.blood_type}
                  </p>
                </div>
                <div className="md:!w-2/4 w-full divide-y md:pl-1">
                  <p>
                    <span className="font-semibold hidden md:!inline-block">
                      Gender:
                    </span>{" "}
                    {latestAppState.patient_id.gender}
                  </p>
                  <p>
                    <span className="font-semibold hidden md:!inline-block">
                      Age:
                    </span>{" "}
                    {yearCalc(latestAppState?.patient_id.date_of_birth)}
                  </p>
                  <p>
                    <span className="font-semibold hidden md:!inline-block">
                      Address:
                    </span>{" "}
                    {latestAppState.patient_id.address}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h1 className="font-bold text-md mb-1 xxl:text-2xl">
                  Medical report
                </h1>
                <div className="border flex flex-col gap-4 rounded-lg divide-y p-2">
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
                    <div className="pt-2 xxl:!text-xl text-sm">
                      <h1 className="font-semibold">Description</h1>
                      <p>{latestAppState.description}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col md:!flex-row md:!items-center mt-8 justify-between items-start gap-3">
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
                      className="text-blue-700 text-sm xxl:!text-xl hover:underline "
                      to={`/my-patients/${latestAppState.patient_id._id}`}
                    >
                      See patient history {"->"}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center pb-2 md:!pb-0">
              <ErrorMessage
                className="xxl:text-2xl"
                size="md"
                text="There are no record for this patient!"
              />
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="hidden md:!flex">
        <Button className="ml-auto" color="gray" onClick={() => setMore(false)}>
          <p className="xxl:!text-xl">Close</p>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PatientModal;
