import React from "react";

type Props = {
  children: React.ReactNode;
};

const RootTabNav: React.FC<Props> = ({ children }) => {
  return (
    <div className="fixed bottom-0 z-50 flex h-14 w-full items-center justify-around border-t border-t-gray-200 bg-white sm:!hidden">
      {children}
    </div>
  );
};

export default RootTabNav;
