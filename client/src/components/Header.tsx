import React from "react";

type Props = {
  text: string;
  size?: string;
  className?: string;
};

const Header: React.FC<Props> = ({ text, size, className }) => {
  return (
    <header>
      <p className={`font-semibold text-${size ? size : "2xl"} ${className}`}>
        {text}
      </p>
      <hr />
    </header>
  );
};

export default Header;
