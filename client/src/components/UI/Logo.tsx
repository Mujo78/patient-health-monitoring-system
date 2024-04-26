import React from "react";
import img from "../../assets/hospital-logos.webp";

const Logo: React.FC = () => {
  return <img src={img} width={112} height={112} alt="hospital-logo" />;
};

export default Logo;
