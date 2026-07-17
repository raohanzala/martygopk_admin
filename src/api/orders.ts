import apiClient from './axios';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  area?: string;
  city: string;
  postalCode?: string;
  country?: string;
}

export interface OrderUser {
  _id: string;
  name?: string;
  email?: string;
}

export interface OrderItemVariant {
  _id: string;
  price?: number;
  stock?: number;
  sku?: string;
  productId?: string;
}

export interface OrderItem {
  productVariantId: string | OrderItemVariant;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  userId?: string | OrderUser | null;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface OrdersAdminParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  orderNumber?: string;
}

export interface OrdersAdminResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getOrdersAdminApi = async (params?: OrdersAdminParams) => {
  const response = await apiClient.get<OrdersAdminResponse>('/orders/admin', {
    params: params
      ? {
          page: params.page,
          limit: params.limit,
          status: params.status,
          orderNumber: params.orderNumber || undefined,
        }
      : undefined,
  });
  return response.data;
};

export const getOrderByIdAdminApi = async (id: string) => {
  const response = await apiClient.get<{ order: Order }>(`/orders/admin/${id}`);
  return response.data;
};

export const updateOrderStatusApi = async (
  id: string,
  orderStatus: OrderStatus
) => {
  const response = await apiClient.patch<{ message: string; order: Order }>(
    `/orders/admin/${id}/status`,
    { orderStatus }
  );
  return response.data;
};
