import axios from "axios";
import { Doctor } from "../pages/patient/appointment/AppointmentDepartment";
import { UserInfo } from "../features/appointment/appointmentSlice";

const BASE_URL = "http://localhost:3001/api/v1/department";

export type Department = {
  _id: string;
  name: string;
  description: string;
  phone_number: string;
};

export async function getDepartments(token: string) {
  const response = await axios.get(`${BASE_URL}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  const response = await axios.get(`${BASE_URL}/${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getDoctorsForDepartment(token: string, name: string) {
  const response = await axios.get(`${BASE_URL}/${name}/doctors`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  todayActiveDoctors: Doctor[];
  otherDoctors: Doctor[];
  gender: GenderArray[];
};

export async function getMyDepartment(token: string) {
  const response = await axios.get(`${BASE_URL}/my-department`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

type appointmentsByDay = {
  name: string;
  value: number;
};

export type myDepartmentAppointments = {
  todayAppointment: {
    total: number;
    finished: number;
    pending: number;
  };
  appointmentsByDay: appointmentsByDay[];
};

export async function getMyDepartmentAppointments(token: string) {
  const response = await axios.get(`${BASE_URL}/my-department-appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
