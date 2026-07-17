import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { useAddProduct } from '../hooks/useAddProduct';
import { useProduct } from '../hooks/useProduct';
import type { Product } from '../types/product.types';
import { Spinner } from '@/components';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const duplicateId = searchParams.get('duplicate');
  const isDuplicate = !!duplicateId;

  const { product: duplicateProduct, isProductLoading: isDuplicateLoading } = useProduct(duplicateId || '');
  const { addProductMutation, isAddingProduct } = useAddProduct();

  const handleSubmit = async (_values: unknown, formData: FormData) => {
    addProductMutation(formData, {
      onSuccess: () => {
        navigate('/products');
      },
    });
  };

  if (isDuplicate && isDuplicateLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isDuplicate && duplicateId && !duplicateProduct) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/products')}
          className="text-sm text-text-muted hover:text-text-primary mb-4"
        >
          ← Back to Products
        </button>
        <p className="text-text-muted">Product not found. Cannot duplicate.</p>
      </div>
    );
  }

  const initialValues: Product | undefined =
    isDuplicate && duplicateProduct
      ? { ...(duplicateProduct as Product), slug: '' }
      : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/products')}
          className="text-sm text-text-muted hover:text-text-primary mb-4"
        >
          ← Back to Products
        </button>
        <h1 className="text-2xl font-semibold text-text-primary">
          {isDuplicate ? 'Duplicate product' : 'Add product'}
        </h1>
        <p className="text-sm text-text-muted mt-1">
          {isDuplicate
            ? 'Review and edit the copied details below, then save to create a new product.'
            : 'Create a new product for your store'}
        </p>
      </div>

      {/* Form */}
      <ProductForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isSubmitting={isAddingProduct}
      />
    </div>
  );
};

export default AddProduct;
