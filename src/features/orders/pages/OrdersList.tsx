import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks';
import { Table, TableSkeleton, Badge, Card, Pagination } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { Order, OrderStatus } from '@/api/orders';
import { IoEyeOutline } from 'react-icons/io5';

const SEARCH_DEBOUNCE_MS = 400;

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
];

function getStatusBadgeVariant(status: OrderStatus): 'default' | 'success' | 'warning' | 'error' | 'info' {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'shipped':
    case 'paid':
      return 'info';
    case 'cancelled':
      return 'error';
    case 'pending':
    default:
      return 'warning';
  }
}

function getCustomerDisplay(order: Order): string {
  const u = order.userId;
  if (!u) return 'Guest';
  if (typeof u === 'object' && u !== null) {
    if (u.name) return u.name;
    if (u.email) return u.email;
  }
  return '—';
}

const OrdersList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [orderNumberSearch, setOrderNumberSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setOrderNumberSearch(orderNumberInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [orderNumberInput]);

  const { orders, pagination, isOrdersLoading } = useOrders({
    page,
    limit: 10,
    status: statusFilter === 'all' ? undefined : statusFilter,
    orderNumber: orderNumberSearch || undefined,
  });

  const columns: TableColumn<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Order #',
      render: (item) => (
        <span className="font-medium text-text-primary">
          {item.orderNumber || item._id.slice(-8).toUpperCase()}
        </span>
      ),
      width: '140px',
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (item) => (
        <span className="text-sm text-text-secondary">
          {new Date(item.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
      width: '160px',
    },
    {
      key: 'userId',
      header: 'Customer',
      render: (item) => (
        <span className="text-sm text-text-primary">{getCustomerDisplay(item)}</span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      render: (item) => (
        <span className="font-medium text-text-primary">
          Rs. {Number(item.totalAmount).toLocaleString()}
        </span>
      ),
      width: '100px',
    },
    {
      key: 'orderStatus',
      header: 'Status',
      render: (item) => (
        <Badge variant={getStatusBadgeVariant(item.orderStatus)}>
          {item.orderStatus}
        </Badge>
      ),
      width: '100px',
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/orders/${item._id}`);
          }}
          className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-primary transition-colors"
          aria-label="View order"
        >
          <IoEyeOutline className="w-5 h-5" />
        </button>
      ),
      width: '80px',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Orders</h1>
        <p className="text-sm text-text-muted mt-1">
          View and manage all orders. Update status from the order detail page.
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order number..."
              value={orderNumberInput}
              onChange={(e) => setOrderNumberInput(e.target.value)}
              className="w-full px-3 py-2 rounded border border-border bg-surface text-text-primary placeholder:text-text-muted text-sm h-9 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', ...STATUS_OPTIONS] as const).map((filter) => (
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
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isOrdersLoading ? (
          <TableSkeleton
            rowCount={10}
            columns={[
              { width: '140px' },
              { width: '160px' },
              {},
              { width: '100px' },
              { width: '100px' },
              { alignRight: true },
            ]}
          />
        ) : (
          <>
            <Table
              data={orders}
              columns={columns}
              onRowClick={(item) => navigate(`/orders/${item._id}`)}
              emptyMessage="No orders found"
            />
            {pagination.pages > 1 && (
              <div className="mt-4 flex justify-center border-t border-border pt-4">
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

export default OrdersList;
