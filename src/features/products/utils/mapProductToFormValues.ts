import type { Product } from '../types/product.types';
import {
  PRODUCT_FORM_DEFAULTS,
  type ProductFormValues,
} from '../validation/product.validation';

function getCategoryId(
  category: Product['category']
): string {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category._id ?? '';
}

function getImageUrls(images: Product['images']): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => (typeof img === 'string' ? img : img?.url))
    .filter((url): url is string => Boolean(url));
}

export function mapProductToFormValues(
  product?: Product | null
): ProductFormValues {
  if (!product) return { ...PRODUCT_FORM_DEFAULTS };

  return {
    title: product.title ?? '',
    slug: product.slug ?? '',
    description: product.description ?? '',
    price: product.price ?? 0,
    discount: product.discount ?? 0,
    stock: product.stock ?? 0,
    category: getCategoryId(product.category),
    subCategory: product.subCategory ?? '',
    brand: product.brand ?? '',
    specifications: Array.isArray(product.specifications)
      ? product.specifications.map((spec) => ({
          key: spec.key ?? '',
          value: spec.value ?? '',
        }))
      : [],
    variants: Array.isArray(product.variants)
      ? product.variants.map((variant) => ({
          color: variant.color ?? '',
          size: variant.size ?? '',
          price: variant.price ?? 0,
          stock: variant.stock ?? 0,
        }))
      : [],
    availability: product.availability ?? 'In Stock',
    isFeatured: product.isFeatured ?? false,
    published: product.published ?? true,
  };
}

export function getProductImageUrls(product?: Product | null): string[] {
  return getImageUrls(product?.images);
}
