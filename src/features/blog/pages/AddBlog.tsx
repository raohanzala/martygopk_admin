import React from 'react';
import { useNavigate } from 'react-router-dom';
import BlogForm from '../components/BlogForm';
import { useAddBlog } from '../hooks/useAddBlog';
import type { BlogFormValues } from '../types/blog.types';

const AddBlog: React.FC = () => {
  const navigate = useNavigate();
  const { addBlogMutation, isAddingBlog } = useAddBlog();

  const handleSubmit = (_values: BlogFormValues, formData: FormData) => {
    addBlogMutation(formData, {
      onSuccess: () => {
        navigate('/blogs');
      },
    });
  };

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
        <h1 className="text-2xl font-semibold text-text-primary">Add blog post</h1>
        <p className="text-sm text-text-muted mt-1">Create a new blog post</p>
      </div>

      {/* Form */}
      <BlogForm onSubmit={handleSubmit} isSubmitting={isAddingBlog} />
    </div>
  );
};

export default AddBlog;
