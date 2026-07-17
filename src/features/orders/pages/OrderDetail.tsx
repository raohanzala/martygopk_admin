import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useUpdateOrderStatus } from '../hooks';
import { Card, Button, Badge, Spinner } from '@/components';
import type { OrderStatus } from '@/api/orders';
import { toastSuccess, toastError } from '@/utils/helpers';
import { IoArrowBack } from 'react-icons/io5';

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

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, isOrderLoading } = useOrder(id || '');
  const { updateStatusMutation, isUpdatingStatus } = useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  const hasStatusChange = selectedStatus && selectedStatus !== order?.orderStatus;

  const handleUpdateStatus = () => {
    if (!id || !selectedStatus || selectedStatus === order?.orderStatus) return;
    updateStatusMutation(
      { id, orderStatus: selectedStatus as OrderStatus },
      {
        onSuccess: () => {
          toastSuccess('Order status updated');
          setSelectedStatus('');
        },
        onError: toastError,
      }
    );
  };

  if (isOrderLoading) {
    return (
      <div className="flex justify-center min-h-[400px] items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <p className="text-text-muted">Order not found.</p>
        <Button variant="outline" onClick={() => navigate('/orders')}>
          Back to orders
        </Button>
      </div>
    );
  }

  const addr = order.shippingAddress;
  const displayId = order.orderNumber || order._id.slice(-8).toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 rounded border border-border hover:bg-background transition-colors text-text-secondary hover:text-primary"
            aria-label="Back to orders"
          >
            <IoArrowBack className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Order {displayId}
            </h1>
            <p className="text-sm text-text-muted mt-0.5">
              {new Date(order.createdAt).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(order.orderStatus)} size="md">
            {order.orderStatus}
          </Badge>
        </div>
      </div>

      {/* Update status */}
      <Card>
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          Update status
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedStatus || order.orderStatus}
            onChange={(e) => setSelectedStatus((e.target.value || '') as OrderStatus)}
            className="min-w-[160px] px-3 py-2 rounded border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          {hasStatusChange && (
            <Button
              onClick={handleUpdateStatus}
              isLoading={isUpdatingStatus}
              disabled={isUpdatingStatus}
            >
              Save status
            </Button>
          )}
        </div>
      </Card>

      {/* Shipping address */}
      <Card>
        <h2 className="text-sm font-semibold text-text-primary mb-3">
          Shipping address
        </h2>
        <div className="text-sm text-text-secondary space-y-1">
          <p className="font-medium text-text-primary">{addr.fullName}</p>
          <p>{addr.street}</p>
          {(addr.area || addr.city) && (
            <p>
              {[addr.area, addr.city, addr.postalCode].filter(Boolean).join(', ')}
            </p>
          )}
          <p>{addr.country || 'Pakistan'}</p>
          <p>{addr.email}</p>
          <p>{addr.phone}</p>
        </div>
      </Card>

      {/* Items */}
      <Card>
        <h2 className="text-sm font-semibold text-text-primary mb-4">Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-secondary uppercase tracking-wider">
                <th className="pb-2 pr-4">#</th>
                <th className="pb-2 pr-4">Variant / SKU</th>
                <th className="pb-2 pr-4 text-right">Qty</th>
                <th className="pb-2 pr-4 text-right">Price</th>
                <th className="pb-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {order.items.map((item, idx) => {
                const variant =
                  typeof item.productVariantId === 'object'
                    ? item.productVariantId
                    : null;
                const sku = variant?.sku ?? '—';
                const subtotal = item.quantity * item.price;
                return (
                  <tr key={idx}>
                    <td className="py-3 pr-4 text-text-secondary">{idx + 1}</td>
                    <td className="py-3 pr-4 text-text-primary">{sku}</td>
                    <td className="py-3 pr-4 text-right">{item.quantity}</td>
                    <td className="py-3 pr-4 text-right">
                      Rs. {Number(item.price).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-medium text-text-primary">
                      Rs. {subtotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-end">
          <div className="text-right">
            <span className="text-text-secondary mr-2">Total:</span>
            <span className="text-lg font-semibold text-text-primary">
              Rs. {Number(order.totalAmount).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetail;
