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
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/categories')}
          className="text-sm text-text-muted hover:text-text-primary mb-4"
        >
          ← Back to Categories
        </button>
        <h1 className="text-2xl font-semibold text-text-primary">
          Edit category
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Update category information
        </p>
      </div>

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
