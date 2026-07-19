import { Formik, Form } from 'formik';
import { useRef, useState } from 'react';
import { blogSchema } from '@/validation';
import { Button, Card, Input, Textarea, RichTextEditor } from '@/components';
import { BLOG_CATEGORIES } from '@/api/blogs';
import type { BlogFormValues } from '../types/blog.types';
import type { Blog } from '@/api/blogs';
import { IoImageOutline, IoClose } from 'react-icons/io5';
import { useProducts } from '@/features/products/hooks/useProducts';

interface BlogFormProps {
  blogToEdit?: Blog | null;
  onSubmit: (values: BlogFormValues, formData: FormData) => void;
  isSubmitting: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
  blogToEdit,
  onSubmit,
  isSubmitting,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    blogToEdit?.coverImage?.url || null
  );
  const { products } = useProducts(undefined, 1, 100);

  const initialValues: BlogFormValues = {
    title: blogToEdit?.title || '',
    excerpt: blogToEdit?.excerpt || '',
    content: blogToEdit?.content || '',
    category: (blogToEdit?.category as BlogFormValues['category']) || '',
    tags: blogToEdit?.tags?.length ? blogToEdit.tags : [],
    relatedProductIds: blogToEdit?.relatedProductIds?.map((p) =>
      typeof p === 'object' ? p._id : p
    ) || [],
    seo: {
      metaTitle: blogToEdit?.seo?.metaTitle || '',
      metaDescription: blogToEdit?.seo?.metaDescription || '',
      keywords: blogToEdit?.seo?.keywords || [],
    },
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearCover = () => {
    setCoverFile(null);
    setCoverPreview(blogToEdit?.coverImage?.url || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCoverUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return url.startsWith('/') ? `${base}${url}` : url;
  };

  const handleSubmit = (values: BlogFormValues) => {
    const formData = new FormData();
    formData.append('title', values.title.trim());
    formData.append('excerpt', values.excerpt.trim());
    formData.append('content', values.content.trim());
    formData.append('category', values.category);

    if (values.tags.length) {
      formData.append('tags', JSON.stringify(values.tags));
    }
    if (values.relatedProductIds.length) {
      formData.append('relatedProductIds', JSON.stringify(values.relatedProductIds));
    }
    if (values.seo.metaTitle || values.seo.metaDescription || values.seo.keywords?.length) {
      formData.append(
        'seo',
        JSON.stringify({
          metaTitle: values.seo.metaTitle,
          metaDescription: values.seo.metaDescription,
          keywords: values.seo.keywords,
        })
      );
    }

    if (coverFile) {
      formData.append('coverImage', coverFile);
    }

    onSubmit(values, formData);
  };

  const isCreate = !blogToEdit;

  return (
    <Formik<BlogFormValues>
      initialValues={initialValues}
      validationSchema={blogSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card title="Content">
                <div className="space-y-4">
                  <Input
                    name="title"
                    label="Title"
                    placeholder="Blog post title"
                    required
                  />
                  <Textarea
                    name="excerpt"
                    label="Excerpt"
                    placeholder="Short summary (max 300 chars)"
                    rows={3}
                  />
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Content <span className="text-error">*</span>
                    </label>
                    <RichTextEditor
                      value={values.content}
                      onChange={(html) => setFieldValue('content', html)}
                      placeholder="Write your blog content here..."
                      minHeight="400px"
                    />
                  </div>
                </div>
              </Card>

              <Card title="Tags">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={values.tags.join(', ')}
                    onChange={(e) => {
                      const tags = e.target.value
                        .split(',')
                        .map((t) => t.trim().toLowerCase())
                        .filter(Boolean);
                      setFieldValue('tags', tags);
                    }}
                    placeholder="luxury, watches, rolex"
                    className="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </Card>

              <Card title="SEO">
                <div className="space-y-4">
                  <Input
                    name="seo.metaTitle"
                    label="Meta Title"
                    placeholder="SEO title (max 60 chars)"
                  />
                  <Textarea
                    name="seo.metaDescription"
                    label="Meta Description"
                    placeholder="SEO description (max 160 chars)"
                    rows={2}
                  />
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(values.seo?.keywords || []).join(', ')}
                      onChange={(e) => {
                        const keywords = e.target.value
                          .split(',')
                          .map((k) => k.trim())
                          .filter(Boolean);
                        setFieldValue('seo.keywords', keywords);
                      }}
                      placeholder="watches, luxury, rolex"
                      className="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Category">
                <select
                  name="category"
                  value={values.category}
                  onChange={(e) => setFieldValue('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  required
                >
                  <option value="">Select category</option>
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </Card>

              <Card title="Cover Image">
                <div className="space-y-4">
                  {coverPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={getCoverUrl(coverPreview) || ''}
                        alt="Cover"
                        className="w-full h-48 object-cover rounded border border-border"
                      />
                      <button
                        type="button"
                        onClick={clearCover}
                        className="absolute top-2 right-2 p-1 bg-error text-white rounded hover:bg-error/90"
                        aria-label="Remove cover"
                      >
                        <IoClose className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded cursor-pointer hover:bg-background transition-colors">
                      <IoImageOutline className="w-10 h-10 text-text-muted mb-2" />
                      <span className="text-sm text-text-muted mb-1">
                        Add cover image
                      </span>
                      <span className="text-xs text-text-muted">
                        JPG, PNG (optional)
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverChange}
                      />
                    </label>
                  )}
                  {coverPreview && (
                    <div className="flex gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Replace image
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* <Card title="Related Products">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-primary">
                    Link products to this blog
                  </label>
                  <select
                    multiple
                    value={values.relatedProductIds}
                    onChange={(e) => {
                      const selected = Array.from(
                        e.target.selectedOptions,
                        (opt) => opt.value
                      );
                      setFieldValue('relatedProductIds', selected);
                    }}
                    className="w-full px-3 py-2 rounded-md border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[120px]"
                  >
                    {(products || []).map((p: { _id: string; name: string }) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-text-muted">
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>
              </Card> */}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline">
              Discard
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isCreate ? 'Create blog' : 'Save changes'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BlogForm;
