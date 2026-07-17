import { useQuery } from '@tanstack/react-query';
import { getProductApi } from '@/api/products';

export function useProduct(idOrSlug: string) {
  const {
    isPending: isProductLoading,
    error: productError,
    data,
  } = useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: () => getProductApi(idOrSlug),
    enabled: !!idOrSlug,
  });

  const { product } = data || {};
  return { product, isProductLoading, productError };
}
