import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProductApi } from '@/api/products';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  const { mutate: updateProductMutation, isPending: isUpdatingProduct } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateProductApi(id, data),
    onSuccess: (data) => {
      toastSuccess(data.message || 'Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
    onError: (err) => toastError(err),
  });

  return { isUpdatingProduct, updateProductMutation };
}
