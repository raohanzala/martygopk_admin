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

      {/* Form */}
      <CategoryForm
        onSubmit={handleSubmit}
        isSubmitting={isAddingCategory}
      />
    </div>
  );
};

export default AddCategory;
