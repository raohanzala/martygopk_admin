import { useQuery } from '@tanstack/react-query';
import { getOrderByIdAdminApi } from '@/api/orders';

export function useOrder(id: string | undefined) {
  const {
    isPending: isOrderLoading,
    error: orderError,
    data,
    refetch,
  } = useQuery({
    queryKey: ['orders', 'admin', id],
    queryFn: () => getOrderByIdAdminApi(id!),
    enabled: !!id,
  });

  const order = data?.order;
  return { order, isOrderLoading, orderError, refetch };
}
