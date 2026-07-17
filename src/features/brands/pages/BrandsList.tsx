import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrands } from '../hooks/useBrands';
import { useDeleteBrand } from '../hooks/useDeleteBrand';
import { Table, TableSkeleton, Button, Badge, Card, Modal } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { Brand } from '@/api/brands';
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5';

const BrandsList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const isActiveParam =
    statusFilter === 'all'
      ? undefined
      : statusFilter === 'active'
      ? true
      : false;

  const { brands, isBrandsLoading } = useBrands({
    search: search || undefined,
    isActive: isActiveParam,
  });
  const { deleteBrandMutation, isDeletingBrand } = useDeleteBrand();

  const handleDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBrand) {
      deleteBrandMutation(selectedBrand._id);
      setDeleteModalOpen(false);
      setSelectedBrand(null);
    }
  };

  const getLogoUrl = (logo?: string) => {
    if (!logo) return '/placeholder.png';
    if (logo.startsWith('http')) return logo;
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return logo.startsWith('/') ? `${base}${logo}` : logo;
  };

  const columns: TableColumn<Brand>[] = [
    {
      key: 'logo',
      header: 'Logo',
      render: (item) => (
        <img
          src={getLogoUrl(item.logo)}
          alt={item.name}
          className="w-12 h-12 object-contain rounded bg-background p-1 border border-border"
        />
      ),
      width: '80px',
    },
    {
      key: 'name',
      header: 'Brand',
      render: (item) => (
        <p className="font-medium text-text-primary">{item.name}</p>
      ),
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
              navigate(`/brands/${item._id}/edit`);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-primary transition-colors"
            aria-label="Edit brand"
          >
            <IoPencil className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item);
            }}
            className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-error transition-colors"
            aria-label="Delete brand"
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
            Brands
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage product brands
          </p>
        </div>
        <Button
          leftIcon={<IoAdd className="w-4 h-4" />}
          onClick={() => navigate('/brands/new')}
        >
          Add brand
        </Button>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm h-9 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map((filter) => (
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

      {/* Brands Table */}
      <Card>
        {isBrandsLoading ? (
          <TableSkeleton
            rowCount={10}
            columns={[
              { image: true, width: '80px' },
              {},
              {},
              { alignRight: true },
            ]}
          />
        ) : (
          <Table
            data={brands}
            columns={columns}
            onRowClick={(item) => navigate(`/brands/${item._id}/edit`)}
          />
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedBrand(null);
        }}
        title="Delete Brand"
      >
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Are you sure you want to delete &quot;{selectedBrand?.name}&quot;?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedBrand(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={isDeletingBrand}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BrandsList;
