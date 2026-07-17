import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUnreadCountApi } from '@/api/notifications';

export function useUnreadCount() {
  const queryClient = useQueryClient();

  const { data, refetch } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCountApi,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return {
    unreadCount: data?.count ?? 0,
    refetch,
    invalidate,
  };
}
