// @ts-nocheck
import { useState, useCallback } from 'react';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';
import { api } from '@/lib/api';
import { useToast } from './useToast';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';

export interface Desligamento {
  id: string;
  colaborador_id: string;
  data_desligamento: string;
  tipo_desligamento: string;
  motivo: string;
  observacoes?: string;
  documentos?: string[];
  status: 'pendente' | 'concluido';
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  calculos_rescisao?: any;
}

export interface CalculosRescisao {
  id: string;
  desligamento_id: string;
  total_proventos: number;
  total_descontos: number;
  saldo_fgts: number;
  multa_fgts: number;
  total_liquido: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  updated_at?: string;
}

export function useDesligamentos() {
  return useQuery<Desligamento[]>(['desligamentos'], async () => {
    const r = await api.get('/desligamentos');
    return r.data;
  });
}

export function useDesligamento(id: string) {
  return useQuery<Desligamento>(
    ['desligamento', id],
    async () => {
      const r = await api.get(`/desligamentos/${id}`);
      return r.data;
    },
    { enabled: !!id }
  );
}

export function useCreateDesligamento() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const auditoria = useAuditoriaIntegration();

  return useMutation(
    async (data: Partial<Desligamento>) => {
      const r = await api.post('/desligamentos', data);
      return r.data;
    },
    {
      onSuccess: async (data) => {
        qc.invalidateQueries({ queryKey: ['desligamentos'] });
        toast({ title: 'Desligamento iniciado' });
        await auditoria.onDesligamentoCriado(data.id, {
          colaborador_id: data.colaborador_id,
          data_desligamento: data.data_desligamento,
          tipo_desligamento: data.tipo_desligamento,
        });
      },
    }
  );
}

export function useUpdateDesligamento() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const auditoria = useAuditoriaIntegration();

  return useMutation(
    async ({ id, data }: { id: string; data: Partial<Desligamento> }) => {
      const r = await api.put(`/desligamentos/${id}`, data);
      return r.data;
    },
    {
      onSuccess: async (data, variables) => {
        qc.invalidateQueries({ queryKey: ['desligamentos'] });
        toast({ title: 'Desligamento atualizado' });
        await auditoria.onDesligamentoEditado(variables.id, {
          ...variables.data,
        });
      },
    }
  );
}

export function useDeleteDesligamento() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const auditoria = useAuditoriaIntegration();

  return useMutation(
    async (id: string) => {
      await api.delete(`/desligamentos/${id}`);
    },
    {
      onSuccess: async (id) => {
        qc.invalidateQueries({ queryKey: ['desligamentos'] });
        toast({ title: 'Desligamento removido' });
        await auditoria.onDesligamentoRemovido(id);
      },
    }
  );
}

export function useCalcularRescisao() {
  const qc = useQueryClient();
  return useMutation(async (id: string) => {
    const r = await api.post(`/desligamentos/${id}/calcular`);
    return r.data;
  },
  {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['desligamentos'] });
    }
  });
}

export function useConcluirDesligamento() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const auditoria = useAuditoriaIntegration();

  return useMutation(
    async (id: string) => {
      const r = await api.post(`/desligamentos/${id}/concluir`);
      return r.data;
    },
    {
      onSuccess: async (id) => {
        qc.invalidateQueries({ queryKey: ['desligamentos'] });
        toast({ title: 'Desligamento concluído' });
        await auditoria.onDesligamentoConcluido(id);
      },
    }
  );
}
