import apiClient from './axios';

export interface PromoParams {
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Promo {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  perUserLimit?: number | null;
  validFrom?: string | null;
  validTo?: string | null;
  isActive: boolean;
  applicableTo?: string;
  categoryIds?: string[];
  productIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PromosResponse {
  promos: Promo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getPromosApi = async (params?: PromoParams) => {
  const response = await apiClient.get<PromosResponse>('/promos', {
    params: params
      ? {
          isActive: params.isActive?.toString(),
          search: params.search,
          page: params.page,
          limit: params.limit,
        }
      : undefined,
  });
  return response.data;
};

export const getPromoByIdApi = async (id: string) => {
  const response = await apiClient.get<{ promo: Promo }>(`/promos/${id}`);
  return response.data;
};

export const addPromoApi = async (data: Partial<Promo>) => {
  const response = await apiClient.post<{ message: string; promo: Promo }>('/promos', data);
  return response.data;
};

export const updatePromoApi = async (id: string, data: Partial<Promo>) => {
  const response = await apiClient.patch<{ message: string; promo: Promo }>(`/promos/${id}`, data);
  return response.data;
};

export const deletePromoApi = async (id: string) => {
  const response = await apiClient.delete(`/promos/${id}`);
  return response.data;
};
