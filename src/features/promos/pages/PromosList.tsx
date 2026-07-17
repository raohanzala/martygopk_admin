import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromos } from '../hooks/usePromos';
import { useDeletePromo } from '../hooks/useDeletePromo';
import { Table, TableSkeleton, Button, Badge, Card, Modal } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { Promo } from '@/api/promos';
import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5';

const PromosList: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promo | null>(null);

  const isActiveParam =
    statusFilter === 'all' ? undefined : statusFilter === 'active';

  const { promos, pagination, isPromosLoading } = usePromos({
    search: search || undefined,
    isActive: isActiveParam,
    page: 1,
    limit: 20,
  });
  const { deletePromoMutation, isDeletingPromo } = useDeletePromo();

  const handleDelete = (promo: Promo) => {
    setSelectedPromo(promo);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPromo) {
      deletePromoMutation(selectedPromo._id);
      setDeleteModalOpen(false);
      setSelectedPromo(null);
    }
  };

  const formatDate = (d: string | null | undefined) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString();
  };

  const columns: TableColumn<Promo>[] = [
    {
      key: 'code',
      header: 'Code',
      render: (item) => (
        <p className="font-mono font-medium text-text-primary">{item.code}</p>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span className="text-text-muted capitalize">{item.type}</span>
      ),
    },
    {
      key: 'value',
      header: 'Value',
      render: (item) =>
        item.type === 'percentage'
          ? `${item.value}%`
          : item.value,
    },
    {
      key: 'usedCount',
      header: 'Used',
      render: (item) => (
        <span>
          {item.usedCount}
          {item.usageLimit != null ? ` / ${item.usageLimit}` : ''}
        </span>
      ),
    },
    {
      key: 'validTo',
      header: 'Valid until',
      render: (item) => formatDate(item.validTo),
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
      render: (item) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/promos/${item._id}/edit`)}
            leftIcon={<IoPencil className="w-4 h-4" />}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item)}
            leftIcon={<IoTrash className="w-4 h-4" />}
            className="text-error hover:text-error"
          />
        </div>
      ),
      width: '120px',
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Promo codes</h1>
            <p className="text-sm text-text-muted mt-1">
              Create and manage discount codes
            </p>
          </div>
          <Button
            leftIcon={<IoAdd className="w-5 h-5" />}
            onClick={() => navigate('/promos/new')}
          >
            Add promo code
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code..."
            className="px-3 py-2 border border-border rounded bg-background text-text-primary placeholder:text-text-muted flex-1 max-w-xs"
          />
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? 'All' : status === 'active' ? 'Active' : 'Inactive'}
              </Button>
            ))}
          </div>
        </div>

        {isPromosLoading ? (
          <TableSkeleton
            rowCount={10}
            columns={[
              {},
              {},
              {},
              {},
              {},
              {},
              { alignRight: true },
            ]}
          />
        ) : (
          <Table<Promo>
            columns={columns}
            data={promos}
            onRowClick={(item: Promo) => navigate(`/promos/${item._id}/edit`)}
          />
        )}

        {pagination && pagination.pages > 1 && (
          <p className="text-sm text-text-muted mt-4">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </p>
        )}
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete promo code"
      >
        <p className="text-text-primary mb-4">
          Are you sure you want to delete the promo code <strong>{selectedPromo?.code}</strong>?
          This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            isLoading={isDeletingPromo}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PromosList;
