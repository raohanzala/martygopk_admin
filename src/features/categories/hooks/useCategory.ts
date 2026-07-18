import { useQuery } from '@tanstack/react-query';
import { getCategoryByIdApi } from '@/api/categories';

export function useCategory(id: string | undefined) {
  const {
    isPending: isCategoryLoading,
    error: categoryError,
    data: category,
  } = useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategoryByIdApi(id!),
    enabled: !!id,
  });

  return { category, isCategoryLoading, categoryError };
}
