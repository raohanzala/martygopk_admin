import React, { useState } from 'react';
import {
  IoNotificationsOutline,
  IoCheckmarkDoneOutline,
  IoCartOutline,
  IoCubeOutline,
  IoPersonOutline,
  IoGiftOutline,
  IoServerOutline,
  IoMailOutline,
} from 'react-icons/io5';
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from '../hooks';
import { Button, Card } from '@/components';
import type { Notification, NotificationType } from '../types/notification.types';
import { cn } from '@/utils/cn';

const typeIcons: Record<NotificationType, React.ReactNode> = {
  order: <IoCartOutline className="w-5 h-5" />,
  inventory: <IoCubeOutline className="w-5 h-5" />,
  user: <IoPersonOutline className="w-5 h-5" />,
  affiliate: <IoGiftOutline className="w-5 h-5" />,
  newsletter: <IoMailOutline className="w-5 h-5" />,
  system: <IoServerOutline className="w-5 h-5" />,
};

const typeColors: Record<NotificationType, string> = {
  order: 'bg-primary/10 text-primary',
  inventory: 'bg-warning/10 text-warning',
  user: 'bg-info/10 text-info',
  affiliate: 'bg-success/10 text-success',
  newsletter: 'bg-info/10 text-info',
  system: 'bg-text-muted/10 text-text-muted',
};

const typeLabels: Record<NotificationType, string> = {
  order: 'Order',
  inventory: 'Inventory',
  user: 'User',
  affiliate: 'Affiliate',
  newsletter: 'Newsletter',
  system: 'System',
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString();
}

interface NotificationRowProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  isMarkingAsRead: boolean;
}

function NotificationRow({ notification, onMarkAsRead, isMarkingAsRead }: NotificationRowProps) {
  const icon = typeIcons[notification.type];
  const colorClass = typeColors[notification.type];

  return (
    <div
      className={cn(
        'flex gap-4 p-4 rounded-lg border transition-colors',
        notification.read
          ? 'bg-surface border-border'
          : 'bg-primary/5 border-primary/20'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
          colorClass
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={cn(
              'text-sm',
              !notification.read ? 'font-medium text-text-primary' : 'text-text-secondary'
            )}>
              {notification.title}
            </p>
            {notification.message && (
              <p className="text-sm text-text-muted mt-1">
                {notification.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-text-muted">
              {formatDate(notification.createdAt)}
            </span>
            <span className="px-2 py-0.5 text-xs rounded bg-background text-text-muted">
              {typeLabels[notification.type]}
            </span>
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification._id)}
                disabled={isMarkingAsRead}
                className="text-xs text-primary hover:underline"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsList() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [page, setPage] = useState(1);

  const { notifications, pagination, isLoading } = useNotifications({
    page,
    limit: 20,
    unreadOnly: filter === 'unread',
  });

  const { unreadCount } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          Notifications
        </h1>
        <p className="text-sm text-text-muted">
          Manage and view all your notifications
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                filter === 'all'
                  ? 'bg-primary text-secondary'
                  : 'bg-background text-text-secondary hover:bg-background/80'
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                filter === 'unread'
                  ? 'bg-primary text-secondary'
                  : 'bg-background text-text-secondary hover:bg-background/80'
              )}
            >
              Unread
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<IoCheckmarkDoneOutline className="w-4 h-4" />}
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending || unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IoNotificationsOutline className="w-16 h-16 text-text-muted mb-4" />
            <p className="text-text-muted mb-2">No notifications</p>
            <p className="text-sm text-text-muted">
              {filter === 'unread'
                ? "You're all caught up!"
                : 'Notifications will appear here when you receive them.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationRow
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                isMarkingAsRead={markAsRead.isPending}
              />
            ))}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6 pt-6 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-text-muted">
              Page {page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page >= pagination.pages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
