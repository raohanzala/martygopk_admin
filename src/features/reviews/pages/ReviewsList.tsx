import React, { useState } from 'react';
import { useReviews, useUpdateReviewStatus } from '../hooks';
import { Table, TableSkeleton, Badge, Card } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { Review } from '@/api/reviews';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

const ReviewsList: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const statusParam =
    statusFilter === 'all' ? undefined : statusFilter;

  const { reviews, isReviewsLoading } = useReviews({
    status: statusParam,
    page: 1,
    limit: 20,
  });
  const { updateStatusMutation, isUpdatingStatus } = useUpdateReviewStatus();

  const getUserName = (review: Review) => {
    const u = review.userId;
    if (typeof u === 'object' && u?.name) return u.name;
    return '—';
  };

  const getProductName = (review: Review) => {
    const p = review.productId;
    if (typeof p === 'object' && p?.name) return p.name;
    return '—';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleApprove = (e: React.MouseEvent, review: Review) => {
    e.stopPropagation();
    updateStatusMutation({ reviewId: review._id, status: 'approved' });
  };

  const handleReject = (e: React.MouseEvent, review: Review) => {
    e.stopPropagation();
    updateStatusMutation({ reviewId: review._id, status: 'rejected' });
  };

  const columns: TableColumn<Review>[] = [
    {
      key: 'userId',
      header: 'User',
      render: (item) => (
        <span className="text-sm text-text-primary">{getUserName(item)}</span>
      ),
    },
    {
      key: 'productId',
      header: 'Product',
      render: (item) => (
        <span className="text-sm text-text-secondary">{getProductName(item)}</span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (item) => (
        <span className="text-sm font-medium text-text-primary">
          {item.rating}/5
        </span>
      ),
      width: '80px',
    },
    {
      key: 'comment',
      header: 'Comment',
      render: (item) => (
        <p className="text-sm text-text-secondary line-clamp-2 max-w-[200px]">
          {item.comment || '—'}
        </p>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <Badge variant={getStatusBadgeVariant(item.status)}>
          {item.status}
        </Badge>
      ),
      width: '100px',
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (item) => (
        <span className="text-xs text-text-muted">
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      ),
      width: '100px',
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) =>
        item.status === 'pending' ? (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={(e) => handleApprove(e, item)}
              className="p-1.5 rounded text-success hover:bg-success/10 transition-colors"
              aria-label="Approve review"
              disabled={isUpdatingStatus}
            >
              <IoCheckmarkCircle className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => handleReject(e, item)}
              className="p-1.5 rounded text-error hover:bg-error/10 transition-colors"
              aria-label="Reject review"
              disabled={isUpdatingStatus}
            >
              <IoCloseCircle className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <span className="text-xs text-text-muted">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Reviews</h1>
        <p className="text-sm text-text-muted mt-1">
          Moderate product reviews. Approve to show on the website.
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2 mb-4">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
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

        {isReviewsLoading ? (
          <TableSkeleton
            rowCount={10}
            columns={[
              {},
              {},
              { width: '80px' },
              {},
              { width: '100px' },
              {},
              { alignRight: true },
            ]}
          />
        ) : (
          <Table
            data={reviews || []}
            columns={columns}
            emptyMessage="No reviews found"
          />
        )}
      </Card>
    </div>
  );
};

export default ReviewsList;
