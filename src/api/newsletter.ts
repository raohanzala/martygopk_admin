import apiClient from './axios';

export type NewsletterSource = 'footer' | 'popup' | 'checkout';

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  source: NewsletterSource;
  isActive: boolean;
  unsubscribedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterSubscribersParams {
  page?: number;
  limit?: number;
  source?: NewsletterSource;
  isActive?: boolean;
}

export interface NewsletterSubscribersResponse {
  subscribers: NewsletterSubscriber[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getNewsletterSubscribersApi = async (
  params?: NewsletterSubscribersParams
) => {
  const response = await apiClient.get<NewsletterSubscribersResponse>(
    '/newsletter/subscribers',
    {
      params: params
        ? {
            page: params.page,
            limit: params.limit,
            source: params.source,
            isActive: params.isActive,
          }
        : undefined,
    }
  );
  return response.data;
};
