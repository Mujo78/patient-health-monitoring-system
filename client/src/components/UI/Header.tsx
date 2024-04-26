import React from "react";

type Props = {
  text: string;
  size?: number;
  className?: string;
  bold?: boolean;
  position?: "start" | "center" | "end";
  border?: boolean;
  normal?: boolean;
};

const Header: React.FC<Props> = ({
  position,
  text,
  size,
  className,
  bold,
  border,
  normal,
}) => {
  return (
    <div>
      <p
        className={`font-${bold ? "bold" : "semibold"} text-${
          position ?? "center"
        } text-${
          size
            ? `${size === 1 ? "" : size}xl ${
                normal ? `lg:!text-${size + 2}xl` : `xxl:!text-${size + 2}xl`
              }`
            : "2xl xxl:!text-4xl"
        } ${className}`}
      >
        {text}
      </p>
      {border && <hr />}
    </div>
  );
};

export default Header;
