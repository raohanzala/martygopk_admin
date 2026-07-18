import { useFieldArray, useFormContext } from 'react-hook-form';
import { IoAdd, IoTrash } from 'react-icons/io5';
import Button from '../Button';

interface DynamicFieldArrayProps<T> {
  name: string;
  label?: string;
  defaultItem: T;
  addLabel?: string;
  emptyMessage?: string;
  renderFields: (index: number) => React.ReactNode;
}

function DynamicFieldArray<T>({
  name,
  label,
  defaultItem,
  addLabel = 'Add item',
  emptyMessage = 'No items yet. Click below to add one.',
  renderFields,
}: DynamicFieldArrayProps<T>) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-4">
      {label && (
        <h3 className="text-sm font-medium text-text-primary">{label}</h3>
      )}

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-background px-4 py-8 text-center">
          <p className="text-sm text-text-muted">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {fields.map((field, index) => (
            <li
              key={field.id}
              className="rounded-lg border border-border bg-background p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
                  Item {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-error hover:bg-error/10 transition-colors"
                  aria-label={`Remove item ${index + 1}`}
                >
                  <IoTrash className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
              {renderFields(index)}
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        leftIcon={<IoAdd className="h-4 w-4" />}
        onClick={() => append(defaultItem)}
      >
        {addLabel}
      </Button>
    </div>
  );
}

export default DynamicFieldArray;
