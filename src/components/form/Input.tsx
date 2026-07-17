import { useState, type InputHTMLAttributes } from "react";
import { 
  useFormContext,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type InputSize = "medium" | "large";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  name?: string;
  size?: InputSize;
  registerOptions?: RegisterOptions<FieldValues, string>;
}

const Input = ({
  name,
  type = "text",
  size = "medium",
  className,
  registerOptions,
  ...props
}: InputProps) => {
  const formContext = useFormContext();
  const register = formContext?.register;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const sizes: Record<InputSize, string> = {
    medium: "py-[10px]",
    large: "py-[12px]",
  };

  const inputType =
    type === "password" && isPasswordVisible ? "text" : type;

  const registerProps =
    name && register ? register(name, registerOptions) : {};

  return (
    <div className="relative w-full">
      <input
        id={name}
        type={inputType}
        {...registerProps}
        className={`w-full text-sm px-4 pr-10 border border-border bg-bg-main text-text-primary placeholder:text-text-tertiary focus:outline-
          rounded-lg
focus:border-primary
focus:ring-2
focus:ring-primary/15
focus:shadow-[0_0_0_1px_hsl(var(--primary))]
transition-all
duration-200 ${sizes[size]} ${className}`}
        {...props}
      />

      {type === "password" && (
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          {isPasswordVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      )}
    </div>
  );
};

export default Input;