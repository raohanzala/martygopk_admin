import { type TextareaHTMLAttributes } from "react";
import {
  useFormContext,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";

type InputSize = "medium" | "large";

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  name?: string;
  size?: InputSize;
  registerOptions?: RegisterOptions<FieldValues, string>;
}

const Textarea = ({
  name,
  size = "medium",
  className,
  registerOptions,
  ...props
}: TextareaProps) => {
  const formContext = useFormContext();
  const register = formContext?.register;

  const sizes: Record<InputSize, string> = {
    medium: "py-[10px]",
    large: "py-[12px]",
  };

  const registerProps =
    name && register ? register(name, registerOptions) : {};

  return (
    <div className="relative w-full">
      <textarea
        id={name}
        {...registerProps}
        className={`w-full min-h-[100px] text-sm px-4 pr-10 border border-border bg-bg-main text-text-primary placeholder:text-text-tertiary focus:outline-
          rounded-lg
focus:border-primary
focus:ring-2
focus:ring-primary/15
focus:shadow-[0_0_0_1px_hsl(var(--primary))]
transition-all
duration-200 ${sizes[size]} ${className}`}
        {...props}
      />
    </div>
  );
};

export default Textarea;