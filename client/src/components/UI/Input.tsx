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
        <Label htmlFor={id} value={value} />
      </div>
      <TextInput id={id} {...props} ref={ref} />
      <div className="h-3 mt-1">
        {error && <p className="text-red-600 text-xs">{error.message}</p>}
        {children}
      </div>
    </>
  );
});

export default Input;
