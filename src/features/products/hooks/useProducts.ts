import { useQuery } from '@tanstack/react-query';
import { getProductsApi } from '@/api/products';

export function useProducts(searchInput?: string, page = 1, limit = 10) {
  const search = searchInput || '';

  const {
    isPending: isProductsLoading,
    error: productsError,
    data,
  } = useQuery({
    queryKey: ['products', page, limit, search],
    queryFn: () => getProductsApi({ page, limit, search }),
  });

  const { products, pagination } = data || {};
  return { products, pagination, isProductsLoading, productsError };
}
