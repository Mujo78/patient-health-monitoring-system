import moment, { MomentInput } from "moment";
import { apiClientAuth } from "../helpers/ApiClient";
import { Medicine, Patient } from "../features/medicine/medicineSlice";
import { GenderArray } from "./departmentSideFunctions";
import {
  doctor_id,
  patient_id,
} from "../features/appointment/appointmentSlice";

type ValuePiece = Date | null;
export type Value = ValuePiece | [ValuePiece, ValuePiece];

export type MyEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
};

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

export async function getPatientFinishedAppointments(id: string, page: number) {
  const response = await apiClientAuth.get(`/appointment/patient/${id}`, {
    params: { page },
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

type PatientStatistic = {
  name: string;
  value: number;
};

export type DocDashboardType = {
  patientStatistic: PatientStatistic[];
  averageAge: number;
  apps: PatientStatistic[];
};

export async function getOtherAppsForDay(date: Date, doctor_id: string) {
  const response = await apiClientAuth.post("/appointment/others-today", {
    date,
    doctor_id,
  });
  return response.data;
}

export function isSunday(date: Date) {
  return date.getDay() === 0;
}

export function formatDate(date: Date) {
  return moment(date).format("YYYY-MM-DD");
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

export function getDateTime(date: Date) {
  return `${formatDate(date)} (${formatStartEnd(date)})`;
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

export function canCancelOrEdit(appDate: Date) {
  const diff = moment(appDate).diff(moment(), "minutes");
  return diff > 60;
}

export function getCorrectDate(value: Value, newTime: string) {
  const time = convert12HourTo24Hour(newTime);

  const date = moment(value as MomentInput).format("YYYY-MM-DD");

  const newAppDate = `${date}T${time}:00`;
  return new Date(newAppDate);
}
