import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useDeleteCategory } from '../hooks/useDeleteCategory';
import { Table, TableSkeleton, Button, Badge, Card, Modal } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { Category } from '@/api/categories';
import {
  IoAdd,
  IoPencil,
  IoTrash,
  IoSearchOutline,
  IoImageOutline,
  IoChevronForward,
  IoStar,
  IoStarOutline,
} from 'react-icons/io5';

function getImageUrl(image: Category['image']): string | null {
  if (!image) return null;
  if (typeof image === 'string') {
    if (!image) return null;
    if (image.startsWith('http') || image.startsWith('data:')) return image;
    const base =
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3002';
    return `${base}${image}`;
  }
  if (image.url) {
    if (image.url.startsWith('http')) return image.url;
    const base =
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3002';
    return `${base}${image.url}`;
  }
  return null;
}

const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { categories, isCategoriesLoading } = useCategories(debouncedSearch);
  const { deleteCategoryMutation, isDeletingCategory } = useDeleteCategory();

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedCategory) return;
    deleteCategoryMutation(selectedCategory._id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedCategory(null);
      },
    });
  };

  const columns: TableColumn<Category>[] = [
    {
      key: 'image',
      header: 'Image',
      width: '80px',
      render: (item) => {
        const url = getImageUrl(item.image);
        return (
          <div className="h-12 w-12 overflow-hidden rounded-lg border border-border bg-background">
            {url ? (
              <img
                src={url}
                alt={typeof item.image === 'object' ? item.image?.alt || item.name : item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-text-muted">
                <IoImageOutline className="h-5 w-5" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'name',
      header: 'Category',
      render: (item) => (
        <div className="min-w-0">
          <p className="font-medium text-text-primary">{item.name}</p>
          <p className="mt-0.5 text-xs text-text-muted">{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item) => (
        <span className="line-clamp-2 max-w-xs text-sm text-text-secondary">
          {item.description || '—'}
        </span>
      ),
    },
    {
      key: 'isFeatured',
      header: 'Featured',
      align: 'center',
      render: (item) =>
        item.isFeatured ? (
          <IoStar className="mx-auto h-5 w-5 text-amber-400" aria-label="Featured" />
        ) : (
          <IoStarOutline
            className="mx-auto h-5 w-5 text-text-muted/50"
            aria-label="Not featured"
          />
        ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.isActive ? 'success' : 'default'} size="sm" className="rounded-full">
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/categories/${item._id}/edit`);
            }}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-background hover:text-primary"
            aria-label="Edit category"
          >
            <IoPencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-error/10 hover:text-error"
            aria-label="Delete category"
          >
            <IoTrash className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            Categories
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage product categories for your storefront.
          </p>
        </div>
        <Button
          leftIcon={<IoAdd className="h-4 w-4" />}
          onClick={() => navigate('/categories/new')}
        >
          Add category
        </Button>
      </div>

      <Card className="[&>div:last-child]:p-4">
        <div className="relative">
          <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </Card>

      <Card className="overflow-hidden [&>div:last-child]:p-0">
        {isCategoriesLoading ? (
          <TableSkeleton
            rowCount={8}
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
            data={categories}
            columns={columns}
            onRowClick={(item) => navigate(`/categories/${item._id}/edit`)}
            emptyMessage={
              debouncedSearch
                ? `No categories match “${debouncedSearch}”`
                : 'No categories yet'
            }
          />
        )}
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (isDeletingCategory) return;
          setDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete &ldquo;{selectedCategory?.name}&rdquo;? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedCategory(null);
              }}
              disabled={isDeletingCategory}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={isDeletingCategory}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesList;
