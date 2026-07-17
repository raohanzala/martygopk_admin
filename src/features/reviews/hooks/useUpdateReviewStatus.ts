import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReviewStatusApi } from '@/api/reviews';
import { toastError, toastSuccess } from '@/utils/helpers';

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      reviewId,
      status,
    }: {
      reviewId: string;
      status: 'approved' | 'rejected';
    }) => updateReviewStatusApi(reviewId, status),
    onSuccess: () => {
      toastSuccess('Review status updated');
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (err) => toastError(err),
  });

  return {
    updateStatusMutation: mutation.mutate,
    updateStatusMutationAsync: mutation.mutateAsync,
    isUpdatingStatus: mutation.isPending,
  };
}
