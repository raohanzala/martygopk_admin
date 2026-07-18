import apiClient from './axios';

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url?: string;
    alt?: string;
  };
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  discount: number;
  category?: ProductCategory | null;
  images: ProductImage[];
  variants?: Array<{
    color?: string;
    size?: string;
    price?: number;
    stock?: number;
  }>;
  availability: string;
  createdAt?: string;
}

export interface ProductsListResponse {
  products: Product[];
  currentPage: number;
  pageSize: number;
  totalProducts: number;
  totalPages: number;
}

export interface ProductParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  search?: string;
  category?: string;
  isAdmin?: boolean;
  sortBy?: string;
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

export const getProductsApi = async (
  params: ProductParams = {}
): Promise<ProductsListResponse> => {
  const { limit, pageSize, ...rest } = params;
  const response = await apiClient.get<ProductsListResponse>('/products', {
    params: {
      ...rest,
      pageSize: pageSize ?? limit ?? 10,
      isAdmin: params.isAdmin ?? true,
    },
  });
  return response.data;
};

export const getProductApi = async (idOrSlug: string) => {
  const response = await apiClient.get(`/products/single/${idOrSlug}`);
  return response.data;
};

export const addProductApi = async (data: FormData) => {
  const response = await apiClient.post('/products/add', data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const updateProductApi = async (id: string, data: FormData) => {
  const response = await apiClient.put(`/products/edit/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const deleteProductApi = async (id: string) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};
