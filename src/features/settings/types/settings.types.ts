export interface SettingsFormValues {
  siteName: string;
  currency: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  announcement: {
    isActive: boolean;
    title: string;
    description: string;
    endDate: string;
    backgroundColor: string;
    textColor: string;
    discountPercentage: number;
  };
  contact: {
    supportEmail: string;
    supportPhone: string;
    whatsappNumber: string;
    whatsappChannel: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    tiktok: string;
    whatsapp: string;
    linkedin: string;
  };
  shipping: {
    flatFee: number;
    freeShippingAbove: number;
  };
  payment: {
    codEnabled: boolean;
    cardEnabled: boolean;
  };
  order: {
    autoConfirm: boolean;
    allowCancel: boolean;
  };
}
