import { Patient } from "../features/medicine/medicineSlice";
import { apiClient } from "../helpers/ApiClient";

export type PatientsType = {
  currentPage: number | null;
  data: Patient[];
  numOfPages: number;
};

export async function getPatientsForDoctor(
  token: string,
  page: number,
  searchQuery: string,
) {
  const response = await apiClient.get("/appointment/doctor-patients", {
    params: { searchQuery, page },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getPatient(token: string, patientId: string) {
  const response = await apiClient.get(`/patient/${patientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
