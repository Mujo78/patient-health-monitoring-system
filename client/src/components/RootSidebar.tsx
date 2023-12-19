import React from "react";
import { CustomFlowbiteTheme, Sidebar } from "flowbite-react";
import hospitalImage from "../assets/hospital-logos.webp";
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

const theme: CustomFlowbiteTheme["sidebar"] = {
  root: {
    base: "h-full",
    collapsed: {
      on: "w-16",
      off: "w-64",
    },
    inner:
      "h-full overflow-y-auto overflow-x-hidden rounded bg-white py-4 px-3 dark:bg-gray-800",
  },
};

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
      <Sidebar
        className="h-screen border-r border-r-gray-200 flex flex-col justify-between"
        theme={theme}
      >
        <Sidebar.Items className="h-5/6 font-Poppins flex flex-col justify">
          <Sidebar.ItemGroup className="h-full flex flex-col justify-between">
            <Sidebar.ItemGroup>
              <Sidebar.Item
                className=" hover:bg-white"
                as={NavLink}
                onClick={() => onClickSelect("Dashboard")}
                to={`/${route}/${accessUser?.data._id}`}
              >
                <img
                  src={hospitalImage}
                  className="rounded mx-auto bg-white"
                  width="120"
                  height="80px"
                  alt="Hospital logo"
                />
              </Sidebar.Item>
              {children}
            </Sidebar.ItemGroup>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        <Sidebar.CTA
          color="light"
          onClick={logOut}
          className="h-fit mb-2 flex justify-center hover:bg-gray-50 cursor-pointer"
        >
          <div className="flex gap-2 items-center justify-center">
            <HiOutlineArrowRightOnRectangle className="w-[19px] h-[19px]" />
            <p> Logout</p>
          </div>
        </Sidebar.CTA>
      </Sidebar>
    </div>
  );
};

export default RootSidebar;
