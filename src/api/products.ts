import apiClient from './axios';

export interface ProductParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface AddProductInput {
  name: string;
  slug?: string;
  description: string;
  categoryIds: string[];
  brandId?: string;
  price?: number;
  stock?: number;
  sku?: string;
  discountPercentage?: number;
  productType?: 'simple' | 'variable';
  specifications?: Record<string, any>;
  variants?: Array<{
    attributes: Record<string, any>;
    price: number;
    stock: number;
    sku?: string;
    discountPercentage?: number;
    images?: string[];
    isDefault?: boolean;
  }>;
  mainImage?: File;
  gallery?: File[];
}

export interface UpdateProductInput extends Partial<AddProductInput> {
  status?: 'draft' | 'active' | 'out_of_stock';
}

export const getProductsApi = async (params: ProductParams = {}) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const getProductApi = async (idOrSlug: string) => {
  const response = await apiClient.get(`/products/${idOrSlug}`);
  return response.data;
};

export const addProductApi = async (data: FormData) => {
  const response = await apiClient.post('/products/add', data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const updateProductApi = async (id: string, data: FormData) => {
  const response = await apiClient.patch(`/products/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const deleteProductApi = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};
