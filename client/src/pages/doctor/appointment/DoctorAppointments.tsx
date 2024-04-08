import React from "react";
import AppointmentsCalendarPreview from "../../../components/Appointment/AppointmentsCalendarPreview";
import { Appointment } from "../../../features/appointment/appointmentSlice";
import "react-big-calendar/lib/css/react-big-calendar.css";

const DoctorAppointments: React.FC = () => {
  const titleFormat = (appointment: Appointment) => {
    return `A: ${appointment.patient_id.first_name + " " + appointment.patient_id.last_name}`;
  };

  return <AppointmentsCalendarPreview titleFormat={titleFormat} />;
};

export default DoctorAppointments;
