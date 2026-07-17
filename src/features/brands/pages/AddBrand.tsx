import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrandForm from '../components/BrandForm';
import { useAddBrand } from '../hooks/useAddBrand';

const AddBrand: React.FC = () => {
  const navigate = useNavigate();
  const { addBrandMutation, isAddingBrand } = useAddBrand();

  const handleSubmit = (_values: unknown, formData: FormData) => {
    addBrandMutation(formData, {
      onSuccess: () => {
        navigate('/brands');
      },
    });
  };

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
          Add brand
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Create a new product brand
        </p>
      </div>

      {/* Form */}
      <BrandForm
        onSubmit={handleSubmit}
        isSubmitting={isAddingBrand}
      />
    </div>
  );
};

export default AddBrand;
