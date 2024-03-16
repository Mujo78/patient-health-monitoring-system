import React from "react";
import { CustomFlowbiteTheme, Sidebar } from "flowbite-react";
import hospitalImage from "../../assets/hospital-logos.webp";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
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
  const { accessUser } = useSelector(authUser);

  const route = accessUser?.data.role.toLowerCase();

  const dispatch = useAppDispatch();

  const onClickSelect = (name: string) => {
    dispatch(setSelected(name));
  };

  return (
    <div className="w-fit h-screen hidden sm:!flex">
      <Sidebar
        className="h-screen border-r border-r-gray-200 flex flex-col justify-between gap-12 w-fit"
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
                  className="rounded mx-auto bg-white h-auto w-32"
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
