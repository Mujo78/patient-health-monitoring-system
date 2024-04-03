import { apiClient, apiClientAuth } from "../helpers/ApiClient";

export type PharmacyUpdateType = {
  name: string;
  address: string;
  description: string;
  phone_number: string;
  working_hours: string;
};

const URL = "/pharmacy/";

export async function getData(token: string) {
  const response = await apiClient.get(`${URL}/get-me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getPharmacy() {
  const response = await apiClientAuth.get(URL);
  return response.data;
}

export async function updateData(data: PharmacyUpdateType, token: string) {
  const response = await apiClient.patch(URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

type PharmacyMainInfo = {
  _id: string;
  name: string;
  address: string;
  phone_number: string;
  working_hours: string;
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

export async function pharmacyDashboard(token: string) {
  const response = await apiClient.get(`${URL}dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

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

export async function pharmacyDashboardInfo(token: string) {
  const response = await apiClient.get(`${URL}dashboard-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
