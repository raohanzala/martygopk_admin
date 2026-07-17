import React, { useState } from 'react';
import { useNewsletterSubscribers } from '../hooks';
import { Table, TableSkeleton, Card, Badge } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { NewsletterSubscriber, NewsletterSource } from '@/api/newsletter';
import Pagination  from '@/components/Pagination';

const sourceLabels: Record<NewsletterSource, string> = {
  footer: 'Footer',
  popup: 'Popup',
  checkout: 'Checkout',
};

const SubscribersList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState<NewsletterSource | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');

  const params = {
    page,
    limit: 20,
    source: sourceFilter === 'all' ? undefined : sourceFilter,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
  };

  const { subscribers, pagination, isSubscribersLoading } = useNewsletterSubscribers(params);

  const columns: TableColumn<NewsletterSubscriber>[] = [
    {
      key: 'email',
      header: 'Email',
      render: (item) => (
        <span className="text-sm font-medium text-text-primary">{item.email}</span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      render: (item) => (
        <span className="text-sm text-text-secondary">
          {sourceLabels[item.source] || item.source}
        </span>
      ),
      width: '100px',
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item) => (
        <Badge variant={item.isActive ? 'success' : 'default'}>
          {item.isActive ? 'Active' : 'Unsubscribed'}
        </Badge>
      ),
      width: '120px',
    },
    {
      key: 'createdAt',
      header: 'Subscribed',
      render: (item) => (
        <span className="text-xs text-text-muted">
          {new Date(item.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
      width: '120px',
    },
    {
      key: 'unsubscribedAt',
      header: 'Unsubscribed',
      render: (item) =>
        item.unsubscribedAt ? (
          <span className="text-xs text-text-muted">
            {new Date(item.unsubscribedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        ) : (
          <span className="text-xs text-text-muted">—</span>
        ),
      width: '120px',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">
          Newsletter Subscribers
        </h1>
        <p className="text-sm text-text-muted mt-1">
          View and filter email newsletter signups from the website.
        </p>
      </div>

      <Card>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-text-muted self-center mr-2">Source:</span>
          {(['all', 'footer', 'popup', 'checkout'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setSourceFilter(filter);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                sourceFilter === filter
                  ? 'bg-primary text-secondary'
                  : 'bg-background text-text-secondary hover:bg-background/80'
              }`}
            >
              {filter === 'all' ? 'All' : sourceLabels[filter]}
            </button>
          ))}
          <span className="text-sm text-text-muted self-center ml-4 mr-2">Status:</span>
          {(['active', 'inactive', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setStatusFilter(filter);
                setPage(1);
              }}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                statusFilter === filter
                  ? 'bg-primary text-secondary'
                  : 'bg-background text-text-secondary hover:bg-background/80'
              }`}
            >
              {filter === 'all' ? 'All' : filter === 'active' ? 'Active' : 'Unsubscribed'}
            </button>
          ))}
        </div>

        {isSubscribersLoading ? (
          <TableSkeleton
            rowCount={10}
            columns={[
              {},
              { width: '100px' },
              { width: '120px' },
              { width: '120px' },
              { width: '120px' },
            ]}
          />
        ) : (
          <>
            <Table
              data={subscribers || []}
              columns={columns}
              emptyMessage="No subscribers found"
            />
            {pagination && pagination.pages > 1 && (
              <div className="mt-4 flex justify-center">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default SubscribersList;
