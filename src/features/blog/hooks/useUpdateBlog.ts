import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBlogApi } from '@/api/blogs';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useUpdateBlog() {
  const queryClient = useQueryClient();

  const { mutate: updateBlogMutation, isPending: isUpdatingBlog } =
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updateBlogApi(id, data),
      onSuccess: (data) => {
        toastSuccess(data.message || 'Blog updated successfully');
        queryClient.invalidateQueries({ queryKey: ['blogs'] });
      },
      onError: (err) => toastError(err),
    });

  return { updateBlogMutation, isUpdatingBlog };
}
