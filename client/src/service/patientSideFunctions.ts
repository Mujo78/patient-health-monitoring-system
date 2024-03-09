import axios from "axios";
import { Patient } from "../features/medicine/medicineSlice";

const BASE_URL = "http://localhost:3001/api/v1/";

export type PatientsType = {
  currentPage: number | null;
  data: Patient[];
  numOfPages: number;
};

export async function getPatientsForDoctor(
  token: string,
  page: number,
  searchQuery: string
) {
  const response = await axios.get(`${BASE_URL}appointment/doctor-patients`, {
    params: { searchQuery, page },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getPatient(token: string, patientId: string) {
  const response = await axios.get(`${BASE_URL}patient/${patientId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
