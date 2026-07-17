import * as Yup from 'yup';

const slugField = Yup.string()
  .trim()
  .max(120, 'Max 120 characters')
  .test(
    'slug-format',
    'Use lowercase letters, numbers, and hyphens (e.g. luxury-watches)',
    (value) => !value || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)
  );

export const categorySchema = Yup.object({
  name: Yup.string().required('Category name is required').trim(),
  slug: slugField,
  description: Yup.string().optional(),
  isActive: Yup.boolean().optional(),
  order: Yup.number()
    .integer()
    .min(0)
    .transform((v) => (v === '' || v === undefined ? 0 : Number(v)))
    .optional(),
  showOnHomePage: Yup.boolean().optional(),
});

export const brandSchema = Yup.object({
  name: Yup.string().required('Brand name is required').trim(),
  slug: slugField,
  isActive: Yup.boolean().optional(),
  order: Yup.number()
    .integer()
    .min(0)
    .transform((v) => (v === '' || v === undefined ? 0 : Number(v)))
    .optional(),
  showOnHomePage: Yup.boolean().optional(),
});

export const blogSchema = Yup.object({
  title: Yup.string().required('Title is required').trim().max(150, 'Max 150 characters'),
  excerpt: Yup.string().optional().max(300, 'Max 300 characters'),
  content: Yup.string().required('Content is required'),
  category: Yup.string()
    .required('Category is required')
    .oneOf(
      ['Luxury Watches', 'Smart Watches', 'Watch Care', 'Buying Guide', 'Trends', 'Lifestyle'],
      'Invalid category'
    ),
  tags: Yup.array().of(Yup.string()).optional(),
  relatedProductIds: Yup.array().of(Yup.string()).optional(),
  seo: Yup.object({
    metaTitle: Yup.string().optional().max(60, 'Max 60 characters'),
    metaDescription: Yup.string().optional().max(160, 'Max 160 characters'),
    keywords: Yup.array().of(Yup.string()).optional(),
  }).optional(),
});

export const userCreateSchema = Yup.object({
  name: Yup.string().required('Name is required').trim(),
  email: Yup.string().required('Email is required').email('Invalid email').trim(),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: Yup.string().oneOf(['user', 'admin'], 'Invalid role').optional(),
});

export const userUpdateSchema = Yup.object({
  name: Yup.string().required('Name is required').trim(),
  email: Yup.string().required('Email is required').email('Invalid email').trim(),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  role: Yup.string().oneOf(['user', 'admin'], 'Invalid role').optional(),
});

export const promoSchema = Yup.object({
  code: Yup.string().required('Code is required').trim().max(50, 'Max 50 characters'),
  type: Yup.string().oneOf(['percentage', 'fixed'], 'Type must be percentage or fixed').required('Type is required'),
  value: Yup.number()
    .required('Value is required')
    .min(0, 'Value must be 0 or more')
    .when('type', {
      is: 'percentage',
      then: (schema) => schema.max(100, 'Percentage cannot exceed 100'),
      otherwise: (schema) => schema,
    }),
  minOrderAmount: Yup.number().min(0).nullable().transform((v) => (v === '' ? null : v)),
  maxDiscountAmount: Yup.number().min(0).nullable().transform((v) => (v === '' ? null : v)),
  usageLimit: Yup.number().integer().min(0).nullable().transform((v) => (v === '' ? null : v)),
  perUserLimit: Yup.number().integer().min(0).nullable().transform((v) => (v === '' ? null : v)),
  validFrom: Yup.string().nullable(),
  validTo: Yup.string().nullable(),
  isActive: Yup.boolean().optional(),
  applicableTo: Yup.string().oneOf(['all', 'categories', 'products']).optional(),
});

export const addProductSchema = Yup.object({
  name: Yup.string().required('Product name is required'),
  slug: Yup.string().optional(),
  description: Yup.string().required('Description is required'),
  categoryIds: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Select at least one category')
    .required('At least one category is required'),
  productType: Yup.string().oneOf(['simple', 'variable']).optional(),
  gender: Yup.string().oneOf(['men', 'women', 'unisex', 'kids']).optional(),
  price: Yup.number()
    .when('productType', {
      is: 'simple',
      then: (schema) =>
        schema.required('Price is required').min(0.01, 'Price must be greater than 0'),
      otherwise: (schema) => schema.optional(),
    }),
  stock: Yup.number()
    .when('productType', {
      is: 'simple',
      then: (schema) => schema.min(0, 'Stock cannot be negative'),
      otherwise: (schema) => schema.optional(),
    }),
  discountPercentage: Yup.number()
    .min(0, 'Discount must be between 0 and 100')
    .max(100, 'Discount must be between 0 and 100')
    .optional(),
  variants: Yup.array().when('productType', {
    is: 'variable',
    then: (schema) =>
      schema.min(1, 'Variable products require at least one variant'),
    otherwise: (schema) => schema.optional(),
  }),
});