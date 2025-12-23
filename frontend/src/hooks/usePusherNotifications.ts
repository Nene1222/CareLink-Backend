import { useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';

export interface Notification {
  id: string;
  type: 'created' | 'checkout' | 'updated';
  message: string;
  timestamp: Date;
  userId?: string;
  name?: string;
  read: boolean;
}

export const usePusherNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // enable pusher debug in console
    ;(Pusher as any).logToConsole = true

    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY as string, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER as string,
      forceTLS: true,
    });

    pusher.connection.bind('state_change', (states: any) => {
      console.log('Pusher connection state:', states);
    });
    pusher.connection.bind('error', (err: any) => {
      console.error('Pusher connection error:', err);
    });

    const channel = pusher.subscribe('attendance-channel');
    channel.bind('pusher:subscription_succeeded', () => console.log('Subscribed to attendance-channel'));
    channel.bind('pusher:subscription_error', (err: any) => console.error('Subscription error', err));

    channel.bind('attendance-updated', (data: any) => {
      const newNotification: Notification = {
        id: `${data.type}-${data.attendanceId}-${Date.now()}`,
        type: data.type,
        message: data.message,
        timestamp: new Date(data.timestamp),
        userId: data.userId,
        name: data.name,
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      console.log('New notification received:', newNotification);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  };
};
