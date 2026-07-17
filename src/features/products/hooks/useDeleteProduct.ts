import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProductApi } from '@/api/products';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const { mutate: deleteProductMutation, isPending: isDeletingProduct } = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: (data) => {
      toastSuccess(data.message || 'Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => toastError(err),
  });

  return { isDeletingProduct, deleteProductMutation };
}
