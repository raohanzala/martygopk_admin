import { useQuery } from '@tanstack/react-query';
import { getNotificationsApi, type NotificationParams } from '@/api/notifications';

export function useNotifications(params?: NotificationParams) {
  const {
    data,
    isPending: isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notifications', params?.page, params?.limit, params?.unreadOnly],
    queryFn: () => getNotificationsApi(params),
  });

  return {
    notifications: data?.notifications ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
}
