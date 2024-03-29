import React, { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAppDispatch } from "../../../app/hooks";
import { useSelector } from "react-redux";
import {
  appointment,
  getAppointmentsForPerson,
  resetPersonAppointment,
} from "../../../features/appointment/appointmentSlice";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useSelectedPage from "../../../hooks/useSelectedPage";
import CustomSpinner from "../../../components/UI/CustomSpinner";
import { MyEvent } from "../../../service/appointmentSideFunctions";

const localizer = momentLocalizer(moment);

const MyAppointments: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { personAppointments, status } = useSelector(appointment);

  useSelectedPage("My appointments");

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
    title: `A: ${n.doctor_id.speciality}`,
  }));

  const handleNavigate = ({ id }: { id: string }) => {
    navigate(id);
  };

  return (
    <>
      {id ? (
        <Outlet />
      ) : (
        <div className="px-4 py-3 h-full w-full flex-col text-sm flex justify-center items-center">
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

export default MyAppointments;
