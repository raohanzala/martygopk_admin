import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogForm from '../components/BlogForm';
import { Spinner } from '@/components';
import { useBlog } from '../hooks/useBlog';
import { useUpdateBlog } from '../hooks/useUpdateBlog';
import type { BlogFormValues } from '../types/blog.types';

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blog, isBlogLoading } = useBlog(id || '');
  const { updateBlogMutation, isUpdatingBlog } = useUpdateBlog();

  const handleSubmit = (_values: BlogFormValues, formData: FormData) => {
    if (!id) return;

    updateBlogMutation(
      { id, data: formData },
      {
        onSuccess: () => {
          navigate('/blogs');
        },
      }
    );
  };

  if (isBlogLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/blogs')}
          className="text-sm text-text-muted hover:text-text-primary mb-4"
        >
          ← Back to Blog
        </button>
        <h1 className="text-2xl font-semibold text-text-primary">Edit blog post</h1>
        <p className="text-sm text-text-muted mt-1">Update blog post content</p>
      </div>

      {/* Form */}
      <BlogForm
        blogToEdit={blog}
        onSubmit={handleSubmit}
        isSubmitting={isUpdatingBlog}
      />
    </div>
  );
};

export default EditBlog;
