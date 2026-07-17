import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components';
import Form from '@/components/form/Form';
import { ProductFormProvider, useProductFormContext } from '../context/ProductFormContext';
import { buildProductFormData } from '../utils/buildProductFormData';
import {
  getProductImageUrls,
  mapProductToFormValues,
} from '../utils/mapProductToFormValues';
import {
  addProductSchema,
  PRODUCT_FORM_DEFAULTS,
  type ProductFormValues,
} from '../validation/product.validation';
import type { Product } from '../types/product.types';
import ProductMainSection from './form-sections/ProductMainSection';
import ProductMediaSection from './form-sections/ProductMediaSection';
import ProductSidebar from './form-sections/ProductSidebar';
import SpecificationsSection from './form-sections/SpecificationsSection';
import VariantsSection from './form-sections/VariantsSection';

interface ProductFormProps {
  initialValues?: Product | null;
  onSubmit: (values: ProductFormValues, formData: FormData) => void;
  isSubmitting: boolean;
}

function ProductFormInner({
  initialValues: productToEdit,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  const { imageFiles } = useProductFormContext();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(addProductSchema) as Resolver<ProductFormValues>,
    defaultValues: PRODUCT_FORM_DEFAULTS,
  });

  const { reset } = methods;

  useEffect(() => {
    reset(mapProductToFormValues(productToEdit));
  }, [productToEdit, reset]);

  const handleSubmit = (values: ProductFormValues) => {
    const formData = buildProductFormData(values, { images: imageFiles });
    onSubmit(values, formData);
  };

  return (
    <Form
      methods={methods}
      onSubmit={handleSubmit}
      disabled={isSubmitting}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProductMainSection />
          <ProductMediaSection />
          <SpecificationsSection />
          <VariantsSection />
        </div>

        <ProductSidebar />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline">
          Discard
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save
        </Button>
      </div>
    </Form>
  );
}

export default function ProductForm(props: ProductFormProps) {
  const imageUrls = getProductImageUrls(props.initialValues);

  return (
    <ProductFormProvider initialImageUrls={imageUrls}>
      <ProductFormInner {...props} />
    </ProductFormProvider>
  );
}
