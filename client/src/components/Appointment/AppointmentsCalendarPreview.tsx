import React, { useEffect, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { shallowEqual, useSelector } from "react-redux";
import {
  Appointment,
  appointment,
  getAppointmentsForPerson,
  resetPersonAppointment,
} from "../../features/appointment/appointmentSlice";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import useSelectedPage from "../../hooks/useSelectedPage";
import CustomSpinner from "../../components/UI/CustomSpinner";
import { MyEvent } from "../../service/appointmentSideFunctions";
import toast from "react-hot-toast";
import ErrorMessage from "../../components/UI/ErrorMessage";
import { useAppDispatch } from "../../app/hooks";

const localizer = momentLocalizer(moment);

type Props = {
  titleFormat: (appointment: Appointment) => string;
};

const AppointmentsCalendarPreview: React.FC<Props> = ({ titleFormat }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { personAppointments, status, message } = useSelector(
    appointment,
    shallowEqual,
  );

  useSelectedPage("My appointments");

  useEffect(() => {
    if (!id) {
      dispatch(getAppointmentsForPerson());
    }

    return () => {
      dispatch(resetPersonAppointment());
    };
  }, [dispatch, id]);

  const myEventsList: MyEvent[] = useMemo(() => {
    if (!id) {
      return personAppointments.map((n) => ({
        id: n._id,
        start: new Date(n.appointment_date),
        end: new Date(new Date(n.appointment_date).getTime() + 20 * 60000),
        title: titleFormat(n),
      }));
    }
    return [];
  }, [personAppointments, id, titleFormat]);

  const handleNavigate = ({ id }: { id: string }) => {
    navigate(id);
  };

  useEffect(() => {
    if (status === "failed")
      toast.error(
        "Something went wrong while getting your appointments data, please try again later!",
      );
  }, [status]);

  return (
    <>
      {id ? (
        <Outlet />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center px-4 py-3 text-sm">
          {status === "loading" ? (
            <CustomSpinner size="xl" />
          ) : personAppointments ? (
            <>
              <Calendar
                className="flex h-full w-full flex-col rounded-xl pb-12 sm:pb-0 xxl:!text-2xl"
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
          ) : (
            status === "failed" && <ErrorMessage text={message} />
          )}
        </div>
      )}
    </>
  );
};

export default AppointmentsCalendarPreview;
