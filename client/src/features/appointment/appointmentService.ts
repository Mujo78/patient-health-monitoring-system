import { apiClient } from "../../helpers/ApiClient";
import {
  MakeAppointmentData,
  editObject,
  finishAppointmentObj,
} from "./appointmentSlice";

const URL = "/appointment/";

const makeAppointment = async (
  appointmentData: MakeAppointmentData,
  token: string
) => {
  const response = await apiClient.post(URL, appointmentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getAppointmentsForDay = async (date: Date, token: string) => {
  const response = await apiClient.post(
    `${URL}day`,
    { date },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

const getAppointmentForPerson = async (id: string, token: string) => {
  const response = await apiClient.get(`${URL}person/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getAppointment = async (id: string, token: string) => {
  const response = await apiClient.get(`${URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteAppointment = async (id: string, token: string) => {
  const response = await apiClient.delete(`${URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const editAppointment = async (
  id: string,
  editObjectData: editObject,
  token: string
) => {
  const response = await apiClient.patch(
    `${URL}/edit-details/${id}`,
    editObjectData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const finishAppointment = async (
  id: string,
  finishAppointmentObj: finishAppointmentObj,
  token: string
) => {
  const response = await apiClient.patch(`${URL}${id}`, finishAppointmentObj, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
