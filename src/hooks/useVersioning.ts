import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Version<T = Record<string, unknown>> {
  id: string;
  entity_type: string;
  entity_id: string;
  version_number: number;
  data: T;
  changed_by: string;
  changed_at: string;
  change_summary: string | null;
  user?: {
    full_name: string;
    email: string;
  };
}

export interface VersionDiff {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

/**
 * Hook para gerenciar versionamento de entidades
 */
export function useVersioning<T extends Record<string, unknown>>(
  entityType: string,
  entityId?: string
) {
  const queryClient = useQueryClient();

  const { data: versions, isLoading } = useQuery({
    queryKey: ['versions', entityType, entityId],
    queryFn: async () => {
      if (!entityId) return [];

      const { data, error } = await supabase
        .from('entity_versions')
        .select(`
          *,
          user:changed_by(full_name, email)
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('version_number', { ascending: false });

      if (error) {
        if (error.code === '42P01') return [];
        throw error;
      }

      return data as Version<T>[];
    },
    enabled: !!entityId,
  });

  const createVersionMutation = useMutation({
    mutationFn: async ({ data, summary }: { data: T; summary?: string }) => {
      if (!entityId) throw new Error('Entity ID é obrigatório');

      const { data: { user } } = await supabase.auth.getUser();

      const { data: lastVersion } = await supabase
        .from('entity_versions')
        .select('version_number')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      const nextVersion = (lastVersion?.version_number ?? 0) + 1;

      const { data: newVersion, error } = await supabase
        .from('entity_versions')
        .insert({
          entity_type: entityType,
          entity_id: entityId,
          version_number: nextVersion,
          data,
          changed_by: user?.id,
          change_summary: summary,
        })
        .select()
        .single();

      if (error) throw error;
      return newVersion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['versions', entityType, entityId] });
      toast.success('Versão salva');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao salvar versão: ${error.message}`);
    },
  });

  const restoreVersionMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const version = versions?.find(v => v.id === versionId);
      if (!version) throw new Error('Versão não encontrada');

      await createVersionMutation.mutateAsync({
        data: version.data as T,
        summary: `Restaurado da versão ${version.version_number}`,
      });

      return version.data;
    },
    onSuccess: () => {
      toast.success('Versão restaurada');
    },
  });

  const compareVersions = (v1: Version<T>, v2: Version<T>): VersionDiff[] => {
    const diffs: VersionDiff[] = [];
    const allKeys = new Set([...Object.keys(v1.data), ...Object.keys(v2.data)]);

    allKeys.forEach(key => {
      const oldValue = v1.data[key];
      const newValue = v2.data[key];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        diffs.push({ field: key, oldValue, newValue });
      }
    });

    return diffs;
  };

  return {
    versions: versions ?? [],
    currentVersion: versions?.[0],
    previousVersion: versions?.[1],
    isLoading,
    createVersion: createVersionMutation.mutate,
    restoreVersion: restoreVersionMutation.mutate,
    compareVersions,
    isCreating: createVersionMutation.isPending,
    isRestoring: restoreVersionMutation.isPending,
  };
}

/**
 * Hook para auto-save com versionamento
 */
export function useAutoSaveWithVersion<T extends Record<string, unknown>>(
  entityType: string,
  entityId: string | undefined,
  data: T,
  options: {
    enabled?: boolean;
    interval?: number;
    onSave?: (data: T) => Promise<void>;
  } = {}
) {
  const { enabled = true, interval = 30000, onSave } = options;
  const { createVersion } = useVersioning<T>(entityType, entityId);
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!enabled || !entityId) return;

    const dataString = JSON.stringify(data);
    if (dataString === lastSavedRef.current) return;

    const timer = setTimeout(async () => {
      try {
        if (onSave) await onSave(data);
        createVersion({ data, summary: 'Auto-save' });
        lastSavedRef.current = dataString;
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, interval);

    return () => clearTimeout(timer);
  }, [data, enabled, entityId, interval, createVersion, onSave]);
}
