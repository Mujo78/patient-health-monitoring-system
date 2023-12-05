import { Card, Tooltip } from "flowbite-react";
import React from "react";

type Props = {
  tooltip_content: string;
  text: string | number;
  children: React.ReactNode;
};

const CustomCardTooltip: React.FC<Props> = ({
  tooltip_content,
  text,
  children,
}) => {
  return (
    <Tooltip content={tooltip_content}>
      <Card className="max-w-fit h-14 flex cursor-pointer">
        <div className="flex h-full items-center gap-6">
          {children}
          <p>{text}</p>
        </div>
      </Card>
    </Tooltip>
  );
};

export default CustomCardTooltip;
