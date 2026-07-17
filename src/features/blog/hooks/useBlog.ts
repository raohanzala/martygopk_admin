import { useQuery } from '@tanstack/react-query';
import { getBlogByIdApi } from '@/api/blogs';

export function useBlog(id: string | undefined) {
  const {
    isPending: isBlogLoading,
    error: blogError,
    data,
  } = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => getBlogByIdApi(id!),
    enabled: !!id,
  });

  const blog = data?.blog;
  return { blog, isBlogLoading, blogError };
}
