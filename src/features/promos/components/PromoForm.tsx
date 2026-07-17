import { Formik, Form } from 'formik';
import { promoSchema } from '@/validation';
import { Button, Card, Input, Checkbox, Select } from '@/components';
import type { PromoFormValues } from '../types/promo.types';
import type { Promo } from '@/api/promos';

const typeOptions = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed amount' },
];

interface PromoFormProps {
  promoToEdit?: Promo | null;
  onSubmit: (data: Partial<Promo>) => void;
  isSubmitting: boolean;
}

const parseDate = (d: string | null | undefined): string => {
  if (!d) return '';
  const date = new Date(d);
  return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16);
};

const PromoForm: React.FC<PromoFormProps> = ({
  promoToEdit,
  onSubmit,
  isSubmitting,
}) => {
  const initialValues: PromoFormValues = {
    code: promoToEdit?.code || '',
    type: promoToEdit?.type || 'percentage',
    value: promoToEdit?.value ?? 0,
    minOrderAmount: promoToEdit?.minOrderAmount ?? '',
    maxDiscountAmount: promoToEdit?.maxDiscountAmount ?? '',
    usageLimit: promoToEdit?.usageLimit ?? '',
    perUserLimit: promoToEdit?.perUserLimit ?? '',
    validFrom: parseDate(promoToEdit?.validFrom),
    validTo: parseDate(promoToEdit?.validTo),
    isActive: promoToEdit?.isActive ?? true,
    applicableTo: promoToEdit?.applicableTo || 'all',
  };

  const handleSubmit = (values: PromoFormValues) => {
    const payload: Partial<Promo> = {
      code: values.code.trim().toUpperCase(),
      type: values.type,
      value: Number(values.value),
      minOrderAmount: values.minOrderAmount === '' ? null : Number(values.minOrderAmount),
      maxDiscountAmount: values.maxDiscountAmount === '' ? null : Number(values.maxDiscountAmount),
      usageLimit: values.usageLimit === '' ? null : Number(values.usageLimit),
      perUserLimit: values.perUserLimit === '' ? null : Number(values.perUserLimit),
      validFrom: values.validFrom ? new Date(values.validFrom).toISOString() : null,
      validTo: values.validTo ? new Date(values.validTo).toISOString() : null,
      isActive: values.isActive,
      applicableTo: values.applicableTo,
    };
    onSubmit(payload);
  };

  const isCreate = !promoToEdit;

  return (
    <Formik<PromoFormValues>
      initialValues={initialValues}
      validationSchema={promoSchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Promo code">
            <div className="space-y-4">
              <Input
                name="code"
                label="Code"
                placeholder="e.g. SAVE20"
                required
                disabled={!!promoToEdit}
              />
              {promoToEdit && (
                <p className="text-xs text-text-muted">Code cannot be changed after creation.</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  name="type"
                  label="Type"
                  options={typeOptions}
                  placeholder="Select type"
                />
                <Input
                  name="value"
                  label="Value"
                  type="number"
                  min={0}
                  step={0.01}
                  required
                />
              </div>
              <Input
                name="minOrderAmount"
                label="Minimum order amount (optional)"
                type="number"
                min={0}
                placeholder="Leave empty for no minimum"
              />
              <Input
                name="maxDiscountAmount"
                label="Max discount cap (optional, for percentage)"
                type="number"
                min={0}
                placeholder="Leave empty for no cap"
              />
              <Checkbox name="isActive" label="Active (customers can use this code)" />
            </div>
          </Card>

          <Card title="Usage & validity">
            <div className="space-y-4">
              <Input
                name="usageLimit"
                label="Total usage limit (optional)"
                type="number"
                min={0}
                placeholder="Leave empty for unlimited"
              />
              <Input
                name="perUserLimit"
                label="Uses per user (optional)"
                type="number"
                min={0}
                placeholder="Leave empty for unlimited"
              />
              <Input
                name="validFrom"
                label="Valid from (optional)"
                type="datetime-local"
              />
              <Input
                name="validTo"
                label="Valid until (optional)"
                type="datetime-local"
              />
              {promoToEdit && promoToEdit.usedCount > 0 && (
                <p className="text-sm text-text-muted">
                  Used {promoToEdit.usedCount} time(s) so far.
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="submit" isLoading={isSubmitting}>
            {isCreate ? 'Create promo' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default PromoForm;
