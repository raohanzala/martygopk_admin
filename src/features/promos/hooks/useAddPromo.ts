import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPromoApi } from '@/api/promos';
import type { Promo } from '@/api/promos';

export function useAddPromo() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: Partial<Promo>) => addPromoApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promos'] });
    },
  });
  return {
    addPromoMutation: mutation.mutateAsync,
    isAddingPromo: mutation.isPending,
  };
}
