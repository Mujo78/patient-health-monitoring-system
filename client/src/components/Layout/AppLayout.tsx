import React from "react";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../UI/ErrorFallback";

const AppLayout: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace(window.location.pathname)}
    >
      <div className="flex max-w-full font-Poppins">
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default AppLayout;
