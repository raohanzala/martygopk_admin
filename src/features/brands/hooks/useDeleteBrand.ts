import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBrandApi } from '@/api/brands';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  const { mutate: deleteBrandMutation, isPending: isDeletingBrand } =
    useMutation({
      mutationFn: deleteBrandApi,
      onSuccess: (data) => {
        toastSuccess(data.message || 'Brand deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['brands'] });
      },
      onError: (err) => toastError(err),
    });

  return { deleteBrandMutation, isDeletingBrand };
}
