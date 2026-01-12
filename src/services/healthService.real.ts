// V17-S100: HealthService Real
import { supabase } from '@/integrations/supabase/client';
export const healthServiceReal = {
  async check() { try { await supabase.from('empresas').select('id').limit(1); return { status: 'healthy', database: 'connected', timestamp: new Date().toISOString() }; } catch { return { status: 'unhealthy', database: 'disconnected', timestamp: new Date().toISOString() }; } }
}; export default healthServiceReal;
