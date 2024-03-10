import React, { useEffect, useRef, useState } from "react";
import { patient_id } from "../../features/appointment/appointmentSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { authUser } from "../../features/auth/authSlice";
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

type Props = {
  patient: patient_id;
};

const PatientFinishedAppointments: React.FC<Props> = ({ patient }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [appointments, setAppointments] = useState<appointments | undefined>();
  const [show, setShow] = useState<boolean>(false);
  const [modalData, setModalData] = useState<modalDataType>();
  const { accessUser } = useSelector(authUser);
  const query = useQuery();
  const page = Number(query.get("page")) || 1;
  const lastQuery = useRef<string>();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (id && accessUser && query.toString() !== lastQuery.current) {
        lastQuery.current = query.toString();
        try {
          setLoading(true);
          const response = await getPatientFinishedAppointments(
            accessUser.token,
            id,
            page
          );
          setAppointments(response);
          navigate(`/my-patients/${id}?${query.toString()}`);
        } catch (err: any) {
          setMessage(err.response?.data);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, accessUser, query, lastQuery, page, navigate]);

  const showModal = (appointment: finishedAppointments) => {
    console.log(appointment);
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
    if (page !== newPage && accessUser && id) {
      const response = await getPatientFinishedAppointments(
        accessUser.token,
        id,
        newPage
      );
      setAppointments(response);
      navigate(`/my-patients/${id}?page=${newPage}`);
    }
  };

  return (
    <div className="lg:!w-fit xl:!w-full w-full h-full">
      {loading ? (
        <CustomSpinner size="lg" fromTop={8} />
      ) : appointments ? (
        <>
          <div className="h-full flex justify-between flex-col w-full lg:!w-fit lg:!ml-auto xl:!ml-0 xl:!w-full">
            {Number(page) > appointments.numOfPages ? (
              <div className="h-full flex justify-center p-4 items-center">
                <ErrorMessage text="No data available." size="sm" />
              </div>
            ) : loading ? (
              <CustomSpinner size="md" />
            ) : (
              <div className="mb-auto xl:!mt-6">
                <p className="text-lg xxl:!text-2xl text-center font-semibold text-gray-900">
                  Appointments
                </p>
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
                          className="hover:!bg-blue-100 cursor-pointer"
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
                  <div className="h-full justify-center flex items-center">
                    <p className="text-sm text-gray-400 text-center">
                      There are no previous finished appointments for this
                      patient.
                    </p>
                  </div>
                )}
              </div>
            )}

            {appointments.data && (
              <Footer variant={1}>
                <div className="w-full mt-2 lg:!mt-0 pb-14 md:!pb-0">
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
        <div className="h-full w-full text-center mt-16">
          <ErrorMessage
            className="xl:!text-md xxl:!text-xl"
            text={message || "Something went wrong, please try again later."}
          />
        </div>
      )}
    </div>
  );
};

export default PatientFinishedAppointments;
