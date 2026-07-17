import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBrandApi } from '@/api/brands';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useUpdateBrand() {
  const queryClient = useQueryClient();

  const { mutate: updateBrandMutation, isPending: isUpdatingBrand } =
    useMutation({
      mutationFn: ({ id, data }: { id: string; data: FormData }) =>
        updateBrandApi(id, data),
      onSuccess: (data) => {
        toastSuccess(data.message || 'Brand updated successfully');
        queryClient.invalidateQueries({ queryKey: ['brands'] });
      },
      onError: (err) => toastError(err),
    });

  return { updateBrandMutation, isUpdatingBrand };
}
