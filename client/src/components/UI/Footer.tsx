import { Button } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  variant: number;
  children?: React.ReactNode;
  route?: string;
};

const Footer: React.FC<Props> = ({ variant, route, children }) => {
  const navigate = useNavigate();
  const goBack = () => {
    if (route) {
      navigate(route);
    } else {
      navigate("../", { replace: true });
    }
  };

  return (
    <div className="w-full mt-auto font-Poppins hidden sm:flex">
      <hr />
      <div
        className={`flex justify-${
          variant === 1 ? "end" : "between  mb-3 mt-3"
        }`}
      >
        {variant === 2 && (
          <Button color="light" onClick={goBack}>
            <p className="xxl:text-xl">Back</p>
          </Button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Footer;
