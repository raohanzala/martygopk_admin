import { z } from 'zod';
import type { CategoryFormValues } from '../types/category.types';

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(120, 'Max 120 characters')
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      'Use lowercase letters, numbers, and hyphens (e.g. luxury-watches)'
    ),
  description: z.string().optional().or(z.literal('')),
  parentCategory: z.string().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>;

export const CATEGORY_FORM_DEFAULTS: CategoryFormValues = {
  name: '',
  slug: '',
  description: '',
  parentCategory: '',
  isActive: true,
  isFeatured: false,
};
