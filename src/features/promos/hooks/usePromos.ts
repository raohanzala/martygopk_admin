import { useQuery } from '@tanstack/react-query';
import { getPromosApi, type PromoParams } from '@/api/promos';

export function usePromos(params?: PromoParams) {
  const { data, isPending, error } = useQuery({
    queryKey: ['promos', params?.isActive, params?.search, params?.page, params?.limit],
    queryFn: () => getPromosApi(params),
  });

  const { promos = [], pagination } = data || {};
  return { promos, pagination, isPromosLoading: isPending, promosError: error };
}
