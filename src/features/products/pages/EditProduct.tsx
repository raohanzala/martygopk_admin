import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { Spinner } from '@/components';
import { useProduct } from '../hooks/useProduct';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import type { ProductFormValues } from '../validation/product.validation';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isProductLoading } = useProduct(id || '');
  const { updateProductMutation, isUpdatingProduct } = useUpdateProduct();

  const handleSubmit = (_values: ProductFormValues, formData: FormData) => {
    if (!id) return;

    updateProductMutation(
      { id, data: formData },
      {
        onSuccess: () => navigate('/products'),
      }
    );
  };

  if (isProductLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Product not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <ProductForm
        initialValues={product}
        onSubmit={handleSubmit}
        isSubmitting={isUpdatingProduct}
        submitLabel="Update product"
      />
    </div>
  );
};

export default EditProduct;
