// V15-397
import { supabase } from '@/integrations/supabase/client';
export interface Backup { id: string; empresa_id: string; tipo: 'manual' | 'automatico'; tamanho_bytes: number; arquivo_url: string; created_at: string; }
export const backupService = {
  async list(empresaId: string) { const { data, error } = await supabase.from('backups').select('*').eq('empresa_id', empresaId).order('created_at', { ascending: false }); if (error) throw error; return data as Backup[]; },
  async criar(empresaId: string) { const { data, error } = await supabase.functions.invoke('criar-backup', { body: { empresa_id: empresaId } }); if (error) throw error; return data; },
  async restaurar(backupId: string) { const { data, error } = await supabase.functions.invoke('restaurar-backup', { body: { backup_id: backupId } }); if (error) throw error; return data; },
  async download(backupId: string) { const backup = await supabase.from('backups').select('arquivo_url').eq('id', backupId).single(); if (backup.error) throw backup.error; return backup.data.arquivo_url; },
};
