import { Card } from '@/components';
import DynamicFieldArray from '@/components/form/DynamicFieldArray';
import FormRowVertical from '@/components/form/FormRowVertical';
import Input from '@/components/form/Input';

const DEFAULT_VARIANT = {
  color: '',
  size: '',
  price: 0,
  stock: 0,
};

export default function VariantsSection() {
  return (
    <Card
      title="Variants"
      description="Optional variants with color, size, price, and stock."
    >
      <DynamicFieldArray
        name="variants"
        defaultItem={DEFAULT_VARIANT}
        renderFields={(index) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormRowVertical label="Color" name={`variants.${index}.color`}>
              <Input
                name={`variants.${index}.color`}
                placeholder="e.g. Black"
              />
            </FormRowVertical>

            <FormRowVertical label="Size" name={`variants.${index}.size`}>
              <Input
                name={`variants.${index}.size`}
                placeholder="e.g. 42mm"
              />
            </FormRowVertical>

            <FormRowVertical label="Price" name={`variants.${index}.price`}>
              <Input
                name={`variants.${index}.price`}
                type="number"
                placeholder="0"
                min={0}
                step="0.01"
              />
            </FormRowVertical>

            <FormRowVertical label="Stock" name={`variants.${index}.stock`}>
              <Input
                name={`variants.${index}.stock`}
                type="number"
                placeholder="0"
                min={0}
              />
            </FormRowVertical>
          </div>
        )}
      />
    </Card>
  );
}
