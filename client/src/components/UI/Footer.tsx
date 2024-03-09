import { Button } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  variant: number;
  children?: React.ReactNode;
  className?: string;
};

const Footer: React.FC<Props> = ({ variant, children, className }) => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate("..", { replace: true });
  };

  return (
    <div className={`w-full mt-auto ${className}`}>
      <hr />
      <div
        className={`flex justify-${
          variant === 1 ? "end" : "between  mb-3 mt-3"
        }`}
      >
        {variant === 2 && (
          <Button className="hidden lg:flex" color="light" onClick={goBack}>
            <p className="xxl:text-xl">Back</p>
          </Button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Footer;
