import { Patient } from "../features/medicine/medicineSlice";
import { apiClientAuth } from "../helpers/ApiClient";

export type PatientsType = {
  currentPage: number | null;
  data: Patient[];
  numOfPages: number;
};

export async function getPatientsForDoctor(page: number, searchQuery: string) {
  const response = await apiClientAuth.get("/appointment/doctor-patients", {
    params: { searchQuery, page },
  });

  return response.data;
}

export async function getPatient(patientId: string) {
  const response = await apiClientAuth.get(`/patient/${patientId}`);
  return response.data;
}
