import apiClient from './axios';

export interface CategoryParams {
  isActive?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CategoryImage {
  url?: string;
  alt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: CategoryImage | string | null;
  parentCategory?: string | null;
  isFeatured?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesListResponse {
  categories: Category[];
  currentPage: number;
  pageSize: number;
  totalCategories: number;
  totalPages: number;
}

export const getCategoriesApi = async (
  params?: CategoryParams
): Promise<CategoriesListResponse> => {
  const response = await apiClient.get<CategoriesListResponse>('/categories', {
    params: params
      ? {
          isActive: params.isActive?.toString(),
          search: params.search,
          page: params.page,
          pageSize: params.pageSize,
        }
      : undefined,
  });
  return response.data;
};

export const getAllCategoriesApi = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('/categories/all');
  return response.data;
};

export const getCategoryByIdApi = async (id: string): Promise<Category> => {
  const response = await apiClient.get<Category>(`/categories/category/${id}`);
  return response.data;
};

export const addCategoryApi = async (data: FormData) => {
  const response = await apiClient.post('/categories/add', data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const updateCategoryApi = async (id: string, data: FormData) => {
  const response = await apiClient.put(`/categories/category/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const deleteCategoryApi = async (id: string) => {
  const response = await apiClient.delete(`/categories/${id}`);
  return response.data;
};
