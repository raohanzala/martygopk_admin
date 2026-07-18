import { useQuery } from '@tanstack/react-query';
import { getProductsApi } from '@/api/products';

export function useProducts(searchInput?: string, page = 1, pageSize = 10) {
  const search = searchInput || '';

  const {
    isPending: isProductsLoading,
    error: productsError,
    data,
  } = useQuery({
    queryKey: ['products', page, pageSize, search],
    queryFn: () =>
      getProductsApi({
        page,
        pageSize,
        search,
        isAdmin: true,
      }),
  });

  const products = data?.products ?? [];
  const pagination = data
    ? {
        page: data.currentPage,
        pages: data.totalPages,
        total: data.totalProducts,
        limit: data.pageSize,
      }
    : undefined;

  return { products, pagination, isProductsLoading, productsError };
}
