import { appendFiles, appendIfExists } from '@/utils/formDataBuilder';
import type { CategoryFormValues } from '../types/category.types';

export interface CategoryFormFiles {
  image?: File | null;
}

export function buildCategoryFormData(
  values: CategoryFormValues,
  files: CategoryFormFiles
): FormData {
  const formData = new FormData();

  appendIfExists(formData, 'name', values.name.trim());
  appendIfExists(formData, 'slug', values.slug.trim());
  appendIfExists(formData, 'description', (values.description ?? '').trim());
  appendIfExists(formData, 'isActive', values.isActive);
  appendIfExists(formData, 'isFeatured', values.isFeatured);

  if (values.parentCategory) {
    appendIfExists(formData, 'parentCategory', values.parentCategory);
  }

  appendFiles(formData, 'image', files.image ? [files.image] : undefined);

  return formData;
}
