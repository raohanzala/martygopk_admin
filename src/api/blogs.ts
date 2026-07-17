import apiClient from './axios';

export const BLOG_CATEGORIES = [
  'Luxury Watches',
  'Smart Watches',
  'Watch Care',
  'Buying Guide',
  'Trends',
  'Lifestyle',
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface BlogParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  isPublished?: boolean;
  sort?: string;
}

export interface BlogAuthor {
  _id: string;
  name: string;
  email?: string;
}

export interface BlogCoverImage {
  url?: string;
  publicId?: string;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: BlogCoverImage;
  authorId: BlogAuthor;
  category: string;
  tags: string[];
  relatedProductIds?: Array<{ _id: string; name: string; slug: string; images?: { main: string } }>;
  isPublished: boolean;
  publishedAt?: string;
  seo?: BlogSeo;
  views: number;
  readingTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getBlogsApi = async (params?: BlogParams) => {
  const response = await apiClient.get<BlogsResponse>('/blogs', {
    params: params
      ? {
          page: params.page,
          limit: params.limit,
          search: params.search,
          category: params.category,
          tag: params.tag,
          isPublished: params.isPublished?.toString(),
          sort: params.sort,
        }
      : undefined,
  });
  return response.data;
};

export const getBlogByIdApi = async (id: string) => {
  const response = await apiClient.get<{ blog: Blog }>(`/blogs/by-id/${id}`);
  return response.data;
};

export const createBlogApi = async (data: FormData) => {
  const response = await apiClient.post('/blogs', data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const updateBlogApi = async (id: string, data: FormData) => {
  const response = await apiClient.patch(`/blogs/${id}`, data, {
    headers: data instanceof FormData ? { 'Content-Type': undefined } : {},
  });
  return response.data;
};

export const deleteBlogApi = async (id: string) => {
  const response = await apiClient.delete(`/blogs/${id}`);
  return response.data;
};

export const publishBlogApi = async (id: string, isPublished: boolean) => {
  const response = await apiClient.patch(`/blogs/${id}/publish`, {
    isPublished,
  });
  return response.data;
};
