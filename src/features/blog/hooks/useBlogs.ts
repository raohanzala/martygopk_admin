import { useQuery } from '@tanstack/react-query';
import { getBlogsApi, type BlogParams } from '@/api/blogs';

export function useBlogs(params?: BlogParams) {
  const {
    data,
    isPending: isBlogsLoading,
    error: blogsError,
  } = useQuery({
    queryKey: ['blogs', params?.search, params?.category, params?.isPublished, params?.page],
    queryFn: () => getBlogsApi(params),
  });

  const { blogs = [], pagination } = data || {};
  return { blogs, pagination, isBlogsLoading, blogsError };
}
