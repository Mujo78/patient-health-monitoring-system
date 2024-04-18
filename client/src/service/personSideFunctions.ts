import moment from "moment";
import { apiClientAuth } from "../helpers/ApiClient";

export type patient = {
  blood_type: string;
  date_of_birth: Date;
  first_name: string;
  phone_number: string;
  gender: string;
  height: string | "";
  last_name: string;
  weight: string | "";
  address: string;
};

export type patientGeneralSettings = {
  email: string;
  notification: boolean | true;
};

export async function updateMe(data: unknown) {
  const response = await apiClientAuth.patch("/patient/edit-my-profile", data);
  return response.data;
}

export const availableDaysOptions = moment
  .weekdays()
  .map((m) => ({ value: m, label: m }));

export type optionsType = {
  value: string;
  label: string;
};

export type doctorType = {
  first_name: string;
  last_name: string;
  phone_number: string;
  speciality: string;
  qualification: string;
  address: string;
  bio: string;
  gender: string;
  age: string;
  available_days: optionsType[];
};

export async function updateDoctorInfo(data: unknown) {
  const response = await apiClientAuth.patch("/doctor/", data);
  return response.data;
}

export function yearCalc(date: Date) {
  return moment().diff(moment(date), "years");
}
