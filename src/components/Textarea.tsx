import React from 'react';
import { useField } from 'formik';
import { cn } from '../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  helperText?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  helperText,
  error: externalError,
  className,
  ...props
}) => {
  const [field, meta] = useField(name);
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

      <textarea
        {...field}
        {...props}
        id={name}
        className={cn(
          'w-full px-3 py-2 rounded-md border transition-all duration-150',
          'bg-surface text-text-primary placeholder:text-text-muted text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 resize-none',
          'border-border hover:border-primary/50 focus:border-primary',
          className
        )}
      />

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

export default Textarea;
