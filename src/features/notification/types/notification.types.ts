export type NotificationType = 'order' | 'inventory' | 'user' | 'affiliate' | 'newsletter' | 'system';

export interface Notification {
  _id: string;
  title: string;
  message?: string;
  type: NotificationType;
  recipient: string;
  read: boolean;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
