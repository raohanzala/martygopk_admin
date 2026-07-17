import { useFormContext } from 'react-hook-form';
import { Card } from '@/components';
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
            <select {...register('category')} className={selectClassName} id="category">
              <option value="">Select category</option>
              {categories.map((c: { _id: string; name: string }) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormRowVertical>

          <FormRowVertical label="Sub category" name="subCategory">
            <Input name="subCategory" placeholder="Optional sub category" />
          </FormRowVertical>

          <FormRowVertical label="Brand" name="brand">
            <select {...register('brand')} className={selectClassName} id="brand">
              <option value="">No Brand</option>
              {brands.map((b: { _id: string; name: string }) => (
                <option key={b._id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </FormRowVertical>
        </div>
      </Card>

      <Card title="Availability">
        <FormRowVertical label="Status" name="availability">
          <select
            {...register('availability')}
            className={selectClassName}
            id="availability"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Pre Order">Pre Order</option>
          </select>
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
