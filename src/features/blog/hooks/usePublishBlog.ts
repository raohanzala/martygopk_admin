import { useMutation, useQueryClient } from '@tanstack/react-query';
import { publishBlogApi } from '@/api/blogs';
import { toastError, toastSuccess } from '@/utils/helpers';

export function usePublishBlog() {
  const queryClient = useQueryClient();

  const { mutate: publishBlogMutation, isPending: isPublishingBlog } =
    useMutation({
      mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
        publishBlogApi(id, isPublished),
      onSuccess: (data) => {
        toastSuccess(data.message || 'Blog status updated');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
      },
      onError: (err) => toastError(err),
    });

  return { publishBlogMutation, isPublishingBlog };
}
