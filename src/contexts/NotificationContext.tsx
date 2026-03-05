// NotificationContext
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => removeNotification(id), notification.duration || 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => addNotification({ type: 'success', title, message }), [addNotification]);
  const error = useCallback((title: string, message?: string) => addNotification({ type: 'error', title, message }), [addNotification]);
  const warning = useCallback((title: string, message?: string) => addNotification({ type: 'warning', title, message }), [addNotification]);
  const info = useCallback((title: string, message?: string) => addNotification({ type: 'info', title, message }), [addNotification]);

  const unreadCount = notifications.length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, removeNotification, success, error, warning, info }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
}

// Alias
export const useNotifications = useNotification;
