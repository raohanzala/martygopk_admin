import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BrandForm from '../components/BrandForm';
import { Spinner } from '@/components';
import { useBrand } from '../hooks/useBrand';
import { useUpdateBrand } from '../hooks/useUpdateBrand';

const EditBrand: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { brand, isBrandLoading } = useBrand(id || '');
  const { updateBrandMutation, isUpdatingBrand } = useUpdateBrand();

  const handleSubmit = (_values: unknown, formData: FormData) => {
    if (!id) return;

    updateBrandMutation(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate('/brands');
        },
      }
    );
  };

  if (isBrandLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Brand not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/brands')}
          className="text-sm text-text-muted hover:text-text-primary mb-4"
        >
          ← Back to Brands
        </button>
        <h1 className="text-2xl font-semibold text-text-primary">
          Edit brand
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Update brand information
        </p>
      </div>

      {/* Form */}
      <BrandForm
        brandToEdit={brand}
        onSubmit={handleSubmit}
        isSubmitting={isUpdatingBrand}
      />
    </div>
  );
};

export default EditBrand;
