import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Appointment } from "../../../features/appointment/appointmentSlice";
import AppointmentsCalendarPreview from "../../../components/Appointment/AppointmentsCalendarPreview";

const MyAppointments: React.FC = () => {
  const titleFormat = (appointment: Appointment) => {
    return `A: ${appointment.doctor_id.speciality}`;
  };

  return <AppointmentsCalendarPreview titleFormat={titleFormat} />;
};

export default MyAppointments;
