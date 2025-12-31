/**
 * @fileoverview Hook para alertas de segurança em tempo real
 * @module hooks/useSecurityAlerts
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useRBAC } from '@/hooks/useRBAC';

export interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address: string | null;
  user_id: string | null;
  details: Record<string, any>;
  resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export function useSecurityAlerts() {
  const { user } = useAuth();
  const { isAdmin } = useRBAC();
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar alertas
  const fetchAlerts = useCallback(async (options?: {
    resolved?: boolean;
    severity?: string;
    limit?: number;
  }) => {
    if (!isAdmin) return [];

    setIsLoading(true);
    try {
      let query = supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.resolved !== undefined) {
        query = query.eq('resolved', options.resolved);
      }
      if (options?.severity) {
        query = query.eq('severity', options.severity);
      }
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar alertas:', error);
        return [];
      }

      setAlerts(data as SecurityAlert[]);
      setUnreadCount(data.filter(a => !a.resolved).length);
      return data as SecurityAlert[];
    } catch (err) {
      console.error('Erro:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  // Resolver alerta
  const resolveAlert = useCallback(async (alertId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({
          resolved: true,
          resolved_by: user.id,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      if (error) {
        toast.error('Erro ao resolver alerta');
        return false;
      }

      toast.success('Alerta resolvido');
      await fetchAlerts({ resolved: false });
      return true;
    } catch (err) {
      toast.error('Erro ao resolver alerta');
      return false;
    }
  }, [user?.id, fetchAlerts]);

  // Criar alerta manual
  const createAlert = useCallback(async (
    type: string,
    severity: SecurityAlert['severity'],
    details: Record<string, any>,
    ipAddress?: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from('security_alerts').insert({
        type,
        severity,
        details,
        ip_address: ipAddress,
        user_id: user?.id,
      });

      if (error) {
        console.error('Erro ao criar alerta:', error);
        return false;
      }

      return true;
    } catch (err) {
      return false;
    }
  }, [user?.id]);

  // Subscrever para alertas em tempo real
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('security-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_alerts',
        },
        (payload) => {
          const newAlert = payload.new as SecurityAlert;
          
          // Mostrar notificação para alertas críticos
          if (newAlert.severity === 'critical') {
            toast.error(`⚠️ Alerta Crítico: ${newAlert.type}`, {
              duration: 10000,
            });
          } else if (newAlert.severity === 'high') {
            toast.warning(`Alerta: ${newAlert.type}`);
          }

          // Atualizar lista de alertas
          setAlerts(prev => [newAlert, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Buscar alertas iniciais
    fetchAlerts({ resolved: false, limit: 50 });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, fetchAlerts]);

  // Estatísticas de alertas
  const getAlertStats = useCallback(() => {
    const stats = {
      total: alerts.length,
      unresolved: alerts.filter(a => !a.resolved).length,
      critical: alerts.filter(a => a.severity === 'critical' && !a.resolved).length,
      high: alerts.filter(a => a.severity === 'high' && !a.resolved).length,
      medium: alerts.filter(a => a.severity === 'medium' && !a.resolved).length,
      low: alerts.filter(a => a.severity === 'low' && !a.resolved).length,
      byType: {} as Record<string, number>,
    };

    alerts.forEach(alert => {
      if (!alert.resolved) {
        stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;
      }
    });

    return stats;
  }, [alerts]);

  return {
    alerts,
    unreadCount,
    isLoading,
    fetchAlerts,
    resolveAlert,
    createAlert,
    getAlertStats,
  };
}
