import { supabase } from '@/integrations/supabase/client';

export interface SecurityAlert {
  id: string;
  type: string;
  severity: string;
  ip_address: string;
  user_id: string | null;
  details: any;
  resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface BlockedIp {
  id: string;
  ip_address: string;
  reason: string;
  blocked_by: string | null;
  blocked_at: string;
  expires_at: string | null;
  permanent: boolean;
  created_at: string;
}

export interface LoginAttempt {
  id: string;
  email: string;
  ip_address: string;
  user_agent: string | null;
  success: boolean;
  failure_reason: string | null;
  mfa_required: boolean;
  mfa_passed: boolean;
  created_at: string;
}

export interface GeoBlockedAttempt {
  id: string;
  ip_address: string;
  country_code: string;
  country_name: string;
  user_agent: string | null;
  created_at: string;
}

export const securityService = {
  async getBlockedIps(): Promise<BlockedIp[]> {
    const { data, error } = await supabase
      .from('blocked_ips' as any)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as BlockedIp[];
  },

  async unblockIp(id: string) {
    const { error } = await supabase
      .from('blocked_ips' as any)
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getLoginAttempts(): Promise<LoginAttempt[]> {
    const { data, error } = await supabase
      .from('login_attempts' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data || []) as unknown as LoginAttempt[];
  },

  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    const { data, error } = await supabase
      .from('security_alerts' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data || []) as unknown as SecurityAlert[];
  },

  async getGeoBlockedAttempts(): Promise<GeoBlockedAttempt[]> {
    const { data, error } = await supabase
      .from('geo_blocked_attempts' as any)
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data || []) as unknown as GeoBlockedAttempt[];
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
