import React, { useState } from 'react';
import { useField } from 'formik';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { cn } from '../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  helperText,
  error: externalError,
  leftIcon,
  rightIcon,
  className,
  type,
  ...props
}) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const hasError = (meta.touched && meta.error) || externalError;
  const errorMessage = externalError || (meta.touched && meta.error ? meta.error : '');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-text-primary mb-1"
        >
          {label}
          {props.required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          {...field}
          {...props}
          type={inputType}
          id={name}
          className={cn(
            'w-full px-3 py-2 rounded-md border transition-all duration-150',
            'bg-surface text-text-primary placeholder:text-text-muted text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 h-9',
            leftIcon ? 'pl-9' : '',
            rightIcon || isPassword ? 'pr-9' : '',
            'border-border hover:border-primary/50 focus:border-primary',
            className
          )}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-0.5 rounded"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <IoEyeOff className="w-4 h-4" />
            ) : (
              <IoEye className="w-4 h-4" />
            )}
          </button>
        ) : (
          rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              {rightIcon}
            </div>
          )
        )}
      </div>

      {(errorMessage || helperText) && (
        <p
          className={cn(
            'mt-1 text-xs',
            hasError ? 'text-error' : 'text-text-muted'
          )}
        >
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
