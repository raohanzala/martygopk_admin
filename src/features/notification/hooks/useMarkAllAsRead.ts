import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAllAsReadApi } from '@/api/notifications';

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: markAllAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return mutation;
}
