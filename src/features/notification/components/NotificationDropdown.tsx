import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import type { Notification, NotificationType } from '../types/notification.types';
import { cn } from '@/utils/cn';

const typeIcons: Record<NotificationType, React.ReactNode> = {
  order: <IoCartOutline className="w-4 h-4" />,
  inventory: <IoCubeOutline className="w-4 h-4" />,
  user: <IoPersonOutline className="w-4 h-4" />,
  affiliate: <IoGiftOutline className="w-4 h-4" />,
  newsletter: <IoMailOutline className="w-4 h-4" />,
  system: <IoServerOutline className="w-4 h-4" />,
};

const typeColors: Record<NotificationType, string> = {
  order: 'bg-primary/10 text-primary',
  inventory: 'bg-warning/10 text-warning',
  user: 'bg-info/10 text-info',
  affiliate: 'bg-success/10 text-success',
  newsletter: 'bg-info/10 text-info',
  system: 'bg-text-muted/10 text-text-muted',
};

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClick: () => void;
}

function NotificationItem({ notification, onMarkAsRead, onClick }: NotificationItemProps) {
  const icon = typeIcons[notification.type];
  const colorClass = typeColors[notification.type];

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'w-full flex gap-3 px-4 py-3 text-left hover:bg-background transition-colors',
        !notification.read && 'bg-primary/5'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center',
          colorClass
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm',
          !notification.read ? 'font-medium text-text-primary' : 'text-text-secondary'
        )}>
          {notification.title}
        </p>
        {notification.message && (
          <p className="text-xs text-text-muted truncate mt-0.5">
            {notification.message}
          </p>
        )}
        <p className="text-xs text-text-muted mt-1">
          {formatTimeAgo(notification.createdAt)}
        </p>
      </div>
    </button>
  );
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, isLoading } = useNotifications({
    limit: 10,
    page: 1,
  });
  const { unreadCount, invalidate } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
    invalidate();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
    invalidate();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-secondary hover:bg-background hover:text-primary transition-colors rounded-lg"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-medium bg-error text-white rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-96 max-h-[480px] bg-surface rounded-lg shadow-lg border border-border z-20 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-text-primary">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsRead.isPending}
                  className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <IoCheckmarkDoneOutline className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <IoNotificationsOutline className="w-12 h-12 text-text-muted mb-3" />
                  <p className="text-sm text-text-muted">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-center text-sm text-primary hover:bg-background border-t border-border transition-colors"
              >
                View all notifications
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
