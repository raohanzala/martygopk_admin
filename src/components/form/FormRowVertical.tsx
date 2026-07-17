import { type ReactNode } from "react";
import { useFormContext, type FieldErrors } from "react-hook-form";

function getErrorByPath(errors: FieldErrors, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = errors;

  for (const p of parts) {
    if (current == null || typeof current !== "object") return undefined;

    const num = Number(p);

    current =
      !Number.isNaN(num) && Array.isArray(current)
        ? current[num]
        : (current as Record<string, unknown>)[p];
  }

  return typeof (current as { message?: string })?.message === "string"
    ? (current as { message: string }).message
    : undefined;
}

interface FormRowVerticalProps {
  label?: string;
  name: string;
  id?: string;
  icon?: ReactNode;
  children: ReactNode;
  required?: boolean;
  helperText?: string;
}

const FormRowVertical = ({
  label,
  name,
  id,
  icon,
  children,
  required = false,
  helperText,
}: FormRowVerticalProps) => {
  // const {
  //   formState: { errors },
  // } = useFormContext() || {};

  const {
    formState
  } = useFormContext() || {};

  const errors = formState?.errors;

  const error =
    (errors?.[name]?.message as string | undefined) ??
    getErrorByPath(errors, name);

  const fieldId = id || name;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={fieldId}
          className="flex items-center gap-1 text-sm font-medium text-text-secondary"
        >
          {icon}
          <span>{label}</span>

          {required && (
            <span className="text-status-error" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {!error && helperText && (
        <p className="text-xs text-text-tertiary">{helperText}</p>
      )}

      {error && (
        <div
          className="flex items-center gap-1 text-xs text-status-error"
          role="alert"
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>

          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormRowVertical;