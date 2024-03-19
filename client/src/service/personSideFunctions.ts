import moment from "moment";
import { apiClient } from "../helpers/ApiClient";

export async function getMe(token: string) {
  const response = await apiClient.get("/patient/get-me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateMe(token: string, data: unknown) {
  const response = await apiClient.patch("/patient/edit-my-profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getDoctorInfo(token: string) {
  const response = await apiClient.get("/doctor/get-me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateDoctorInfo(token: string, data: unknown) {
  const response = await apiClient.patch("/doctor/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function yearCalc(date: Date) {
  return moment().diff(moment(date), "years");
}
