import { Spinner, SpinnerSizes } from "flowbite-react";
import React from "react";

type Props = {
  size?: keyof SpinnerSizes;
  fromTop?: number;
};

const CustomSpinner: React.FC<Props> = ({ size, fromTop }) => {
  return (
    <div
      className={`${
        fromTop ? `mt-${fromTop}` : "justify-center"
      } flex items-center w-full h-full`}
    >
      <Spinner size={size ?? "md"} />
    </div>
  );
};

export default CustomSpinner;
