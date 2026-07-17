import apiClient from './axios';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewUser {
  _id: string;
  name: string;
  email?: string;
}

export interface ReviewProduct {
  _id: string;
  name?: string;
  slug?: string;
  images?: { main?: string };
}

export interface Review {
  _id: string;
  userId: ReviewUser;
  productId: ReviewProduct;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsParams {
  page?: number;
  limit?: number;
  status?: ReviewStatus;
  productId?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getReviewsApi = async (params?: ReviewsParams) => {
  const response = await apiClient.get<ReviewsResponse>('/reviews/admin', {
    params: params
      ? {
          page: params.page,
          limit: params.limit,
          status: params.status,
          productId: params.productId,
        }
      : undefined,
  });
  return response.data;
};

export const updateReviewStatusApi = async (
  reviewId: string,
  status: 'approved' | 'rejected'
) => {
  const response = await apiClient.patch<{ review: Review }>(
    `/reviews/${reviewId}/status`,
    { status }
  );
  return response.data;
};
