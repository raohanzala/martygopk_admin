import { useQuery } from '@tanstack/react-query';
import { getBrandByIdApi } from '@/api/brands';

export function useBrand(id: string | undefined) {
  const {
    isPending: isBrandLoading,
    error: brandError,
    data,
  } = useQuery({
    queryKey: ['brands', id],
    queryFn: () => getBrandByIdApi(id!),
    enabled: !!id,
  });

  const brand = data?.brand;
  return { brand, isBrandLoading, brandError };
}
