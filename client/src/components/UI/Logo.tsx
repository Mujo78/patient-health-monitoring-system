import React from "react";
import img from "../../assets/hospital-logos.png";

const Logo: React.FC = () => {
  return <img src={img} className="w-28 h-auto xxl:!w-56" />;
};

export default Logo;
