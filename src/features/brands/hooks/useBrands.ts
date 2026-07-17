import { useQuery } from '@tanstack/react-query';
import { getBrandsApi, type BrandParams } from '@/api/brands';

export function useBrands(params?: BrandParams) {
  const {
    data,
    isPending: isBrandsLoading,
    error: brandsError,
  } = useQuery({
    queryKey: ['brands', params?.isActive, params?.search],
    queryFn: () => getBrandsApi(params),
  });

  const { brands = [], total = 0 } = data || {};
  return { brands, total, isBrandsLoading, brandsError };
}
