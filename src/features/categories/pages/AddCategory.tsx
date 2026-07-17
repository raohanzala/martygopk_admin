import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import { useAddCategory } from '../hooks/useAddCategory';

const AddCategory: React.FC = () => {
  const navigate = useNavigate();
  const { addCategoryMutation, isAddingCategory } = useAddCategory();

  const handleSubmit = (_values: unknown, formData: FormData) => {
    addCategoryMutation(formData, {
      onSuccess: () => {
        navigate('/categories');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/categories')}
          className="text-sm text-text-muted hover:text-text-primary mb-4"
        >
          ← Back to Categories
        </button>
        <h1 className="text-2xl font-semibold text-text-primary">
          Add category
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Create a new product category
        </p>
      </div>

      {/* Form */}
      <CategoryForm
        onSubmit={handleSubmit}
        isSubmitting={isAddingCategory}
      />
    </div>
  );
};

export default AddCategory;
