import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProductApi } from '@/api/products';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useAddProduct() {
  const queryClient = useQueryClient();

  const { mutate: addProductMutation, isPending: isAddingProduct } = useMutation({
    mutationFn: addProductApi,
    onSuccess: (data) => {
      toastSuccess(data.message || 'Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => toastError(err),
  });

  return { isAddingProduct, addProductMutation };
}
