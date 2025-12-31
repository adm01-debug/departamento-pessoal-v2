/**
 * @fileoverview Hook para assinatura digital
 * @module hooks/useAssinaturaDigital
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

export interface DocumentoAssinatura {
  id: string;
  colaborador_id: string;
  tipo_documento: string;
  titulo: string;
  conteudo_url?: string;
  status: 'pendente' | 'assinado' | 'cancelado';
  assinatura_base64?: string;
  assinado_em?: string;
  assinado_por?: string;
  ip_assinatura?: string;
  hash_documento?: string;
  created_at: string;
  created_by?: string;
}


export interface UseAssinaturaDigitalReturn {
  documentosPendentes: DocumentoAssinatura[];
  documentosAssinados: DocumentoAssinatura[];
  loadingPendentes: boolean;
  loadingAssinados: boolean;
  criarDocumento: (data: { colaborador_id: string; tipo_documento: string; titulo: string; conteudo_url?: string }) => void;
  assinarDocumento: (data: { id: string; assinatura_base64: string }) => void;
  cancelarDocumento: (id: string) => void;
  isCriando: boolean;
  isAssinando: boolean;
}

export function useAssinaturaDigital(): UseAssinaturaDigitalReturn {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Buscar documentos pendentes de assinatura
  const { data: documentosPendentes = [], isLoading: loadingPendentes } = useQuery({
    queryKey: ['assinaturas-pendentes'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documentos_assinatura')
        .select(`
          *,
          colaboradores (nome_completo, cpf, cargo)
        `)
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Buscar documentos assinados
  const { data: documentosAssinados = [], isLoading: loadingAssinados } = useQuery({
    queryKey: ['assinaturas-concluidas'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documentos_assinatura')
        .select(`
          *,
          colaboradores (nome_completo, cpf, cargo)
        `)
        .eq('status', 'assinado')
        .order('assinado_em', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });

  // Criar documento para assinatura
  const criarDocumento = useMutation({
    mutationFn: async (dados: {
      colaborador_id: string;
      tipo_documento: string;
      titulo: string;
      conteudo_url?: string;
    }) => {
      const hash = await gerarHashDocumento(dados.titulo + dados.colaborador_id + new Date().toISOString());
      
      const { data, error } = await supabase
        .from('documentos_assinatura')
        .insert({
          ...dados,
          status: 'pendente',
          hash_documento: hash,
          created_by: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Documento criado e enviado para assinatura!');
      queryClient.invalidateQueries({ queryKey: ['assinaturas-pendentes'] });
    },
    onError: () => {
      toast.error('Erro ao criar documento');
    },
  });

  // Assinar documento
  const assinarDocumento = useMutation({
    mutationFn: async ({ 
      documentoId, 
      assinaturaBase64 
    }: { 
      documentoId: string; 
      assinaturaBase64: string;
    }) => {
      // Capturar IP do cliente via API externa
      let ipAddress: string | null = null;
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (err) {
        logger.warn('Não foi possível capturar o IP:', err);
      }

      const { error } = await supabase
        .from('documentos_assinatura')
        .update({
          status: 'assinado',
          assinatura_base64: assinaturaBase64,
          assinado_em: new Date().toISOString(),
          assinado_por: user?.id,
          ip_assinatura: ipAddress,
        })
        .eq('id', documentoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Documento assinado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['assinaturas-pendentes'] });
      queryClient.invalidateQueries({ queryKey: ['assinaturas-concluidas'] });
    },
    onError: () => {
      toast.error('Erro ao assinar documento');
    },
  });

  // Cancelar documento
  const cancelarDocumento = useMutation({
    mutationFn: async (documentoId: string) => {
      const { error } = await supabase
        .from('documentos_assinatura')
        .update({ status: 'cancelado' })
        .eq('id', documentoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Documento cancelado');
      queryClient.invalidateQueries({ queryKey: ['assinaturas-pendentes'] });
    },
    onError: () => {
      toast.error('Erro ao cancelar documento');
    },
  });

  return {
    documentosPendentes,
    documentosAssinados,
    loadingPendentes,
    loadingAssinados,
    criarDocumento: criarDocumento.mutate,
    assinarDocumento: assinarDocumento.mutate,
    cancelarDocumento: cancelarDocumento.mutate,
    isCriando: criarDocumento.isPending,
    isAssinando: assinarDocumento.isPending,
  };
}

// Gerar hash simples do documento
async function gerarHashDocumento(conteudo: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(conteudo);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const TIPOS_DOCUMENTO = [
  { value: 'contrato_trabalho', label: 'Contrato de Trabalho' },
  { value: 'aditivo_contratual', label: 'Aditivo Contratual' },
  { value: 'termo_responsabilidade', label: 'Termo de Responsabilidade' },
  { value: 'aviso_ferias', label: 'Aviso de Férias' },
  { value: 'recibo_ferias', label: 'Recibo de Férias' },
  { value: 'aviso_previo', label: 'Aviso Prévio' },
  { value: 'termo_rescisao', label: 'Termo de Rescisão' },
  { value: 'declaracao', label: 'Declaração' },
  { value: 'outros', label: 'Outros' },
];











