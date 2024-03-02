import React from "react";

type Props = {
  children: React.ReactNode;
};

const RootTabNav: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full border-t flex items-center justify-around border-t-gray-200 bottom-0 bg-white z-50 fixed sm:!hidden h-14">
      {children}
    </div>
  );
};

export default RootTabNav;
