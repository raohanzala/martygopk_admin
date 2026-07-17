import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBlogApi } from '@/api/blogs';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useAddBlog() {
  const queryClient = useQueryClient();

  const { mutate: addBlogMutation, isPending: isAddingBlog } = useMutation({
    mutationFn: createBlogApi,
    onSuccess: (data) => {
      toastSuccess(data.message || 'Blog created successfully');
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (err) => toastError(err),
  });

  return { addBlogMutation, isAddingBlog };
}
