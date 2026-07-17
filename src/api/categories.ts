import apiClient from './axios';

export interface CategoryParams {
  isActive?: boolean;
  search?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  isActive: boolean;
  order?: number;
  showOnHomePage?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getCategoriesApi = async (params?: CategoryParams) => {
  const response = await apiClient.get('/categories', {
    params: params
      ? {
          isActive: params.isActive?.toString(),
          search: params.search,
        }
      : undefined,
  });
  return response.data;
};

export const getCategoryByIdApi = async (id: string) => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data;
};

export const addCategoryApi = async (data: FormData) => {
  const response = await apiClient.post('/categories', data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const updateCategoryApi = async (id: string, data: FormData) => {
  const response = await apiClient.patch(`/categories/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const deleteCategoryApi = async (id: string) => {
  const response = await apiClient.delete(`/categories/${id}`);
  return response.data;
};
