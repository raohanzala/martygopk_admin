import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useDeleteCategory } from '../hooks/useDeleteCategory';
import { Table, TableSkeleton, Button, Badge, Card, Modal } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { Category } from '@/api/categories';
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5';

const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const { categories, isCategoriesLoading } = useCategories(search);
  const { deleteCategoryMutation, isDeletingCategory } = useDeleteCategory();

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategoryMutation(selectedCategory._id);
      setDeleteModalOpen(false);
      setSelectedCategory(null);
    }
  };

  const getImageUrl = (image: string) => {
    if (!image) return '/placeholder.png';
    if (image.startsWith('http')) return image;
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${base}${image}`;
  };

  const columns: TableColumn<Category>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (item) => (
        <img
          src={getImageUrl(item.image)}
          alt={item.name}
          className="w-12 h-12 object-cover rounded"
        />
      ),
      width: '80px',
    },
    {
      key: 'name',
      header: 'Category',
      render: (item) => (
        <div>
          <p className="font-medium text-text-primary">{item.name}</p>
          <p className="text-xs text-text-muted">{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item) => (
        <span className="text-sm text-text-secondary line-clamp-2 max-w-xs">
          {item.description || '-'}
        </span>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      render: (item) => (
        <span className="text-sm text-text-secondary tabular-nums">
          {item.order ?? 0}
        </span>
      ),
      width: '80px',
    },
    {
      key: 'showOnHomePage',
      header: 'Home page',
      render: (item) => (
        <Badge variant={item.showOnHomePage ? 'success' : 'default'}>
          {item.showOnHomePage ? 'Yes' : 'No'}
        </Badge>
      ),
      width: '100px',
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.isActive ? 'success' : 'default'}>
          {item.isActive ? 'Active' : 'Inactive'}
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
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/categories/${item._id}/edit`);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-primary transition-colors"
            aria-label="Edit category"
          >
            <IoPencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-error transition-colors"
            aria-label="Delete category"
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
          <h1 className="text-2xl font-semibold text-text-primary">
            Categories
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage product categories
          </p>
        </div>
        <Button
          leftIcon={<IoAdd className="w-4 h-4" />}
          onClick={() => navigate('/categories/new')}
        >
          Add category
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm h-9 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
        </div>
      </Card>

      {/* Categories Table */}
      <Card>
        {isCategoriesLoading ? (
          <TableSkeleton
            rowCount={10}
            columns={[
              { image: true, width: '80px' },
              {},
              {},
              { width: '80px' },
              { width: '100px' },
              {},
              { alignRight: true },
            ]}
          />
        ) : (
          <Table
            data={categories}
            columns={columns}
            onRowClick={(item) => navigate(`/categories/${item._id}/edit`)}
          />
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete &quot;{selectedCategory?.name}&quot;?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedCategory(null);
              }}
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
