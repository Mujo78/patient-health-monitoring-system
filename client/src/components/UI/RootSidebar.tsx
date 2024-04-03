import React from "react";
import { CustomFlowbiteTheme, Sidebar } from "flowbite-react";
import hospitalImage from "../../assets/hospital-logos.webp";
import { NavLink } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { authUser, setSelected } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../app/hooks";
import LogoutButton from "./LogoutButton";

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
  const dispatch = useAppDispatch();
  const { accessUser } = useSelector(authUser, shallowEqual);

  const route = accessUser?.data.role.toLowerCase();

  const onClickSelect = (name: string) => {
    dispatch(setSelected(name));
  };

  return (
    <div className="hidden h-screen w-fit sm:!flex">
      <Sidebar
        className="flex h-screen w-fit flex-col justify-between gap-12 border-r border-r-gray-200"
        theme={theme}
      >
        <Sidebar.Items className="justify flex h-5/6 flex-col font-Poppins">
          <Sidebar.ItemGroup className="flex h-full flex-col justify-between">
            <Sidebar.ItemGroup>
              <Sidebar.Item
                className=" hover:bg-white"
                as={NavLink}
                onClick={() => onClickSelect("Dashboard")}
                to={`/${route}/${accessUser?.data._id}`}
              >
                <img
                  src={hospitalImage}
                  className="mx-auto h-auto w-32 rounded bg-white"
                  alt="Hospital logo"
                />
              </Sidebar.Item>
              {children}
            </Sidebar.ItemGroup>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
        <LogoutButton />
      </Sidebar>
    </div>
  );
};

export default RootSidebar;
