import { Button } from "flowbite-react";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { restartNotifications } from "../../features/notification/notificationSlice";
import { logout, reset, setSelected } from "../../features/auth/authSlice";

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(restartNotifications());
    dispatch(logout());
    navigate("/", { replace: true });
    dispatch(setSelected(""));
    dispatch(reset());
  };

  return (
    <Button
      color="light"
      onClick={logOut}
      aria-label="log-out"
      className="mx-auto mb-0 h-fit !w-fit cursor-pointer hover:bg-gray-50 sm:mb-2 md:!w-2/3"
    >
      <div className="flex items-center justify-center gap-2">
        <HiOutlineArrowRightOnRectangle className="h-5 w-5 xxl:!h-8 xxl:!w-8" />
        <span className="hidden md:block xxl:!text-xl">Logout</span>
      </div>
    </Button>
  );
};

export default LogoutButton;
