import type { BlogCategory } from '@/api/blogs';

export interface BlogFormValues {
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory | '';
  tags: string[];
  relatedProductIds: string[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}
