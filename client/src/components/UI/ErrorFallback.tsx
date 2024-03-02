import { Button } from "flowbite-react";
import React from "react";
import { FallbackProps } from "react-error-boundary";
import { HiOutlineArrowPath } from "react-icons/hi2";

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="h-screen gap-2 flex text-center flex-col justify-center mx-auto">
      <div className="flex justify-start text-start flex-col w-fit mx-auto">
        <p className="text-lg font-medium">{error?.message}</p>
        <p className="text-xl font-semibold">
          Something went wrong, please try refresh page with the button below!
        </p>
      </div>
      <Button
        size="lg"
        color="light"
        className="border-0 w-fit mx-auto"
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
