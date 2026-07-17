import React from 'react';
import { type FieldValues, FormProvider, type UseFormReturn } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

function Form<T extends FieldValues>({ methods, onSubmit, children, className, disabled = false}: FormProps<T>) {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <fieldset disabled={disabled} className={className}>
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
}

export default Form;