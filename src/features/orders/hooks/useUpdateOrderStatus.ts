import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatusApi, type OrderStatus } from '@/api/orders';

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  const { mutate: updateStatusMutation, isPending: isUpdatingStatus } =
    useMutation({
      mutationFn: ({ id, orderStatus }: { id: string; orderStatus: OrderStatus }) =>
        updateOrderStatusApi(id, orderStatus),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['orders', 'admin'] });
        queryClient.invalidateQueries({ queryKey: ['orders', 'admin', id] });
      },
    });

  return { updateStatusMutation, isUpdatingStatus };
}
