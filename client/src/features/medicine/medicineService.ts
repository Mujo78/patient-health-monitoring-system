import axios from "axios";
import { Medicine, MedicineDataType } from "./medicineSlice";
import { apiClient } from "../../helpers/ApiClient";

const URL = "/medicine/";

const getAllMedicine = async (
  token: string,
  page?: number,
  search?: string,
  category?: string
) => {
  const response = await apiClient.get(URL, {
    params: { page: page, searchQuery: search, category: category },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getMedicine = async (token: string, id: string) => {
  const response = await apiClient.get(`${URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const addMedicine = async (token: string, data: MedicineDataType) => {
  const form = new FormData();
  form.append("category", data.category);
  form.append("category", data.category);
  form.append("category", data.category);
  form.append("description", data.description);
  form.append("manufacturer", data.manufacturer);
  form.append("price", data.price);
  form.append("photo", data.photo);

  const response = await apiClient.post(URL, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteOneMedicine = async (token: string, id: string) => {
  const response = await axios.delete(`${URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateMedicine = async (token: string, id: string, data: Medicine) => {
  const form = new FormData();
  form.append("category", data.category);
  form.append("available", data.available.toString());
  form.append("name", data.name);
  form.append("strength", data.strength);
  form.append("description", data.description);
  form.append("manufacturer", data.manufacturer);
  form.append("price", data.price);
  form.append("photo", data.photo);

  const response = await apiClient.patch(`${URL}/${id}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const medicineService = {
  getAllMedicine,
  addMedicine,
  deleteOneMedicine,
  getMedicine,
  updateMedicine,
};

export default medicineService;
