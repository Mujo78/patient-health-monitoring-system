import axios from "axios";
import { Medicine, MedicineDataType } from "./medicineSlice";
import { apiClientAuth } from "../../helpers/ApiClient";

const URL = "/medicine/";

const getAllMedicine = async (
  page?: number,
  search?: string,
  category?: string,
) => {
  const response = await apiClientAuth.get(URL, {
    params: { page: page, searchQuery: search, category: category },
  });

  return response.data;
};

const getMedicine = async (id: string) => {
  const response = await apiClientAuth.get(`${URL}/${id}`);
  return response.data;
};

const addMedicine = async (data: MedicineDataType) => {
  const form = new FormData();
  form.append("category", data.category);
  form.append("category", data.category);
  form.append("category", data.category);
  form.append("description", data.description);
  form.append("manufacturer", data.manufacturer);
  form.append("price", data.price);
  form.append("photo", data.photo);

  const response = await apiClientAuth.post(URL, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const deleteOneMedicine = async (id: string) => {
  const response = await axios.delete(`${URL}/${id}`);
  return response.data;
};

const updateMedicine = async (id: string, data: Medicine) => {
  const form = new FormData();
  form.append("category", data.category);
  form.append("available", data.available.toString());
  form.append("name", data.name);
  form.append("strength", data.strength);
  form.append("description", data.description);
  form.append("manufacturer", data.manufacturer);
  form.append("price", data.price);
  form.append("photo", data.photo);

  const response = await apiClientAuth.patch(`${URL}/${id}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
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
