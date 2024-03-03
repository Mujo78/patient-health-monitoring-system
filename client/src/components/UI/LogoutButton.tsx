import { Button } from "flowbite-react";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { restartNotifications } from "../../features/notification/notificationSlice";
import { logout, reset, setSelected } from "../../features/auth/authSlice";
reset;

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
      className="h-fit !w-fit mx-auto md:!w-full mb-0 sm:mb-2 hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex justify-center items-center gap-2">
        <HiOutlineArrowRightOnRectangle className="w-5 h-5 xxl:!w-8 xxl:!h-8" />
        <span className="hidden md:block xxl:!text-xl">Logout</span>
      </div>
    </Button>
  );
};

export default LogoutButton;
