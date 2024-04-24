import { apiClientAuth } from "../helpers/ApiClient";

const URL = "/pharmacy/";

export type PharmacyType = {
  name: string;
  address: string;
  description: string;
  phone_number: string;
  from: string;
  to: string;
};

export async function updateData(data: PharmacyType) {
  const response = await apiClientAuth.patch(URL, data);
  return response.data;
}

type PharmacyMainInfo = {
  _id: string;
  name: string;
  address: string;
  phone_number: string;
  from: string;
  to: string;
};

type Total = {
  total_price: number;
  total_number: number;
  total_available: number;
  total_not_available: number;
};

type recentMedicine = {
  _id: string;
  name: string;
  photo: string;
  strength: string;
  createdAt: Date;
};

export type PharmacyDashboardType = {
  pharmacy: PharmacyMainInfo;
  total: Total;
  recentMedicine: recentMedicine[];
};

type PieCategories = {
  name: string;
  value: number;
};

type topExpensive = {
  name: string;
  value: number;
};

type usedMedicine = {
  _id: string;
  name: string;
  value: number;
};

export type PharmacyDashboardInfoType = {
  data: PieCategories[];
  topExpensive: topExpensive[];
  usedMedicine: usedMedicine[];
};
