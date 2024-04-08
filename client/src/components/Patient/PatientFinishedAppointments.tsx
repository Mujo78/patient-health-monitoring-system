import React, { useEffect, useRef, useState } from "react";
import { patient_id } from "../../features/appointment/appointmentSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import {
  appointments,
  finishedAppointments,
  formatDate,
  formatStartEnd,
  getPatientFinishedAppointments,
  modalDataType,
} from "../../service/appointmentSideFunctions";
import ErrorMessage from "../UI/ErrorMessage";
import CustomSpinner from "../UI/CustomSpinner";
import { Table } from "flowbite-react";
import Pagination from "../UI/Pagination";
import PatientModal from "./PatientModal";
import Footer from "../UI/Footer";
import Header from "../UI/Header";

type Props = {
  patient: patient_id;
};

const PatientFinishedAppointments: React.FC<Props> = ({ patient }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [appointments, setAppointments] = useState<appointments | undefined>();
  const [show, setShow] = useState<boolean>(false);
  const [modalData, setModalData] = useState<modalDataType>();

  const { id } = useParams();
  const navigate = useNavigate();
  const query = useQuery();
  const page = Number(query.get("page")) || 1;
  const lastQuery = useRef<string>();

  useEffect(() => {
    const fetchData = async () => {
      if (id && query.toString() !== lastQuery.current) {
        lastQuery.current = query.toString();
        try {
          setLoading(true);
          const response = await getPatientFinishedAppointments(id, page);
          setAppointments(response);
          navigate(`/my-patients/${id}?${query.toString()}`);
        } catch (err: any) {
          setMessage(err?.response?.data ?? err?.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, query, lastQuery, page, navigate]);

  const showModal = (appointment: finishedAppointments) => {
    if (appointments && patient) {
      setModalData({
        patient_id: patient,
        _id: appointment._id,
        diagnose: appointment.diagnose,
        therapy: appointment.therapy,
        other_medicine: appointment.other_medicine,
        description: appointment.description,
        reason: appointment.reason,
        appointment_date: appointment.appointment_date,
      });
    }
    setShow(true);
  };

  const handleNavigatePage = async (newPage: number) => {
    if (page !== newPage && id) {
      navigate(`/my-patients/${id}?page=${newPage}`);
    }
  };

  return (
    <div className="h-full w-full xl:!w-2/4">
      {loading ? (
        <CustomSpinner size="lg" fromTop={8} />
      ) : appointments ? (
        <>
          <div className="flex h-full w-full flex-col justify-between lg:!ml-auto lg:!w-full xl:!ml-0">
            {Number(page) > appointments.numOfPages ? (
              <div className="flex h-full items-center justify-center p-4">
                <ErrorMessage text="No data available." />
              </div>
            ) : loading ? (
              <CustomSpinner size="md" />
            ) : (
              <div className="mb-auto xl:!mt-6">
                <Header size={1} text="Appointments" />
                {appointments.data && appointments.data.length > 0 ? (
                  <Table>
                    <Table.Body className="divide-y text-xs sm:!text-sm xxl:!text-lg">
                      <Table.Row className="text-gray-900">
                        <Table.Cell></Table.Cell>
                        <Table.Cell>Date</Table.Cell>
                        <Table.Cell>Time</Table.Cell>
                      </Table.Row>
                      {appointments.data.map((n, index) => (
                        <Table.Row
                          key={n._id}
                          className="cursor-pointer hover:!bg-blue-100"
                          onClick={() => showModal(n)}
                        >
                          <Table.Cell>{index + 1}.</Table.Cell>
                          <Table.Cell>
                            {formatDate(n.appointment_date)}
                          </Table.Cell>
                          <Table.Cell>
                            {formatStartEnd(n.appointment_date)}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-center text-sm text-gray-400">
                      There are no previous finished appointments for this
                      patient.
                    </p>
                  </div>
                )}
              </div>
            )}

            {appointments.data && (
              <Footer variant={1}>
                <div className="mt-2 w-full pb-14 md:!pb-0 lg:!mt-0">
                  <Pagination
                    page={Number(page)}
                    totalPages={appointments.numOfPages}
                    handleNavigate={handleNavigatePage}
                  />
                </div>
              </Footer>
            )}
          </div>

          {patient && (
            <PatientModal
              more={show}
              variant={2}
              setMore={setShow}
              latestAppState={modalData}
              loading={loading}
            />
          )}
        </>
      ) : (
        <div className="mt-16 h-full w-full text-center">
          <ErrorMessage text={message} />
        </div>
      )}
    </div>
  );
};

export default PatientFinishedAppointments;
