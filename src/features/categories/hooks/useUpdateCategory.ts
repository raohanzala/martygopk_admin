import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCategoryApi } from '@/api/categories';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  const { mutate: updateCategoryMutation, isPending: isUpdatingCategory } =
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updateCategoryApi(id, data),
      onSuccess: (data) => {
        toastSuccess(data.message || 'Category updated successfully');
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      },
      onError: (err) => toastError(err),
    });

  return { updateCategoryMutation, isUpdatingCategory };
}
