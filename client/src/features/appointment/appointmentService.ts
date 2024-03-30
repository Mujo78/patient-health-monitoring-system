import { apiClientAuth } from "../../helpers/ApiClient";
import {
  MakeAppointmentData,
  editObject,
  finishAppointmentObj,
} from "./appointmentSlice";

const URL = "/appointment/";

const makeAppointment = async (appointmentData: MakeAppointmentData) => {
  const response = await apiClientAuth.post(URL, appointmentData);
  return response.data;
};

const getAppointmentsForDay = async (date: Date) => {
  const response = await apiClientAuth.post(`${URL}day`, { date });
  return response.data;
};

const getAppointmentForPerson = async (id: string) => {
  const response = await apiClientAuth.get(`${URL}person/${id}`);
  return response.data;
};

const getAppointment = async (id: string) => {
  const response = await apiClientAuth.get(`${URL}/${id}`);
  return response.data;
};

const deleteAppointment = async (id: string) => {
  const response = await apiClientAuth.delete(`${URL}/${id}`);

  return response.data;
};

const editAppointment = async (id: string, editObjectData: editObject) => {
  const response = await apiClientAuth.patch(
    `${URL}/edit-details/${id}`,
    editObjectData,
  );
  return response.data;
};

const finishAppointment = async (
  id: string,
  finishAppointmentObj: finishAppointmentObj,
) => {
  const response = await apiClientAuth.patch(
    `${URL}${id}`,
    finishAppointmentObj,
  );
  return response.data;
};

const appointmentService = {
  makeAppointment,
  getAppointmentsForDay,
  getAppointmentForPerson,
  getAppointment,
  deleteAppointment,
  editAppointment,
  finishAppointment,
};

export default appointmentService;
