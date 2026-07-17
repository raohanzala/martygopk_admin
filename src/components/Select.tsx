import React, { useState, useRef, useEffect } from 'react';
import { useField } from 'formik';
import { IoChevronDown } from 'react-icons/io5';
import { cn } from '../utils/cn';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  name: string;
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  name,
  label,
  helperText,
  error: externalError,
  options,
  placeholder,
  className,
  required,
  disabled,
  ...props
}) => {
  const [field, meta, helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasError = (meta.touched && meta.error) || externalError;
  const errorMessage = externalError || (meta.touched && meta.error ? meta.error : '');

  const selectedOption = options.find((opt) => String(opt.value) === String(field.value));
  const displayValue = selectedOption ? selectedOption.label : '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        helpers.setTouched(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [helpers]);

  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    } else {
      const idx = options.findIndex((opt) => String(opt.value) === String(field.value));
      setFocusedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, field.value, options]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0 && options[focusedIndex] && !options[focusedIndex].disabled) {
          helpers.setValue(options[focusedIndex].value);
          helpers.setTouched(true);
          setIsOpen(false);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
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
      default:
        break;
    }
  };

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    helpers.setValue(option.value);
    helpers.setTouched(true);
    setIsOpen(false);
  };

  const isDisabled = disabled ?? props['aria-disabled'];

  return (
    <div ref={containerRef} className={cn('w-full relative', className)} {...props}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-text-primary mb-1"
        >
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}

      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${name}-listbox`}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full px-3 py-2 rounded-md border transition-all duration-150',
          'bg-surface text-text-primary text-sm h-9',
          'flex items-center justify-between gap-2 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0',
          'border-border hover:border-primary/50 focus:border-primary',
          isDisabled && 'opacity-50 cursor-not-allowed bg-background',
          className
        )}
      >
        <span className={cn(!displayValue && 'text-text-muted')}>
          {displayValue || placeholder}
        </span>
        <IoChevronDown
          className={cn(
            'w-4 h-4 text-text-muted shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </div>

      {isOpen && (
        <ul
          id={`${name}-listbox`}
          role="listbox"
          className={cn(
            'absolute z-50 w-full mt-1 py-1 rounded-md border border-border',
            'bg-surface shadow-lg max-h-60 overflow-auto',
            'animate-in fade-in-0 zoom-in-95 duration-150'
          )}
        >
          {placeholder && !required && (
            <li
              role="option"
              aria-selected={!field.value}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer transition-colors',
                !field.value ? 'text-primary bg-primary/5 font-medium' : 'text-text-muted hover:bg-background',
                focusedIndex === -1 && 'bg-primary/5'
              )}
              onClick={() => {
                helpers.setValue('');
                helpers.setTouched(true);
                setIsOpen(false);
              }}
            >
              {placeholder}
            </li>
          )}
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={String(option.value) === String(field.value)}
              aria-disabled={option.disabled}
              className={cn(
                'px-3 py-2 text-sm cursor-pointer transition-colors',
                String(option.value) === String(field.value)
                  ? 'text-primary bg-primary/10 font-medium'
                  : 'text-text-primary hover:bg-background',
                option.disabled && 'opacity-50 cursor-not-allowed',
                focusedIndex === index && 'bg-background'
              )}
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
        >
          {errorMessage || helperText}
        </p>
      )}

    </div>
  );
};

export default Select;
