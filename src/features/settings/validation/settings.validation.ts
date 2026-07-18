import { z } from 'zod';
import type { SettingsFormValues } from '../types/settings.types';

export const settingsFormSchema = z.object({
  siteName: z.string().trim().min(1, 'Site name is required'),
  currency: z.string().trim().min(1, 'Currency is required'),
  seo: z.object({
    metaTitle: z.string().optional().or(z.literal('')),
    metaDescription: z.string().optional().or(z.literal('')),
    metaKeywords: z.string().optional().or(z.literal('')),
  }),
  announcement: z.object({
    isActive: z.boolean().default(false),
    title: z.string().optional().or(z.literal('')),
    description: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
    backgroundColor: z.string().optional().or(z.literal('')),
    textColor: z.string().optional().or(z.literal('')),
    discountPercentage: z.coerce.number().min(0).max(100).default(0),
  }),
  contact: z.object({
    supportEmail: z.string().optional().or(z.literal('')),
    supportPhone: z.string().optional().or(z.literal('')),
    whatsappNumber: z.string().optional().or(z.literal('')),
    whatsappChannel: z.string().optional().or(z.literal('')),
  }),
  social: z.object({
    facebook: z.string().optional().or(z.literal('')),
    instagram: z.string().optional().or(z.literal('')),
    twitter: z.string().optional().or(z.literal('')),
    youtube: z.string().optional().or(z.literal('')),
    tiktok: z.string().optional().or(z.literal('')),
    whatsapp: z.string().optional().or(z.literal('')),
    linkedin: z.string().optional().or(z.literal('')),
  }),
  shipping: z.object({
    flatFee: z.coerce.number().min(0).default(300),
    freeShippingAbove: z.coerce.number().min(0).default(5000),
  }),
  payment: z.object({
    codEnabled: z.boolean().default(true),
    cardEnabled: z.boolean().default(false),
  }),
  order: z.object({
    autoConfirm: z.boolean().default(false),
    allowCancel: z.boolean().default(true),
  }),
});

export type SettingsFormSchema = z.infer<typeof settingsFormSchema>;

export const SETTINGS_FORM_DEFAULTS: SettingsFormValues = {
  siteName: '',
  currency: 'PKR',
  seo: {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  },
  announcement: {
    isActive: false,
    title: '',
    description: '',
    endDate: '',
    backgroundColor: '#D4AF37',
    textColor: '#000000',
    discountPercentage: 0,
  },
  contact: {
    supportEmail: '',
    supportPhone: '',
    whatsappNumber: '',
    whatsappChannel: '',
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    whatsapp: '',
    linkedin: '',
  },
  shipping: {
    flatFee: 300,
    freeShippingAbove: 5000,
  },
  payment: {
    codEnabled: true,
    cardEnabled: false,
  },
  order: {
    autoConfirm: false,
    allowCancel: true,
  },
};
