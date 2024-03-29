import moment from "moment";
import { apiClient } from "../helpers/ApiClient";
import { Medicine, Patient } from "../features/medicine/medicineSlice";
import { GenderArray } from "./departmentSideFunctions";
import {
  Appointment,
  doctor_id,
  patient_id,
} from "../features/appointment/appointmentSlice";

export const workTime = [
  "9:00",
  "9:20",
  "9:40",
  "10:00",
  "10:20",
  "10:40",
  "11:00",
  "11:20",
  "11:40",
  "12:00",
  "1:00",
  "1:20",
  "1:40",
  "2:00",
  "2:20",
  "2:40",
  "3:00",
  "3:20",
  "3:40",
  "4:00",
];

export type MyEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
};

export async function getDoctor(token: string, id: string) {
  const response = await apiClient.get(`/doctor/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

type latestApp = {
  appointment_id: string;
  patient_id: string;
};

export async function getLatestAppointment(
  token: string,
  id: string,
  latestApp: latestApp
) {
  const response = await apiClient.post(
    `/appointment/${id}/patient-latest-record`,
    latestApp,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export type AppointmentFinished = {
  diagnose: string;
  other_medicine: string;
  description: string;
};

export type finishedAppointments = {
  _id: string;
  diagnose: string;
  therapy: Medicine[];
  other_medicine: string;
  description: string;
  reason: string;
  appointment_date: Date;
};

export type appointments = {
  currentPage: number;
  numOfPages: number;
  data: finishedAppointments[] | null;
};

export type modalDataType = {
  patient_id: patient_id;
  _id: string;
  diagnose: string;
  therapy: Medicine[];
  other_medicine: string;
  description: string;
  reason: string;
  appointment_date: Date;
};

export async function getPatientFinishedAppointments(
  token: string,
  id: string,
  page: number
) {
  const response = await apiClient.get(`/appointment/patient/${id}`, {
    params: { page },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getLatestFinished(token: string) {
  const response = await apiClient.get(`/appointment/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function numberOfAppointmentsPerMonthForDepartments(
  token: string,
  month: string
) {
  const response = await apiClient.get(`/appointment/per-month/${month}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export type appointment = {
  _id: string;
  appointment_date: Date;
  doctor_id: doctor_id;
};

export type latestFinishedType = {
  appointment: appointment | null;
  patient: patient_id;
};

type Latest = {
  _id: string;
  patient_id: Patient;
  appointment_date: Date;
};

export type DocDashboardInfoType = {
  latest: Latest | null;
  department_name: string;
  gender: GenderArray[];
};

export async function doctorDashboardInfo(token: string) {
  const response = await apiClient.get("/appointment/doctor-dashboard-info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

type PatientStatistic = {
  name: string;
  value: number;
};

export type DocDashboardType = {
  patientStatistic: PatientStatistic[];
  averageAge: number;
  apps: PatientStatistic[];
};

export async function doctorDashboard(token: string) {
  const response = await apiClient.get("/appointment/doctor-dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getOtherAppsForDay(
  token: string,
  date: Date,
  doctor_id: string
) {
  const response = await apiClient.post(
    "/appointment/others-today",
    { date, doctor_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export function isSunday(date: Date) {
  return date.getDay() === 0;
}

export function formatDate(date: Date) {
  const index = date?.toString().indexOf("T");
  const newDate = date?.toString().slice(0, index);
  return newDate;
}

export async function availableTimeForApp(
  value: Date,
  doctor_id: string,
  token: string
) {
  const response = await getOtherAppsForDay(token, value, doctor_id);

  const appTime =
    response &&
    response.map((n: Appointment) => {
      const date = new Date(n.appointment_date);
      const localTime = new Date(date.getTime());
      const formattedTime = localTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
      const newTime = formattedTime.slice(0, 5).trim();
      return newTime;
    });

  return appTime;
}

export function isDoctorAvailable(date: Date, available_days: string[]) {
  const dayOfWeek = date?.toLocaleDateString("en-US", { weekday: "long" });
  return !available_days.includes(dayOfWeek);
}

export function isDst(date: Date) {
  let add;
  if (!moment(date).isDST()) {
    add = 1;
  } else {
    add = 2;
  }
  return add;
}

export function formatStartEnd(date: Date) {
  const add = isDst(date);
  const appDateTime = moment.utc(date).add(add, "hours");
  const startTime = moment.utc(appDateTime).format("hh:mm A");
  const endTime = moment.utc(appDateTime).add(20, "minutes").format("hh:mm A");
  const appointmentTime = `${startTime} - ${endTime}`;
  return appointmentTime;
}

export function isCurrentAppointment(appointmentDate: Date) {
  const appDate = new Date(appointmentDate);
  const currentDate = new Date();
  const endTime = new Date(appDate);
  endTime.setMinutes(endTime.getMinutes() + 20);
  return currentDate >= appDate && currentDate <= endTime;
}

export function convert12HourTo24Hour(time12Hour: string) {
  const [hours, minutes] = time12Hour.split(":").map(Number);
  return `${
    hours <= 4 ? hours + 12 : hours < 10 && hours > 4 ? "0" + hours : hours
  }:${minutes === 0 ? "00" : minutes}`;
}

export function isDSTFunc() {
  const date = moment().isDST();
  const time = date ? 2 : 1;
  return time;
}
