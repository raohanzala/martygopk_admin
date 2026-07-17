import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePromoApi } from '@/api/promos';
import type { Promo } from '@/api/promos';

export function useUpdatePromo() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Promo> }) =>
      updatePromoApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promos'] });
    },
  });
  return {
    updatePromoMutation: mutation.mutateAsync,
    isUpdatingPromo: mutation.isPending,
  };
}
