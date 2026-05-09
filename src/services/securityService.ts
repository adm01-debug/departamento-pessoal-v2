import { supabase } from '@/integrations/supabase/client';

export const securityService = {
  async getBlockedIps() {
    const { data, error } = await supabase
      .from('blocked_ips' as any)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async unblockIp(id: string) {
    const { error } = await supabase
      .from('blocked_ips' as any)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getLoginAttempts() {
    const { data, error } = await supabase
      .from('login_attempts' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  },

  async getSecurityAlerts() {
    const { data, error } = await supabase
      .from('security_alerts' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  },

  async getGeoBlockedAttempts() {
    const { data, error } = await supabase
      .from('geo_blocked_attempts' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  },

  async getRateLimitLogs() {
    const { data, error } = await supabase
      .from('rate_limit_logs' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data || [];
  },

  async resolveAlert(id: string, userId: string) {
    const { error } = await supabase
      .from('security_alerts' as any)
      .update({ 
        resolved: true, 
        resolved_by: userId, 
        resolved_at: new Date().toISOString() 
      } as any)
      .eq('id', id);
    if (error) throw error;
  }
};
