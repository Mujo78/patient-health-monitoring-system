import React from "react";

type Props = {
  text: string;
  size?: string;
  className?: string;
  bold?: boolean;
  position: "start" | "center" | "end";
};

const Header: React.FC<Props> = ({ position, text, size, className, bold }) => {
  return (
    <header>
      <p
        className={`font-${bold ? "bold" : "semibold"} text-${
          position ?? "center"
        } text-${size ? size : "2xl"} xxl:text-4xl ${className}`}
      >
        {text}
      </p>
      <hr />
    </header>
  );
};

export default Header;
