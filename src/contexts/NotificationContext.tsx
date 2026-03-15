// NotificationContext - connected to database via useNotificacoes
import React, { createContext, useContext, ReactNode } from 'react';
import { useNotificacoes, Notificacao } from '@/hooks/useNotificacoes';

interface NotificationContextType {
  notifications: Notificacao[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas } = useNotificacoes();

  return (
    <NotificationContext.Provider value={{
      notifications: notificacoes,
      unreadCount: naoLidas,
      markAsRead: marcarComoLida,
      markAllAsRead: marcarTodasComoLidas,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
}

export const useNotifications = useNotification;
