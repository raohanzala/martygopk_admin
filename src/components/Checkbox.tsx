import React from 'react';
import { useField } from 'formik';
import { cn } from '../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label?: string;
  helperText?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  helperText,
  className,
  ...props
}) => {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          {...field}
          {...props}
          type="checkbox"
          id={name}
          className={cn(
            'w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30',
            hasError && 'border-error',
            className
          )}
        />
        {label && (
          <span className="text-sm font-medium text-text-primary">{label}</span>
        )}
      </label>
      {(meta.touched && meta.error) && (
        <p className="mt-1 text-xs text-error">{meta.error}</p>
      )}
      {helperText && !meta.error && (
        <p className="mt-1 text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  );
};

export default Checkbox;
