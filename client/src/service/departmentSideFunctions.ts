import { UserInfo } from "../features/appointment/appointmentSlice";
import { apiClient, apiClientAuth } from "../helpers/ApiClient";

const URL = "/department";

export type Department = {
  _id: string;
  name: string;
  description: string;
  phone_number: string;
};

export async function getDepartments() {
  const response = await apiClientAuth.get(`${URL}/`);

  return response.data;
}

type DoctorInfo = {
  _id: string;
  user_id: UserInfo;
  first_name: string;
  last_name: string;
  speciality: string;
  qualification: string;
};

export type DepartmentAllInfo = {
  department: Department;
  doctors: DoctorInfo[] | string;
};

export async function getDepartmentAllInfo(token: string, name: string) {
  const response = await apiClient.get(`${URL}/${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export type DoctorType = {
  _id: string;
  address: string;
  bio: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  qualification: string;
  speciality: string;
  user_id: UserInfo;
  available_days: string[];
};

export async function getDoctorsForDepartment(name: string) {
  const response = await apiClientAuth.get(`${URL}/${name}/doctors`);

  return response.data;
}

export type GenderArray = {
  name: string;
  value: number;
};

export type myDepartmentResult = {
  department: {
    name: string;
    phone_number: string;
    description: string;
  };
  numberOfDoctors: number;
  numberOfActiveDoctors: number;
  todayActiveDoctors: DoctorType[];
  otherDoctors: DoctorType[];
  gender: GenderArray[];
};

export async function getMyDepartment(token: string) {
  const response = await apiClient.get(`${URL}/my-department`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export type appointmentsByDay = {
  name: string;
  value: number;
};

export type todayAppointmentDataType = {
  total: number;
  finished: number;
  pending: number;
};

export type myDepartmentAppointments = {
  todayAppointment: todayAppointmentDataType;
  appointmentsByDay: appointmentsByDay[];
};

export async function getMyDepartmentAppointments(token: string) {
  const response = await apiClient.get(`${URL}/my-department-appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
