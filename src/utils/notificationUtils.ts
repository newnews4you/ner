export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export const createNotification = (
  type: NotificationType,
  title: string,
  message: string,
  actionUrl?: string
): Notification => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  type,
  title,
  message,
  timestamp: new Date(),
  read: false,
  actionUrl,
});

export const markAsRead = (notifications: Notification[], id: string): Notification[] => {
  return notifications.map(n => n.id === id ? { ...n, read: true } : n);
};

export const markAllAsRead = (notifications: Notification[]): Notification[] => {
  return notifications.map(n => ({ ...n, read: true }));
};

export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.read).length;
};

