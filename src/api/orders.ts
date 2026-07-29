import apiClient from './axios';

export type OrderStatus =
  | "Order Placed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Canceled"
  | "Refunded";

export interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface GuestUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// export interface OrderUser {
//   _id: string;
//   name?: string;
//   email?: string;
// }

// export interface OrderItemVariant {
//   _id: string;
//   price?: number;
//   stock?: number;
//   sku?: string;
//   productId?: string;
// }

export interface OrderItem {
  title: string;
  image: string;
  slug: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  guestUser: GuestUser;
  address: Address;
  items: OrderItem[];
  amount: number;
  status: OrderStatus;
  createdAt: string;
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
  const response = await apiClient.get('/orders', {
    params: params
      ? {
        page: params.page,
        pageSize: params.limit,
        filterBy: params.status,
        search: params.orderNumber || undefined,
      }
      : undefined,
  });

  const data = response.data

  return {
    orders: data.orders,
    pagination: {
      page: data.currentPage,
      limit: data.pageSize,
      total: data.totalOrders,
      pages: data.totalPages
    }
  };
};

export const getOrderByIdAdminApi = async (id: string) => {
  const response = await apiClient.get<{ order: Order }>(`/singleOrder/${id}`);
  return response.data;
};

export const updateOrderStatusApi = async (
  id: string,
  orderStatus: OrderStatus
) => {
  const response = await apiClient.post(`/orderstatus`, {
    orderId: id,
    status: orderStatus
  }
  );
  return response.data;
};
