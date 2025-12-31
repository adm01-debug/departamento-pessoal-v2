/**
 * @fileoverview Hook para gerenciar notificações push de segurança
 * @module hooks/useSecurityPushNotifications
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { browserNotificationService } from '@/services/BrowserNotificationService';
import type { SecurityAlert } from '@/hooks/useSecurityAlerts';

interface NotificationPreferences {
  enabled: boolean;
  criticalAlerts: boolean;
  highAlerts: boolean;
  mediumAlerts: boolean;
  lowAlerts: boolean;
  loginAlerts: boolean;
  sessionAlerts: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  criticalAlerts: true,
  highAlerts: true,
  mediumAlerts: false,
  lowAlerts: false,
  loginAlerts: true,
  sessionAlerts: true,
};

const STORAGE_KEY = 'security_notification_preferences';

export function useSecurityPushNotifications() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Inicializar permissão
  useEffect(() => {
    if (browserNotificationService.isSupported()) {
      setPermission(browserNotificationService.getPermission());
    }
  }, []);

  // Salvar preferências
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  // Solicitar permissão
  const requestPermission = useCallback(async (): Promise<boolean> => {
    const result = await browserNotificationService.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, []);

  // Enviar notificação de alerta de segurança
  const sendSecurityNotification = useCallback(
    async (alert: SecurityAlert) => {
      if (!preferences.enabled || permission !== 'granted') return;

      // Verificar preferências por severidade
      const shouldNotify =
        (alert.severity === 'critical' && preferences.criticalAlerts) ||
        (alert.severity === 'high' && preferences.highAlerts) ||
        (alert.severity === 'medium' && preferences.mediumAlerts) ||
        (alert.severity === 'low' && preferences.lowAlerts);

      if (!shouldNotify) return;

      const message = getAlertMessage(alert);
      await browserNotificationService.sendSecurityAlert(
        alert.type,
        alert.severity,
        message,
        alert.details
      );
    },
    [preferences, permission]
  );

  // Enviar notificação de login
  const sendLoginNotification = useCallback(
    async (success: boolean, ipAddress?: string, location?: string) => {
      if (!preferences.enabled || !preferences.loginAlerts || permission !== 'granted') return;
      await browserNotificationService.sendLoginAlert(success, ipAddress, location);
    },
    [preferences, permission]
  );

  // Enviar notificação de sessão
  const sendSessionNotification = useCallback(
    async (type: 'expired' | 'new_device' | 'concurrent') => {
      if (!preferences.enabled || !preferences.sessionAlerts || permission !== 'granted') return;
      await browserNotificationService.sendSessionAlert(type);
    },
    [preferences, permission]
  );

  // Atualizar preferências
  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  // Subscrever para alertas em tempo real
  useEffect(() => {
    if (!user?.id || permission !== 'granted' || !preferences.enabled) return;

    const channel = supabase
      .channel('security-push-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_alerts',
        },
        (payload) => {
          const alert = payload.new as SecurityAlert;
          sendSecurityNotification(alert);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, permission, preferences.enabled, sendSecurityNotification]);

  return {
    isSupported: browserNotificationService.isSupported(),
    permission,
    preferences,
    requestPermission,
    updatePreferences,
    sendSecurityNotification,
    sendLoginNotification,
    sendSessionNotification,
  };
}

// Helper para formatar mensagem do alerta
function getAlertMessage(alert: SecurityAlert): string {
  const typeMessages: Record<string, string> = {
    brute_force: 'Tentativas de login suspeitas detectadas',
    rate_limit_exceeded: 'Limite de requisições excedido',
    suspicious_login: 'Login de localização suspeita',
    password_change: 'Senha alterada com sucesso',
    mfa_disabled: 'Autenticação em dois fatores desativada',
    new_device: 'Novo dispositivo detectado na conta',
    session_hijack: 'Possível sequestro de sessão detectado',
    unauthorized_access: 'Tentativa de acesso não autorizado',
  };

  return typeMessages[alert.type] || `Alerta: ${alert.type}`;
}

export default useSecurityPushNotifications;
