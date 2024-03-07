import axios from "axios";
import { Patient } from "../features/medicine/medicineSlice";

const BASE_URL = "http://localhost:3001/api/v1/appointment";

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
  const response = await axios.get(`${BASE_URL}/doctor-patients`, {
    params: { searchQuery, page },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
