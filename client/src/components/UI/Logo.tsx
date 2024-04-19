import React from "react";
import img from "../../assets/hospital-logos.webp";

const Logo: React.FC = () => {
  return (
    <img src={img} className="h-auto w-28 xxl:!w-56" alt="hospital-logo" />
  );
};

export default Logo;
