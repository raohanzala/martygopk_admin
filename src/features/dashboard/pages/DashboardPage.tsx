import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { Card, Badge, Spinner, Table } from '@/components';
import type { TableColumn } from '@/components/Table';
import type { RecentOrderItem } from '@/api/dashboard';
import {
  IoGridOutline,
  IoReceiptOutline,
  IoPeopleOutline,
  IoMailOutline,
  IoPricetagOutline,
  IoTimeOutline,
  IoArrowForwardOutline,
  IoEyeOutline,
} from 'react-icons/io5';

const CURRENCY = 'PKR';

function formatRevenue(value: number): string {
  return `${CURRENCY} ${Number(value).toLocaleString()}`;
}

function getStatusBadgeVariant(
  status: string
): 'default' | 'success' | 'warning' | 'error' | 'info' {
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

function getCustomerDisplay(order: { userId?: { name?: string; email?: string } | null; shippingAddress?: { fullName?: string } }): string {
  const u = order.userId;
  if (u && typeof u === 'object') {
    if (u.name) return u.name;
    if (u.email) return u.email;
  }
  if (order.shippingAddress?.fullName) return order.shippingAddress.fullName;
  return 'Guest';
}

const statCards = [
  {
    key: 'totalProducts' as const,
    title: 'Total Products',
    icon: IoGridOutline,
    link: '/products',
    color: 'primary',
  },
  {
    key: 'totalOrders' as const,
    title: 'Total Orders',
    icon: IoReceiptOutline,
    link: '/orders',
    color: 'success',
  },
  {
    key: 'totalUsers' as const,
    title: 'Total Users',
    icon: IoPeopleOutline,
    link: '/users',
    color: 'info',
  },
  {
    key: 'newsletterSubscribers' as const,
    title: 'Newsletter Subscribers',
    icon: IoMailOutline,
    link: '/newsletter',
    color: 'default',
  },
  {
    key: 'totalRevenue' as const,
    title: 'Revenue',
    icon: IoPricetagOutline,
    link: '/orders',
    format: (v: number) => formatRevenue(v),
    color: 'warning',
  },
  {
    key: 'pendingOrdersCount' as const,
    title: 'Pending Orders',
    icon: IoTimeOutline,
    link: '/orders',
    color: 'warning',
  },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { stats, recentOrders, isDashboardLoading, dashboardError } =
    useDashboardStats();

  const recentOrdersColumns: TableColumn<RecentOrderItem>[] = [
    {
      key: 'orderNumber',
      header: 'Order',
      width: '140px',
      render: (item) => (
        <span className="font-medium text-text-primary">
          {item.orderNumber || item._id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      key: 'userId',
      header: 'Customer',
      render: (item) => (
        <span className="text-text-secondary">{getCustomerDisplay(item)}</span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      width: '120px',
      render: (item) => (
        <span className="text-text-primary">{formatRevenue(item.totalAmount)}</span>
      ),
    },
    {
      key: 'orderStatus',
      header: 'Status',
      width: '100px',
      render: (item) => (
        <Badge variant={getStatusBadgeVariant(item.orderStatus)}>
          {item.orderStatus}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      width: '80px',
      render: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/orders/${item._id}`);
          }}
          className="p-1.5 rounded text-text-secondary hover:bg-background hover:text-primary transition-colors"
          aria-label="View order"
        >
          <IoEyeOutline className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (isDashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="p-6 text-center">
        <p className="text-error">Failed to load dashboard stats.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-text-secondary text-sm">
          Overview of your store
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(({ key, title, icon: Icon, link, format }) => {
          const value = stats?.[key] ?? 0;
          const display =
            typeof value === 'number' && format ? format(value) : String(value);
          return (
            <button
              key={key}
              type="button"
              onClick={() => navigate(link)}
              className="bg-surface rounded-lg border border-border p-5 text-left hover:border-primary/50 hover:bg-background/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-muted">{title}</span>
                <Icon className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              </div>
              <p className="text-2xl font-semibold text-text-primary truncate">
                {display}
              </p>
            </button>
          );
        })}
      </div>

      <Card title="Recent Orders" description="Latest 5 orders">
        <Table<RecentOrderItem>
          data={recentOrders}
          columns={recentOrdersColumns}
          onRowClick={(item) => navigate(`/orders/${item._id}`)}
          emptyMessage="No orders yet"
        />
        {recentOrders.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              View all orders
              <IoArrowForwardOutline className="w-4 h-4" />
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
