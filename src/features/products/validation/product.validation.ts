import { z } from 'zod';

export const productSpecificationSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

export const productVariantSchema = z.object({
  color: z.string().optional().or(z.literal('')),
  size: z.string().optional().or(z.literal('')),
  price: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0).optional(),
});

export const addProductSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120, 'Max 120 characters')
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'Use lowercase letters, numbers, and hyphens (e.g. luxury-watches)'
    ),
  description: z.string().trim().min(1, 'Description is required'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
  discount: z.coerce.number().min(0, 'Discount cannot be negative').default(0),
  stock: z.coerce.number().min(0, 'Stock cannot be negative').default(0),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional().or(z.literal('')),
  brand: z.string().optional().or(z.literal('')),
  specifications: z.array(productSpecificationSchema).default([]),
  variants: z.array(productVariantSchema).default([]),
  availability: z
    .enum(['In Stock', 'Out of Stock', 'Pre Order'])
    .default('In Stock'),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof addProductSchema>;

export const PRODUCT_FORM_DEFAULTS: ProductFormValues = {
  title: '',
  slug: '',
  description: '',
  price: 0,
  discount: 0,
  stock: 0,
  category: '',
  subCategory: '',
  brand: '',
  specifications: [],
  variants: [],
  availability: 'In Stock',
  isFeatured: false,
  published: true,
};
