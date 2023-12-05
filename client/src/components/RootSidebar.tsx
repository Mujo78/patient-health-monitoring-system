import React from "react";
import { Avatar, Button, Sidebar } from "flowbite-react";
import hospitalImage from "../assets/hospital-logo.jpg";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  authUser,
  logout,
  reset,
  setSelected,
} from "../features/auth/authSlice";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useAppDispatch } from "../app/hooks";
import { restartNotifications } from "../features/notification/notificationSlice";

type Props = {
  children: React.ReactNode;
};

const RootSidebar: React.FC<Props> = ({ children }) => {
  const { accessUser } = useSelector(authUser);

  const route = accessUser?.data.role.toLowerCase();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logOut = () => {
    dispatch(restartNotifications());
    dispatch(logout());
    navigate("/", { replace: true });
    dispatch(setSelected(""));
    dispatch(reset());
  };

  const onClickSelect = (name: string) => {
    dispatch(setSelected(name));
  };

  return (
    <div className="w-fit h-screen">
      <Sidebar className="h-screen">
        <Sidebar.Items
          className={`h-full font-Poppins border-r-2 border-r-gray-200 flex flex-col justify`}
        >
          <Sidebar.ItemGroup className="h-full flex flex-col justify-between">
            <Sidebar.ItemGroup>
              <Sidebar.Item
                as={NavLink}
                onClick={() => onClickSelect("Dashboard")}
                to={`/${route}/${accessUser?.data._id}`}
              >
                <div>
                  <Avatar img={hospitalImage} rounded size="lg" />
                </div>
              </Sidebar.Item>
              {children}
            </Sidebar.ItemGroup>
            <Sidebar.Item className="mt-auto">
              <Button color="light" onClick={logOut} className="w-full">
                <div className="flex gap-2 items-center justify-center">
                  <HiOutlineArrowRightOnRectangle className="w-[19px] h-[19px]" />
                  <p> Logout</p>
                </div>
              </Button>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};

export default RootSidebar;
