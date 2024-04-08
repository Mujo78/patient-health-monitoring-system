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
    <Tooltip content={tooltip_content} className="xxl:!text-xl">
      <Card className="flex h-14 max-w-fit cursor-pointer ">
        <div className="flex h-full items-center gap-6">
          {children}
          <p className="xxl:!text-xl">{text}</p>
        </div>
      </Card>
    </Tooltip>
  );
};

export default CustomCardTooltip;
