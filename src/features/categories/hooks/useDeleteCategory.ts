import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCategoryApi } from '@/api/categories';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  const { mutate: deleteCategoryMutation, isPending: isDeletingCategory } =
    useMutation({
      mutationFn: deleteCategoryApi,
      onSuccess: (data) => {
        toastSuccess(data.message || 'Category deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      },
      onError: (err) => toastError(err),
    });

  return { deleteCategoryMutation, isDeletingCategory };
}
