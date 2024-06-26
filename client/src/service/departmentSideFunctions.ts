import { UserInfo } from "../features/appointment/appointmentSlice";
import { apiClientAuth } from "../helpers/ApiClient";

const URL = "/department";

export type Department = {
  _id: string;
  name: string;
  description: string;
  phone_number: string;
};

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
  doctors: DoctorInfo[];
};

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
