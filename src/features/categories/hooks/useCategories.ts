import { useQuery } from '@tanstack/react-query';
import { getCategoriesApi } from '@/api/categories';

export function useCategories(search?: string, isActive?: boolean) {
  const {
    isPending: isCategoriesLoading,
    error: categoriesError,
    data,
  } = useQuery({
    queryKey: ['categories', search, isActive],
    queryFn: () =>
      getCategoriesApi({
        search,
        isActive,
        page: 1,
        pageSize: 100,
      }),
  });

  const categories = data?.categories ?? [];
  return { categories, isCategoriesLoading, categoriesError, pagination: data };
}
