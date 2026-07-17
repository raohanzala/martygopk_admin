import { useQuery } from '@tanstack/react-query';
import { getOrdersAdminApi, type OrdersAdminParams } from '@/api/orders';

export function useOrders(params?: OrdersAdminParams) {
  const {
    data,
    isPending: isOrdersLoading,
    error: ordersError,
    refetch,
  } = useQuery({
    queryKey: ['orders', 'admin', params?.page, params?.limit, params?.status, params?.orderNumber],
    queryFn: () => getOrdersAdminApi(params),
  });

  const orders = data?.orders ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  };

  return { orders, pagination, isOrdersLoading, ordersError, refetch };
}
