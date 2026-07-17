import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePromoApi } from '@/api/promos';

export function useDeletePromo() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deletePromoApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promos'] });
    },
  });
  return {
    deletePromoMutation: mutation.mutate,
    isDeletingPromo: mutation.isPending,
  };
}
