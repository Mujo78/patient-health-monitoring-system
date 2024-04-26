import React from "react";
import { CustomFlowbiteTheme, Sidebar } from "flowbite-react";
import hospitalImage from "../../assets/hospital-logos.webp";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { accessUser } = useSelector(authUser, shallowEqual);

  const route = accessUser?.data.role.toLowerCase();

  const onClickSelect = (name: string) => {
    if (name !== "Dashboard") {
      dispatch(setSelected(name));
    }
    navigate(`/${route}/${accessUser?.data._id}`);
  };

  return (
    <div className="hidden h-screen w-fit sm:!flex">
      <Sidebar
        className="flex h-screen w-fit flex-col justify-between gap-12 border-r border-r-gray-200"
        theme={theme}
      >
        <Sidebar.Items className="flex h-5/6 flex-col justify-start font-Poppins">
          <Sidebar.CTA
            color="light"
            className="!mt-0 hover:cursor-pointer hover:bg-white"
            onClick={() => onClickSelect("Dashboard")}
          >
            <img
              src={hospitalImage}
              width={120}
              height={120}
              className="mx-auto rounded bg-white"
              alt="Hospital logo"
            />
          </Sidebar.CTA>
          <Sidebar.ItemGroup className="!pt-2">{children}</Sidebar.ItemGroup>
        </Sidebar.Items>

        <LogoutButton />
      </Sidebar>
    </div>
  );
};

export default RootSidebar;
