import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const AppLayout: React.FC = () => {
  return (
    <div className="flex max-w-full font-Poppins">
      <Toaster position="top-right" />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
