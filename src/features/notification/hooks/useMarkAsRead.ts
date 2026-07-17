import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAsReadApi } from '@/api/notifications';

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: markAsReadApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return mutation;
}
