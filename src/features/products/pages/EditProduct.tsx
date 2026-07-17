import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { Spinner } from '@/components';
import { useProduct } from '../hooks/useProduct';
import { useUpdateProduct } from '../hooks/useUpdateProduct';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isProductLoading } = useProduct(id || '');
  const { updateProductMutation, isUpdatingProduct } = useUpdateProduct();

  const handleSubmit = async (_values: unknown, formData: FormData) => {
    if (!id) return;
    
    updateProductMutation(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate('/products');
        },
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
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/products')}
          className="text-sm text-text-muted hover:text-text-primary mb-4"
        >
          ← Back to Products
        </button>
        <h1 className="text-2xl font-semibold text-text-primary">Edit product</h1>
        <p className="text-sm text-text-muted mt-1">
          Update product information
        </p>
      </div>

      {/* Form */}
      <ProductForm
        initialValues={product}
        onSubmit={handleSubmit}
        isSubmitting={isUpdatingProduct}
      />
    </div>
  );
};

export default EditProduct;
