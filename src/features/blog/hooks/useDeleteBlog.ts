import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBlogApi } from '@/api/blogs';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useDeleteBlog() {
  const queryClient = useQueryClient();

  const { mutate: deleteBlogMutation, isPending: isDeletingBlog } =
    useMutation({
      mutationFn: deleteBlogApi,
      onSuccess: (data) => {
        toastSuccess(data.message || 'Blog deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
      },
      onError: (err) => toastError(err),
    });

  return { deleteBlogMutation, isDeletingBlog };
}
