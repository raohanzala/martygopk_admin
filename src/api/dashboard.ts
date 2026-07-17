import apiClient from './axios';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  newsletterSubscribers: number;
  totalRevenue: number;
  pendingOrdersCount: number;
}

export interface RecentOrderItem {
  _id: string;
  orderNumber?: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  userId?: { name?: string; email?: string } | null;
  shippingAddress?: { fullName?: string };
}

export interface DashboardStatsResponse {
  stats: DashboardStats;
  recentOrders: RecentOrderItem[];
}

export const getDashboardStatsApi = async (): Promise<DashboardStatsResponse> => {
  const response = await apiClient.get<DashboardStatsResponse>('/dashboard/stats');
  return response.data;
};
