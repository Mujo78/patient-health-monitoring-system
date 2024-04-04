import React from "react";

type Props = {
  text?: string;
  size?: string;
  className?: string;
  smHide?: boolean;
  xlHide?: boolean;
};

const ErrorMessage: React.FC<Props> = ({
  text,
  size,
  className,
  smHide,
  xlHide,
}) => {
  return (
    <div
      className={`h-3 font-Poppins ${smHide && "hidden xl:!flex"} ${xlHide && "flex xl:!hidden"}`}
    >
      <p
        className={`text-red-600 text-${
          size ? size : "xs"
        } xxl:!text-[1rem] ${className}`}
      >
        {text}
      </p>
    </div>
  );
};

export default ErrorMessage;
