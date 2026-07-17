import { useQuery } from '@tanstack/react-query';
import {
  getNewsletterSubscribersApi,
  type NewsletterSubscribersParams,
} from '@/api/newsletter';

export function useNewsletterSubscribers(params?: NewsletterSubscribersParams) {
  const {
    data,
    isPending: isSubscribersLoading,
    error: subscribersError,
    refetch,
  } = useQuery({
    queryKey: ['newsletter-subscribers', params?.page, params?.limit, params?.source, params?.isActive],
    queryFn: () => getNewsletterSubscribersApi(params),
  });

  const { subscribers = [], pagination } = data || {};
  return { subscribers, pagination, isSubscribersLoading, subscribersError, refetch };
}
