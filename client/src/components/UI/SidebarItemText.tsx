import React from "react";

type Props = {
  children: React.ReactNode;
};

const SidebarItemText: React.FC<Props> = ({ children }) => {
  return <span className="sm:hidden md:block">{children}</span>;
};

export default SidebarItemText;
