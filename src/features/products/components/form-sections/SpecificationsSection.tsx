import { Card } from '@/components';
import DynamicFieldArray from '@/components/form/DynamicFieldArray';
import FormRowVertical from '@/components/form/FormRowVertical';
import Input from '@/components/form/Input';

const DEFAULT_SPEC = { key: '', value: '' };

export default function SpecificationsSection() {
  return (
    <Card
      title="Specifications"
      description="Add key/value specification pairs (e.g. Dial Color → Black)."
    >
      <DynamicFieldArray
        name="specifications"
        defaultItem={DEFAULT_SPEC}
        addLabel="Add specification"
        emptyMessage="No specifications yet. Add key/value pairs for this product."
        renderFields={(index) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormRowVertical
              label="Key"
              name={`specifications.${index}.key`}
              required
            >
              <Input
                name={`specifications.${index}.key`}
                placeholder="e.g. Dial Color"
              />
            </FormRowVertical>

            <FormRowVertical
              label="Value"
              name={`specifications.${index}.value`}
              required
            >
              <Input
                name={`specifications.${index}.value`}
                placeholder="e.g. Black"
              />
            </FormRowVertical>
          </div>
        )}
      />
    </Card>
  );
}
