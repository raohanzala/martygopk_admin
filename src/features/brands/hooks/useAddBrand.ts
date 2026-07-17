import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addBrandApi } from '@/api/brands';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useAddBrand() {
  const queryClient = useQueryClient();

  const { mutate: addBrandMutation, isPending: isAddingBrand } = useMutation({
    mutationFn: addBrandApi,
    onSuccess: (data) => {
      toastSuccess(data.message || 'Brand created successfully');
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
    onError: (err) => toastError(err),
  });

  return { addBrandMutation, isAddingBrand };
}
