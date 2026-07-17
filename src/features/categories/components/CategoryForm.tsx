import { Formik, Form } from 'formik';
import { useRef, useState } from 'react';
import { categorySchema } from '@/validation';
import { Button, Card, Input, Textarea, Checkbox } from '@/components';
import type { CategoryFormValues } from '../types/category.types';
import type { Category } from '@/api/categories';
import { buildCategoryFormData } from '../utils/buildCategoryFormData';
import { IoImageOutline, IoClose } from 'react-icons/io5';

interface CategoryFormProps {
  categoryToEdit?: Category | null;
  onSubmit: (values: CategoryFormValues, formData: FormData) => void;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  categoryToEdit,
  onSubmit,
  isSubmitting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    categoryToEdit?.image || null
  );

  const initialValues: CategoryFormValues = {
    name: categoryToEdit?.name || '',
    slug: categoryToEdit?.slug || '',
    description: categoryToEdit?.description || '',
    isActive: categoryToEdit?.isActive ?? true,
    order: categoryToEdit?.order ?? 0,
    showOnHomePage: categoryToEdit?.showOnHomePage ?? false,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(categoryToEdit?.image || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (values: CategoryFormValues) => {
    const formData = buildCategoryFormData(values, { image: imageFile });
    onSubmit(values, formData);
  };

  const isCreate = !categoryToEdit;
  const hasImage = imagePreview || (isCreate && imageFile);

  return (
    <Formik<CategoryFormValues>
      initialValues={initialValues}
      validationSchema={categorySchema}
      onSubmit={handleSubmit}
    >
      <Form className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Basic Information">
              <div className="space-y-4">
                <Input
                  name="name"
                  label="Category name"
                  placeholder="e.g. Luxury Watches"
                  required
                />
                <Input
                  name="slug"
                  label="URL slug"
                  placeholder="e.g. luxury-watches (optional — generated from name if empty)"
                />
                <p className="text-xs text-text-muted -mt-2">
                  Storefront: /products/category/your-slug
                </p>
                <Textarea
                  name="description"
                  label="Description"
                  placeholder="Brief description of this category"
                  rows={4}
                />
                <Checkbox
                  name="isActive"
                  label="Active (visible on storefront)"
                />
                <Input
                  name="order"
                  type="number"
                  label="Display order"
                  placeholder="0"
                  min={0}
                  title="Lower numbers appear first. Used for sorting on home page and lists."
                />
                <Checkbox
                  name="showOnHomePage"
                  label="Show on home page (category section)"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Image">
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={
                        imagePreview.startsWith('data:') ||
                        imagePreview.startsWith('http')
                          ? imagePreview
                          : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${imagePreview}`
                      }
                      alt="Category"
                      className="w-40 h-40 object-cover rounded border border-border"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-2 -right-2 p-1 bg-error text-white rounded hover:bg-error/90"
                      aria-label="Remove image"
                    >
                      <IoClose className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded cursor-pointer hover:bg-background transition-colors">
                    <IoImageOutline className="w-10 h-10 text-text-muted mb-2" />
                    <span className="text-sm text-text-muted mb-1">
                      Add category image
                    </span>
                    <span className="text-xs text-text-muted">
                      JPG, PNG (max 5MB)
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
                {imagePreview && (
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Replace image
                    </Button>
                  </div>
                )}
                {isCreate && !hasImage && (
                  <p className="text-xs text-error">
                    Category image is required
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline">
            Discard
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isCreate && !imageFile}
          >
            {isCreate ? 'Create category' : 'Save changes'}
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default CategoryForm;
