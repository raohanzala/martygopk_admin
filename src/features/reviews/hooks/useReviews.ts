import { useQuery } from '@tanstack/react-query';
import { getReviewsApi, type ReviewsParams } from '@/api/reviews';

export function useReviews(params?: ReviewsParams) {
  const {
    data,
    isPending: isReviewsLoading,
    error: reviewsError,
    refetch,
  } = useQuery({
    queryKey: ['reviews', params?.status, params?.productId, params?.page],
    queryFn: () => getReviewsApi(params),
  });

  const { reviews = [], pagination } = data || {};
  return { reviews, pagination, isReviewsLoading, reviewsError, refetch };
}
