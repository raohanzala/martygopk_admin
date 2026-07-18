import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryForm from '../components/CategoryForm';
import { Spinner } from '@/components';
import { useCategory } from '../hooks/useCategory';
import { useUpdateCategory } from '../hooks/useUpdateCategory';

const EditCategory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { category, isCategoryLoading } = useCategory(id || '');
  const { updateCategoryMutation, isUpdatingCategory } = useUpdateCategory();

  const handleSubmit = (_values: unknown, formData: FormData) => {
    if (!id) return;

    updateCategoryMutation(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate('/categories');
        },
      }
    );
  };

  if (isCategoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Category not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Form */}
      <CategoryForm
        categoryToEdit={category}
        onSubmit={handleSubmit}
        isSubmitting={isUpdatingCategory}
      />
    </div>
  );
};

export default EditCategory;
