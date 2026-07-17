import apiClient from './axios';

export interface SettingsSeo {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface SettingsContact {
  supportEmail?: string;
  supportPhone?: string;
  whatsappNumber?: string;
  whatsappChannel?: string;
}

export interface SettingsShipping {
  flatFee?: number;
  freeShippingAbove?: number;
}

export interface SettingsPayment {
  codEnabled?: boolean;
  cardEnabled?: boolean;
}

export interface SettingsOrder {
  autoConfirm?: boolean;
  allowCancel?: boolean;
}

export interface SettingsAnnouncement {
  isActive?: boolean;
  message?: string;
  endDate?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface SettingsSocial {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
  linkedin?: string;
}

export interface Settings {
  _id: string;
  siteName: string;
  logo?: string;
  currency: string;
  seo?: SettingsSeo;
  announcement?: SettingsAnnouncement;
  contact?: SettingsContact;
  social?: SettingsSocial;
  shipping?: SettingsShipping;
  payment?: SettingsPayment;
  order?: SettingsOrder;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateSettingsInput {
  siteName?: string;
  currency?: string;
  seo?: SettingsSeo;
  announcement?: SettingsAnnouncement;
  contact?: SettingsContact;
  social?: SettingsSocial;
  shipping?: SettingsShipping;
  payment?: SettingsPayment;
  order?: SettingsOrder;
}

export const getSettingsApi = async () => {
  const response = await apiClient.get('/settings');
  return response.data;
};

export const updateSettingsApi = async (data: UpdateSettingsInput) => {
  const response = await apiClient.patch('/settings', data);
  return response.data;
};

export const resetSettingsApi = async () => {
  const response = await apiClient.delete('/settings');
  return response.data;
};
