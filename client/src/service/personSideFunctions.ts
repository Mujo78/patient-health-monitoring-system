import moment from "moment";
import { apiClientAuth } from "../helpers/ApiClient";

export async function getMe() {
  const response = await apiClientAuth.get("/patient/get-me");
  return response.data;
}

export async function updateMe(data: unknown) {
  const response = await apiClientAuth.patch("/patient/edit-my-profile", data);
  return response.data;
}

export const availableDaysOptions = moment
  .weekdays()
  .map((m) => ({ value: m, label: m }));

export async function getDoctorInfo() {
  const response = await apiClientAuth.get("/doctor/get-me");
  return response.data;
}

export async function updateDoctorInfo(data: unknown) {
  const response = await apiClientAuth.patch("/doctor/", data);
  return response.data;
}

export function yearCalc(date: Date) {
  return moment().diff(moment(date), "years");
}
