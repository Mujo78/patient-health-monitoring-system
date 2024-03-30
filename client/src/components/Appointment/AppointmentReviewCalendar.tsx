import { Card, Spinner, Table } from "flowbite-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Calendar from "react-calendar";
import { Value } from "../../pages/patient/appointment/MakeAppointment";
import { useAppDispatch } from "../../app/hooks";
import { useSelector, shallowEqual } from "react-redux";
import {
  appointment,
  getAppointmentsForADay,
  resetAppointmentDay,
} from "../../features/appointment/appointmentSlice";
import AppointmentRow from "./AppointmentRow";

type Props = {
  variant: 1 | 2;
};

const AppointmentReviewCalendar: React.FC<Props> = ({ variant }) => {
  const [value, setValue] = useState<Value>(new Date());
  const prevValueRef = useRef<Value | undefined>();

  const { selectedDayAppointments, status } = useSelector(
    appointment,
    shallowEqual,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      dispatch(getAppointmentsForADay(prevValueRef.current as Date));
    }

    return () => {
      dispatch(resetAppointmentDay());
      prevValueRef.current = undefined;
    };
  }, [dispatch, value]);

  const memoizedAppointments = useMemo(
    () => selectedDayAppointments,
    [selectedDayAppointments],
  );

  return (
    <Card className="mb-20 flex h-fit w-full justify-start sm:mb-3 xl:!h-full xl:!max-w-sm xxl:!max-w-xl">
      <div className="flex h-5/6 max-w-full flex-col items-start justify-start gap-3 lg:!flex-row xl:!h-full xl:!flex-col">
        <div className="lg:!max-w-xs xl:!mx-auto xxl:!max-w-full">
          <p className="text-md mb-1 text-center font-semibold xxl:!text-xl">
            {prevValueRef.current?.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <Calendar
            className="w-full rounded-md border-gray-300 p-3 text-xs shadow-xl xxl:!text-lg"
            locale="eng"
            onChange={setValue}
            onViewChange={({ view }) => view === "month"}
            minDate={new Date()}
            maxDate={new Date("01/01/2025")}
            value={value}
            showNavigation={false}
            tileClassName={({ date }) =>
              date.toDateString() === new Date().toDateString()
                ? "rounded-full p-1 !bg-blue-500 text-white hover:!bg-blue-450 cursor-pointer"
                : "!bg-white"
            }
            tileDisabled={() => true}
          />
        </div>
        <div className="h-64 w-full overflow-y-auto xl:!h-full" id="content">
          <Table className="h-full w-full">
            <Table.Body className="h-full w-full overflow-y-auto">
              {status === "loading" ? (
                <Table.Row>
                  <Table.Cell className="py-3 text-center text-gray-500">
                    <Spinner size="sm" />
                  </Table.Cell>
                </Table.Row>
              ) : memoizedAppointments?.length > 0 &&
                memoizedAppointments.some((a) => !a.finished) ? (
                memoizedAppointments.map(
                  (n) =>
                    !n.finished && (
                      <AppointmentRow key={n._id} variant={variant} data={n} />
                    ),
                )
              ) : (
                <Table.Row className="h-52">
                  <Table.Cell className="text-md mx-auto w-full py-3 text-center text-gray-500 xxl:text-lg">
                    You don't have any appointments today!
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentReviewCalendar;
