import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCategoryApi } from '@/api/categories';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useAddCategory() {
  const queryClient = useQueryClient();

  const { mutate: addCategoryMutation, isPending: isAddingCategory } =
    useMutation({
      mutationFn: addCategoryApi,
      onSuccess: (data) => {
        toastSuccess(data.message || 'Category created successfully');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      },
      onError: (err) => toastError(err),
    });

  return { addCategoryMutation, isAddingCategory };
}
