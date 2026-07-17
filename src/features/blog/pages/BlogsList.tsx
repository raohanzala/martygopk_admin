import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';
import { useDeleteBlog } from '../hooks/useDeleteBlog';
import { usePublishBlog } from '../hooks/usePublishBlog';
import { Table, TableSkeleton, Button, Badge, Card, Modal } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { Blog } from '@/api/blogs';
import { IoAdd, IoPencil, IoTrash, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

const BlogsList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const isPublishedParam =
    statusFilter === 'all'
      ? undefined
      : statusFilter === 'published'
      ? true
      : false;

  const { blogs, isBlogsLoading } = useBlogs({
    search: search || undefined,
    isPublished: isPublishedParam,
    page: 1,
    limit: 20,
  });
  const { deleteBlogMutation, isDeletingBlog } = useDeleteBlog();
  const { publishBlogMutation, isPublishingBlog } = usePublishBlog();

  const handleDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBlog) {
      deleteBlogMutation(selectedBlog._id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedBlog(null);
        },
      });
    }
  };

  const handlePublishToggle = (e: React.MouseEvent, blog: Blog) => {
    e.stopPropagation();
    publishBlogMutation(
      { id: blog._id, isPublished: !blog.isPublished },
      {
        onSuccess: () => {},
      }
    );
  };

  const getCoverUrl = (url?: string) => {
    if (!url) return '/placeholder.png';
    if (url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return url.startsWith('/') ? `${base}${url}` : url;
  };

  const getAuthorName = (author: Blog['authorId']) => {
    if (!author) return '—';
    return typeof author === 'object' ? author.name : '—';
  };

  const columns: TableColumn<Blog>[] = [
    {
      key: 'coverImage',
      header: 'Cover',
      render: (item) => (
        <img
          src={getCoverUrl(item.coverImage?.url)}
          alt={item.title}
          className="w-14 h-10 object-cover rounded border border-border"
        />
      ),
      width: '80px',
    },
    {
      key: 'title',
      header: 'Title',
      render: (item) => (
        <p className="font-medium text-text-primary line-clamp-1">{item.title}</p>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (
        <span className="text-sm text-text-secondary">{item.category}</span>
      ),
    },
    {
      key: 'authorId',
      header: 'Author',
      render: (item) => (
        <span className="text-sm text-text-secondary">{getAuthorName(item.authorId)}</span>
      ),
    },
    {
      key: 'isPublished',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.isPublished ? 'success' : 'default'}>
          {item.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => handlePublishToggle(e, item)}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-primary transition-colors"
            aria-label={item.isPublished ? 'Unpublish' : 'Publish'}
            disabled={isPublishingBlog}
          >
            {item.isPublished ? (
              <IoEyeOffOutline className="w-4 h-4" />
            ) : (
              <IoEyeOutline className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/blogs/${item._id}/edit`);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-primary transition-colors"
            aria-label="Edit blog"
          >
            <IoPencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-error transition-colors"
            aria-label="Delete blog"
          >
            <IoTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Blog</h1>
          <p className="text-sm text-text-muted mt-1">Manage blog posts</p>
        </div>
        <Button
          leftIcon={<IoAdd className="w-4 h-4" />}
          onClick={() => navigate('/blogs/new')}
        >
          Add blog post
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm h-9 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  statusFilter === filter
                    ? 'bg-primary text-secondary'
                    : 'bg-background text-text-secondary hover:bg-background/80'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Blogs Table */}
      <Card>
        {isBlogsLoading ? (
          <TableSkeleton
            rowCount={10}
            columns={[
              { image: true, width: '80px' },
              {},
              {},
              {},
              {},
              { alignRight: true },
            ]}
          />
        ) : (
          <Table
            data={blogs || []}
            columns={columns}
            onRowClick={(item) => navigate(`/blogs/${item._id}/edit`)}
            emptyMessage="No blogs found"
          />
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedBlog(null);
        }}
        title="Delete Blog Post"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete &quot;{selectedBlog?.title}&quot;? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedBlog(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={isDeletingBlog}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogsList;
