import apiClient from './axios';

export interface BrandParams {
  isActive?: boolean;
  showOnHomePage?: boolean;
  search?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug?: string;
  logo?: string;
  isActive: boolean;
  order?: number;
  showOnHomePage?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BrandsResponse {
  brands: Brand[];
  total: number;
}

export const getBrandsApi = async (params?: BrandParams) => {
  const response = await apiClient.get<BrandsResponse>('/brands', {
    params: params
      ? {
          isActive: params.isActive?.toString(),
          showOnHomePage: params.showOnHomePage?.toString(),
          search: params.search,
        }
      : undefined,
  });
  return response.data;
};

export const getBrandByIdApi = async (id: string) => {
  const response = await apiClient.get<{ brand: Brand }>(`/brands/${id}`);
  return response.data;
};

export const addBrandApi = async (data: FormData) => {
  const response = await apiClient.post('/brands', data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const updateBrandApi = async (id: string, data: FormData) => {
  const response = await apiClient.patch(`/brands/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const deleteBrandApi = async (id: string) => {
  const response = await apiClient.delete(`/brands/${id}`);
  return response.data;
};
