import React from "react";

type Props = {
  text?: string;
  size?: string;
  className?: string;
};

const ErrorMessage: React.FC<Props> = ({ text, size, className }) => {
  return (
    <div className="h-4 font-Poppins">
      <p className={`text-red-600 text-${size ? size : "xs"} ${className}`}>
        {text}
      </p>
    </div>
  );
};

export default ErrorMessage;
