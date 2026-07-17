import { appendIfExists } from '@/utils/formDataBuilder';
import type { ProductFormValues } from '../validation/product.validation';

export type ProductImageSlot = 'image1' | 'image2' | 'image3' | 'image4';

export const PRODUCT_IMAGE_SLOTS: ProductImageSlot[] = [
  'image1',
  'image2',
  'image3',
  'image4',
];

interface ProductFiles {
  images: Partial<Record<ProductImageSlot, File | null>>;
}

export function buildProductFormData(
  values: ProductFormValues,
  files: ProductFiles
) {
  const formData = new FormData();

  appendIfExists(formData, 'title', values.title);
  appendIfExists(formData, 'slug', values.slug?.trim());
  appendIfExists(formData, 'description', values.description);
  appendIfExists(formData, 'price', values.price);
  appendIfExists(formData, 'discount', values.discount ?? 0);
  appendIfExists(formData, 'stock', values.stock ?? 0);
  appendIfExists(formData, 'category', values.category);
  appendIfExists(formData, 'subCategory', values.subCategory);
  appendIfExists(formData, 'brand', values.brand || 'No Brand');
  appendIfExists(formData, 'availability', values.availability);
  formData.append('isFeatured', String(Boolean(values.isFeatured)));
  formData.append('published', String(Boolean(values.published)));

  const specifications = (values.specifications ?? []).filter(
    (spec) => spec.key?.trim() && spec.value?.trim()
  );
  formData.append('specifications', JSON.stringify(specifications));

  const variants = (values.variants ?? []).filter(
    (variant) =>
      variant &&
      (variant.color || variant.size || variant.price || variant.stock)
  );
  formData.append('variants', JSON.stringify(variants));

  PRODUCT_IMAGE_SLOTS.forEach((slot) => {
    const file = files.images[slot];
    if (file) {
      formData.append(slot, file);
    }
  });

  return formData;
}
