/**
 * @fileoverview Service para backup e restore
 * @module services/backupService
 */
import { supabase } from '@/integrations/supabase/client';
import type { Backup, BackupConfig } from '@/types/backup';

export const backupService = {
  async listar(): Promise<Backup[]> {
    const { data, error } = await supabase.from('backups').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async criar(tipo: 'completo' | 'incremental' | 'diferencial'): Promise<Backup> {
    const { data, error } = await supabase.from('backups').insert({ tipo, status: 'pendente' }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async buscarConfig(): Promise<BackupConfig | null> {
    const { data, error } = await supabase.from('backup_config').select('*').single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },

  async atualizarConfig(config: BackupConfig): Promise<void> {
    const { error } = await supabase.from('backup_config').upsert(config);
    if (error) throw new Error(error.message);
  },

  async restaurar(backupId: string): Promise<void> {
    const { error } = await supabase.rpc('restaurar_backup', { backup_id: backupId });
    if (error) throw new Error(error.message);
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from('backups').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
