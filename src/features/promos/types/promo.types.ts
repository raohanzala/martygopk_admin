export interface PromoFormValues {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number | '';
  maxDiscountAmount: number | '';
  usageLimit: number | '';
  perUserLimit: number | '';
  validFrom: string;
  validTo: string;
  isActive: boolean;
  applicableTo: string;
}
