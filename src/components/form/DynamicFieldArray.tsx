import { useFieldArray, useFormContext } from "react-hook-form";

interface DynamicFieldArrayProps<T> {
  name: string;
  label?: string;
  defaultItem: T;
  renderFields: (index: number) => React.ReactNode;
}

function DynamicFieldArray<T>({
  name,
  label,
  defaultItem,
  renderFields,
}: DynamicFieldArrayProps<T>) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="flex flex-col gap-4">
      {label && (
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border rounded-lg p-4 flex flex-col gap-3"
        >
          {renderFields(index)}

          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append(defaultItem)}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm w-fit"
      >
        Add
      </button>
    </div>
  );
}

export default DynamicFieldArray;