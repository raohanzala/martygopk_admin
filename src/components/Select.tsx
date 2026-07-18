import React, { useEffect, useRef, useState } from 'react';
import {
  useController,
  useFormContext,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { IoChevronDown } from 'react-icons/io5';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  registerOptions?: RegisterOptions<FieldValues, string>;
}

const Select: React.FC<SelectProps> = ({
  name,
  options,
  placeholder = 'Select an option',
  disabled,
  required,
  label,
  helperText,
  error: externalError,
  registerOptions,
  className,
  ...props
}) => {
  const { control } = useFormContext();
  const {
    field: { value, onChange, onBlur, ref },
    fieldState: { error: fieldError },
  } = useController({
    name,
    control,
    rules: registerOptions,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const errorMessage = externalError || fieldError?.message;
  const hasError = Boolean(errorMessage);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value ?? '')
  );
  const displayValue = selectedOption?.label ?? '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          setIsOpen(false);
          onBlur();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
      return;
    }
    const idx = options.findIndex(
      (opt) => String(opt.value) === String(value ?? '')
    );
    setFocusedIndex(idx >= 0 ? idx : 0);
  }, [isOpen, value, options]);

  const close = () => {
    setIsOpen(false);
    onBlur();
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChange(option.value);
    close();
  };

  const handleClear = () => {
    onChange('');
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (
          isOpen &&
          focusedIndex >= 0 &&
          options[focusedIndex] &&
          !options[focusedIndex].disabled
        ) {
          handleSelect(options[focusedIndex]);
        } else {
          setIsOpen((open) => !open);
        }
        break;
      case 'Escape':
        close();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex < options.length - 1) {
          let next = focusedIndex + 1;
          while (next < options.length && options[next]?.disabled) next++;
          setFocusedIndex(Math.min(next, options.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          if (focusedIndex <= 0) {
            setFocusedIndex(placeholder && !required ? -1 : 0);
          } else {
            let prev = focusedIndex - 1;
            while (prev >= 0 && options[prev]?.disabled) prev--;
            setFocusedIndex(Math.max(prev, 0));
          }
        }
        break;
      case 'Tab':
        if (isOpen) close();
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      className={cn('relative w-full', className)}
      {...props}
    >
      {label && (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-text-secondary"
        >
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}

      <div
        id={name}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${name}-listbox`}
        aria-disabled={disabled}
        aria-invalid={hasError}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setIsOpen((open) => !open)}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            onBlur();
          }
        }}
        className={cn(
          'flex h-auto w-full cursor-pointer items-center justify-between gap-2',
          'rounded-md border border-border bg-bg-main px-4 py-[8px] text-sm text-text-primary',
          'outline-none transition-all duration-200',
          'hover:border-primary/40',
          'focus:border-primary focus:ring-2 focus:ring-primary/25',
          disabled && 'cursor-not-allowed bg-background opacity-50',
          hasError && 'border-error focus:border-error focus:ring-error/20'
        )}
      >
        <span className={cn('truncate', !displayValue && 'text-text-muted')}>
          {displayValue || placeholder}
        </span>
        <IoChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </div>

      {isOpen && (
        <ul
          id={`${name}-listbox`}
          role="listbox"
          className={cn(
            'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border',
            'bg-surface py-1 shadow-lg'
          )}
        >
          {placeholder && !required && (
            <li
              role="option"
              aria-selected={!value}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm transition-colors',
                !value
                  ? 'bg-primary/5 font-medium text-primary'
                  : 'text-text-muted hover:bg-background',
                focusedIndex === -1 && 'bg-primary/5'
              )}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
            >
              {placeholder}
            </li>
          )}
          {options.map((option, index) => (
            <li
              key={String(option.value)}
              role="option"
              aria-selected={String(option.value) === String(value ?? '')}
              aria-disabled={option.disabled}
              className={cn(
                'cursor-pointer px-3 py-2 text-sm transition-colors',
                String(option.value) === String(value ?? '')
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-text-primary hover:bg-background',
                option.disabled && 'cursor-not-allowed opacity-50',
                focusedIndex === index && 'bg-background'
              )}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {(errorMessage || helperText) && (
        <p
          className={cn(
            'mt-1 text-xs',
            hasError ? 'text-error' : 'text-text-muted'
          )}
          role={hasError ? 'alert' : undefined}
        >
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
