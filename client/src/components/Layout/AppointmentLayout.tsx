import React from "react";
import CustomButton from "../UI/CustomButton";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useSelectedPage from "../../hooks/useSelectedPage";

const AppointmentLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;

  useSelectedPage("Book appointment");

  const makeNewAppointment = () => {
    navigate("new", { replace: true });
  };

  return (
    <>
      {location !== "/appointment" ? (
        <Outlet />
      ) : (
        <div className="flex h-full items-center justify-center">
          <CustomButton onClick={makeNewAppointment}>
            <p className="text-md xxl:!text-lg">Make appointment</p>
          </CustomButton>
        </div>
      )}
    </>
  );
};

export default AppointmentLayout;
