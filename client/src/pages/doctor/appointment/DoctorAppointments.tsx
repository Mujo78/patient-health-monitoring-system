import React, { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import {
  appointment,
  getAppointmentsForPerson,
  resetPersonAppointment,
} from "../../../features/appointment/appointmentSlice";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";

type MyEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
};

const localizer = momentLocalizer(moment);

const DoctorAppointments: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { personAppointments, status } = useSelector(appointment);

  useEffect(() => {
    dispatch(getAppointmentsForPerson());

    return () => {
      dispatch(resetPersonAppointment());
    };
  }, [dispatch]);

  const myEventsList: MyEvent[] = personAppointments.map((n) => ({
    id: n._id,
    start: new Date(n.appointment_date),
    end: new Date(new Date(n.appointment_date).getTime() + 20 * 60000),
    title: `A: ${n.patient_id.first_name + " " + n.patient_id.last_name}`,
  }));

  const handleNavigate = ({ id }: { id: string }) => {
    navigate(id);
  };

  useSelectedPage("My appointments");

  return (
    <>
      {id ? (
        <Outlet />
      ) : (
        <div className="px-4 h-full w-full flex-col text-sm flex justify-center items-center">
          {status === "loading" ? (
            <CustomSpinner size="xl" />
          ) : (
            <>
              <Calendar
                className="w-full h-full flex flex-col rounded-xl pb-12 sm:pb-0 xxl:!text-2xl"
                localizer={localizer}
                events={myEventsList}
                onSelectEvent={handleNavigate}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                min={new Date(0, 0, 0, 9, 0, 0)}
                max={new Date(0, 0, 0, 17, 0, 0, 0)}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default DoctorAppointments;
