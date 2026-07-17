import type { ProductFormValues } from '../validation/product.validation';

export type { ProductFormValues };

/** Product shape returned by the API (edit / duplicate). */
export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discount?: number;
  stock?: number;
  category?: string | { _id: string; name?: string; slug?: string };
  subCategory?: string;
  brand?: string;
  images?: Array<{ url: string; alt?: string } | string>;
  specifications?: Array<{ key: string; value: string }>;
  variants?: Array<{
    color?: string;
    size?: string;
    price?: number;
    stock?: number;
  }>;
  availability?: 'In Stock' | 'Out of Stock' | 'Pre Order';
  isFeatured?: boolean;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AddProductInput = ProductFormValues;
