import { useState, type InputHTMLAttributes } from 'react';
import {
  useFormContext,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

type InputSize = 'medium' | 'large';

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name?: string;
  size?: InputSize;
  registerOptions?: RegisterOptions<FieldValues, string>;
}

const Input = ({
  name,
  type = 'text',
  size = 'medium',
  className,
  registerOptions,
  ...props
}: InputProps) => {
  const formContext = useFormContext();
  const register = formContext?.register;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const sizes: Record<InputSize, string> = {
    medium: 'py-[8px] rounded-md',
    large: 'py-[12px] rounded-lg',
  };

  const isPassword = type === 'password';
  const inputType = isPassword && isPasswordVisible ? 'text' : type;

  const registerProps =
    name && register ? register(name, registerOptions) : {};

  return (
    <div className="relative w-full">
      <input
        id={name}
        type={inputType}
        {...registerProps}
        className={cn(
          'w-full text-sm px-4 border border-border',
          'bg-bg-main text-text-primary placeholder:text-text-tertiary',
          'outline-none transition-all duration-200',
          'hover:border-primary/40',
          'focus:border-primary focus:ring-2 focus:ring-primary/25',
          sizes[size],
          isPassword ? 'pr-10' : '',
          className
        )}
        {...props}
      />

      {isPassword && (
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
