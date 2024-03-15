import { Label, TextInput } from "flowbite-react";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { FieldError } from "react-hook-form";

type Props = {
  value?: string;
  error?: FieldError | undefined;
  children?: React.ReactNode;
} & ComponentPropsWithoutRef<typeof TextInput>;

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { value, error, id, children, ...props },
  ref
) {
  return (
    <>
      <div className="mb-0.5 mt-1 block">
        <Label htmlFor={id} value={value} className="text-sm xxl:!text-lg" />
      </div>
      <TextInput id={id} {...props} ref={ref} className="xxl:!text-lg" />
      <div className="h-3 mt-0.5">
        {error && (
          <p className="text-red-600 text-xs xxl:!text-[1rem]">
            {error.message}
          </p>
        )}
        {children}
      </div>
    </>
  );
});

export default Input;
