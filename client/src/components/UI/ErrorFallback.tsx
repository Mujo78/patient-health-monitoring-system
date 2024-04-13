import { Button } from "flowbite-react";
import React from "react";
import { FallbackProps } from "react-error-boundary";
import { HiOutlineArrowPath } from "react-icons/hi2";

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="mx-auto flex h-screen flex-col justify-center gap-2 text-center">
      <div className="mx-auto flex w-fit flex-col justify-start text-start">
        <p className="text-lg font-medium">{error?.message}</p>
        <p className="text-xl font-semibold">
          Something went wrong, please try refresh page with the button below!
        </p>
      </div>
      <Button
        size="lg"
        color="light"
        className="mx-auto w-fit border-0"
        onClick={resetErrorBoundary}
      >
        <HiOutlineArrowPath
          style={{ width: "4rem", height: "4rem", color: "#219aeb" }}
        />
      </Button>
    </div>
  );
};

export default ErrorFallback;
