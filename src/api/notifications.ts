import apiClient from './axios';

export type NotificationType = 'order' | 'inventory' | 'user' | 'affiliate' | 'newsletter' | 'system';

export interface Notification {
  _id: string;
  title: string;
  message?: string;
  type: NotificationType;
  recipient: string;
  read: boolean;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface NotificationParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export const getNotificationsApi = async (params?: NotificationParams) => {
  const response = await apiClient.get<NotificationsResponse>('/notifications', {
    params: params
      ? {
          page: params.page,
          limit: params.limit,
          unreadOnly: params.unreadOnly?.toString(),
        }
      : undefined,
  });
  return response.data;
};

export const getUnreadCountApi = async () => {
  const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
  return response.data;
};

export const markAsReadApi = async (id: string) => {
  const response = await apiClient.patch<{ notification: Notification }>(
    `/notifications/${id}/read`
  );
  return response.data;
};

export const markAllAsReadApi = async () => {
  const response = await apiClient.patch<{
    message: string;
    modifiedCount: number;
  }>('/notifications/read-all');
  return response.data;
};

export interface CreateNotificationInput {
  title: string;
  message?: string;
  type?: NotificationType;
}

export const createNotificationApi = async (data: CreateNotificationInput) => {
  const response = await apiClient.post<{ notification: Notification }>(
    '/notifications',
    data
  );
  return response.data;
};
