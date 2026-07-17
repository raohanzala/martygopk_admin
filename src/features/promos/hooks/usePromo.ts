import { useQuery } from '@tanstack/react-query';
import { getPromoByIdApi } from '@/api/promos';

export function usePromo(id: string) {
  const { data, isPending, error } = useQuery({
    queryKey: ['promos', id],
    queryFn: () => getPromoByIdApi(id),
    enabled: !!id,
  });

  return { promo: data?.promo, isPromoLoading: isPending, promoError: error };
}
