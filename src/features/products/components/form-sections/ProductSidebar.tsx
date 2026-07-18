import { useFormContext } from 'react-hook-form';
import { Card, Select } from '@/components';
import FormRowVertical from '@/components/form/FormRowVertical';
import Input from '@/components/form/Input';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { useBrands } from '@/features/brands/hooks/useBrands';
import type { ProductFormValues } from '../../validation/product.validation';

const selectClassName =
  'w-full text-sm px-4 py-[10px] border border-border bg-bg-main text-text-primary rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all duration-200';

const ProductSidebar = () => {
  const { register } = useFormContext<ProductFormValues>();
  const { categories } = useCategories();
  const { brands } = useBrands();

  return (
    <div className="space-y-6">
      <Card title="Pricing & stock">
        <div className="space-y-4">
          <FormRowVertical label="Price" name="price" required>
            <Input name="price" type="number" min={0} step="0.01" placeholder="0" />
          </FormRowVertical>

          <FormRowVertical label="Discount" name="discount">
            <Input name="discount" type="number" min={0} step="0.01" placeholder="0" />
          </FormRowVertical>

          <FormRowVertical label="Stock" name="stock">
            <Input name="stock" type="number" min={0} placeholder="0" />
          </FormRowVertical>
        </div>
      </Card>

      <Card title="Organization">
        <div className="space-y-4">
          <FormRowVertical label="Category" name="category" required>
            <Select name="category" options={categories.map((c: { _id: string; name: string }) => ({
              value: c._id,
              label: c.name,
            }))} 
            placeholder="Select a category" />
          </FormRowVertical>

          <FormRowVertical label="Sub category" name="subCategory">
            <Input name="subCategory" placeholder="Optional sub category" />
          </FormRowVertical>

          <FormRowVertical label="Brand" name="brand">
            <Select name="brand" 
            options={brands.map((b: { _id: string; name: string }) => ({
              value: b._id,
              label: b.name,
            }))} 
            placeholder="Select a brand" />
          </FormRowVertical>
        </div>
      </Card>

      <Card title="Availability">
        <FormRowVertical label="Status" name="availability">

          <Select name="availability" options={[{ value: 'In Stock', label: 'In Stock' }, { value: 'Out of Stock', label: 'Out of Stock' }, { value: 'Pre Order', label: 'Pre Order' }]} placeholder="Select a status" />
        </FormRowVertical>
      </Card>

      <Card title="Visibility">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('isFeatured')}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-sm font-medium text-text-primary">
              Featured product
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              {...register('published')}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/30"
            />
            <span className="text-sm font-medium text-text-primary">
              Published
            </span>
          </label>
        </div>
      </Card>
    </div>
  );
};

export default ProductSidebar;
