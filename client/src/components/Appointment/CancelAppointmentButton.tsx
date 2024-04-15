import { Button } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { HiXCircle } from "react-icons/hi2";
import { cancelAppointment } from "../../features/appointment/appointmentSlice";
import { isFulfilled } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

type Props = {
  variant: "icon" | "text";
  thenFn?: () => void;
  showToast?: boolean;
  id: string;
};

const CancelAppointmentButton: React.FC<Props> = ({
  variant,
  id,
  thenFn,
  showToast,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cancelAppointmentNow = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (id) {
      dispatch(cancelAppointment(id)).then((action: any) => {
        if (isFulfilled(action)) {
          if (thenFn) thenFn();
          toast.success("Appointment cancelled");
          navigate("../", { replace: true });
        } else {
          if (showToast) toast.error(action.payload);
        }
      });
    }
  };

  return (
    <>
      {variant === "text" ? (
        <Button
          onClick={cancelAppointmentNow}
          className="mx-auto w-fit md:!mx-0 md:!ml-auto md:mt-auto lg:!w-fit"
          color="failure"
        >
          <p className="xxl:text-lg">Cancel Appointment</p>
        </Button>
      ) : (
        <button className="size-8" onClick={cancelAppointmentNow}>
          <HiXCircle className="size-6 text-red-600 hover:!text-red-700" />
        </button>
      )}
    </>
  );
};

export default CancelAppointmentButton;
