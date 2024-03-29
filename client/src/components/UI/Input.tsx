import { Label, TextInput } from "flowbite-react";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { FieldError } from "react-hook-form";

type Props = {
  label?: string;
  error?: FieldError | undefined;
  children?: React.ReactNode;
} & ComponentPropsWithoutRef<typeof TextInput>;

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, id, children, ...props },
  ref,
) {
  return (
    <>
      <div className="mb-0.5 mt-1 block">
        <Label htmlFor={id} value={label} className="text-sm xxl:!text-lg" />
      </div>
      <TextInput id={id} {...props} ref={ref} className="xxl:!text-lg" />
      <div className="mt-0.5 h-3">
        {error && (
          <p className="text-xs text-red-600 xxl:!text-[1rem]">
            {error.message}
          </p>
        )}
        {children}
      </div>
    </>
  );
});

export default Input;
