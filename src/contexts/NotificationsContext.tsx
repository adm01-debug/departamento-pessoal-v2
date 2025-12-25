import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
interface Notification { id: string; type: 'success' | 'error' | 'warning' | 'info'; message: string; }
interface NotificationsContextValue {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}
const NotificationsContext = createContext<NotificationsContextValue | null>(null);
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const addNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { ...n, id }]);
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== id)), 5000);
  }, []);
  const removeNotification = useCallback((id: string) => setNotifications(prev => prev.filter(x => x.id !== id)), []);
  const clearAll = useCallback(() => setNotifications([]), []);
  return <NotificationsContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>{children}</NotificationsContext.Provider>;
}
export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotificationsContext must be used within NotificationsProvider');
  return ctx;
}
