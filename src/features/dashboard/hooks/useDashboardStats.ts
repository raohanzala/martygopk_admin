import { useQuery } from '@tanstack/react-query';
import { getDashboardStatsApi } from '@/api/dashboard';

export function useDashboardStats() {
  const { data, isPending, error } = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStatsApi,
  });

  return {
    stats: data?.stats ?? null,
    recentOrders: data?.recentOrders ?? [],
    isDashboardLoading: isPending,
    dashboardError: error,
  };
}
