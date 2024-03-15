import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  half?: boolean;
  over?: boolean;
  gap?: number;
  fixed?: string;
};

const FormRow: React.FC<Props> = ({
  children,
  gap,
  over,
  className,
  fixed,
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div
      className={`flex flex-wrap gap-${
        gap ?? 2
      } ${className} w-full justify-between`}
    >
      {childrenArray[0] && <div className="flex-grow">{childrenArray[0]}</div>}
      {childrenArray[1] && (
        <div
          className={
            fixed ? fixed : over ? "flex-grow md:!flex-grow-0" : "flex-grow"
          }
        >
          {childrenArray[1]}
        </div>
      )}
    </div>
  );
};

export default FormRow;
