import React from "react";
import defaultImg from "../../assets/default-medicine.jpg";

type Props = {
  url: string;
  className?: string;
  width?: string;
  height?: string;
};

const CustomMedicineImg: React.FC<Props> = ({
  url,
  className,
  width,
  height,
}) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = defaultImg;
  };

  return (
    <img
      crossOrigin="anonymous"
      src={url}
      alt="Medicine-image"
      className={className && className}
      onError={handleImageError}
      width={width}
      height={height}
    />
  );
};

export default CustomMedicineImg;
