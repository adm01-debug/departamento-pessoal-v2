/**
 * @fileoverview Hook para workflow de admissão
 * @module hooks/useAdmissaoWorkflow
 * @version V8.4
 */
import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

// ============================================
// TIPOS
// ============================================

export type AdmissaoEtapa = 
  | 'dados_pessoais'
  | 'documentos'
  | 'exame_admissional'
  | 'contrato'
  | 'beneficios'
  | 'integracao'
  | 'concluido';

export type AdmissaoStatus = 
  | 'pendente'
  | 'em_andamento'
  | 'aguardando_documentos'
  | 'aguardando_exame'
  | 'aguardando_assinatura'
  | 'concluido'
  | 'cancelado';

export interface AdmissaoWorkflowItem {
  id: string;
  admissao_id: string;
  etapa: AdmissaoEtapa;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'erro';
  obrigatoria: boolean;
  ordem: number;
  dados?: Record<string, unknown>;
  iniciado_em?: string;
  concluido_em?: string;
  responsavel_id?: string;
  observacoes?: string;
}

export interface DocumentoAdmissao {
  id: string;
  admissao_id: string;
  tipo: string;
  nome: string;
  url?: string;
  status: 'pendente' | 'enviado' | 'aprovado' | 'rejeitado';
  obrigatorio: boolean;
  data_envio?: string;
  validado_por?: string;
  motivo_rejeicao?: string;
}

export interface AdmissaoCompleta {
  id: string;
  nome_completo: string;
  cpf: string;
  email: string;
  telefone?: string;
  cargo_id?: string;
  departamento_id?: string;
  data_admissao: string;
  salario: number;
  tipo_contrato: 'clt' | 'pj' | 'estagio' | 'temporario';
  status: AdmissaoStatus;
  etapa_atual: AdmissaoEtapa;
  total_etapas: number;
  etapas_concluidas: number;
  documentos: DocumentoAdmissao[];
  workflow: AdmissaoWorkflowItem[];
  created_at: string;
  updated_at: string;
}

// ============================================
// CONSTANTES
// ============================================

const ETAPAS_ORDEM: AdmissaoEtapa[] = [
  'dados_pessoais',
  'documentos',
  'exame_admissional',
  'contrato',
  'beneficios',
  'integracao',
  'concluido',
];

const ETAPAS_CONFIG: Record<AdmissaoEtapa, { nome: string; obrigatoria: boolean }> = {
  dados_pessoais: { nome: 'Dados Pessoais', obrigatoria: true },
  documentos: { nome: 'Documentação', obrigatoria: true },
  exame_admissional: { nome: 'Exame Admissional', obrigatoria: true },
  contrato: { nome: 'Contrato', obrigatoria: true },
  beneficios: { nome: 'Benefícios', obrigatoria: false },
  integracao: { nome: 'Integração', obrigatoria: false },
  concluido: { nome: 'Concluído', obrigatoria: true },
};

const DOCUMENTOS_OBRIGATORIOS = [
  { tipo: 'rg', nome: 'RG' },
  { tipo: 'cpf', nome: 'CPF' },
  { tipo: 'ctps', nome: 'Carteira de Trabalho' },
  { tipo: 'titulo_eleitor', nome: 'Título de Eleitor' },
  { tipo: 'comprovante_residencia', nome: 'Comprovante de Residência' },
  { tipo: 'foto_3x4', nome: 'Foto 3x4' },
  { tipo: 'certidao_nascimento_filhos', nome: 'Certidão de Nascimento dos Filhos' },
];

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useAdmissaoWorkflow(admissaoId?: string) {
  const queryClient = useQueryClient();
  const [etapaAtual, setEtapaAtual] = useState<AdmissaoEtapa>('dados_pessoais');

  // Query da admissão
  const {
    data: admissao,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admissao-workflow', admissaoId],
    queryFn: async (): Promise<AdmissaoCompleta | null> => {
      if (!admissaoId) return null;

      logger.info('[useAdmissaoWorkflow] Carregando admissão', { admissaoId });

      const { data, error } = await supabase
        .from('admissoes')
        .select('*')
        .eq('id', admissaoId)
        .single();

      if (error) {
        logger.error('[useAdmissaoWorkflow] Erro ao carregar', { error });
        throw error;
      }

      // Carregar documentos
      const { data: docs } = await supabase
        .from('admissao_documentos')
        .select('*')
        .eq('admissao_id', admissaoId);

      // Carregar workflow
      const { data: workflow } = await supabase
        .from('admissao_workflow')
        .select('*')
        .eq('admissao_id', admissaoId)
        .order('ordem');

      return {
        ...data,
        documentos: docs || [],
        workflow: workflow || [],
      } as AdmissaoCompleta;
    },
    enabled: !!admissaoId,
  });

  // Progresso calculado
  const progresso = useMemo(() => {
    if (!admissao) return { percentual: 0, etapasFeitas: 0, total: ETAPAS_ORDEM.length - 1 };
    
    const etapasFeitas = admissao.workflow?.filter(w => w.status === 'concluido').length || 0;
    const total = ETAPAS_ORDEM.length - 1; // -1 porque 'concluido' não conta
    
    return {
      percentual: Math.round((etapasFeitas / total) * 100),
      etapasFeitas,
      total,
    };
  }, [admissao]);

  // Verificar se pode avançar
  const podeAvancar = useCallback((etapa: AdmissaoEtapa): boolean => {
    if (!admissao) return false;
    
    const config = ETAPAS_CONFIG[etapa];
    if (!config.obrigatoria) return true;

    // Verificar requisitos específicos
    switch (etapa) {
      case 'dados_pessoais':
        return !!(admissao.nome_completo && admissao.cpf && admissao.email);
      case 'documentos':
        const docsObrigatorios = admissao.documentos?.filter(d => d.obrigatorio) || [];
        return docsObrigatorios.every(d => d.status === 'aprovado');
      case 'exame_admissional':
        return admissao.workflow?.find(w => w.etapa === 'exame_admissional')?.status === 'concluido';
      case 'contrato':
        return admissao.workflow?.find(w => w.etapa === 'contrato')?.status === 'concluido';
      default:
        return true;
    }
  }, [admissao]);

  // ============================================
  // MUTATIONS
  // ============================================

  // Avançar etapa
  const avancarEtapaMutation = useMutation({
    mutationFn: async (dados?: Record<string, unknown>) => {
      if (!admissaoId) throw new Error('ID da admissão não informado');

      const indiceAtual = ETAPAS_ORDEM.indexOf(etapaAtual);
      const proximaEtapa = ETAPAS_ORDEM[indiceAtual + 1];

      if (!proximaEtapa) throw new Error('Já está na última etapa');

      logger.info('[useAdmissaoWorkflow] Avançando etapa', { 
        de: etapaAtual, 
        para: proximaEtapa 
      });

      // Marcar etapa atual como concluída
      await supabase
        .from('admissao_workflow')
        .upsert({
          admissao_id: admissaoId,
          etapa: etapaAtual,
          status: 'concluido',
          concluido_em: new Date().toISOString(),
          dados,
        });

      // Atualizar admissão
      await supabase
        .from('admissoes')
        .update({
          etapa_atual: proximaEtapa,
          status: proximaEtapa === 'concluido' ? 'concluido' : 'em_andamento',
          updated_at: new Date().toISOString(),
        })
        .eq('id', admissaoId);

      return proximaEtapa;
    },
    onSuccess: (proximaEtapa) => {
      setEtapaAtual(proximaEtapa);
      queryClient.invalidateQueries({ queryKey: ['admissao-workflow', admissaoId] });
      toast.success(`Etapa concluída! Avançando para: ${ETAPAS_CONFIG[proximaEtapa].nome}`);
    },
    onError: (error) => {
      toast.error('Erro ao avançar etapa');
      logger.error('[useAdmissaoWorkflow] Erro ao avançar', { error });
    },
  });

  // Upload de documento
  const uploadDocumentoMutation = useMutation({
    mutationFn: async ({ tipo, arquivo }: { tipo: string; arquivo: File }) => {
      if (!admissaoId) throw new Error('ID da admissão não informado');

      logger.info('[useAdmissaoWorkflow] Upload de documento', { tipo, nome: arquivo.name });

      // Upload para storage
      const fileName = `admissoes/${admissaoId}/${tipo}_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(fileName, arquivo);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('documentos')
        .getPublicUrl(fileName);

      // Salvar referência
      await supabase
        .from('admissao_documentos')
        .upsert({
          admissao_id: admissaoId,
          tipo,
          nome: arquivo.name,
          url: publicUrl,
          status: 'enviado',
          data_envio: new Date().toISOString(),
        });

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissao-workflow', admissaoId] });
      toast.success('Documento enviado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao enviar documento');
    },
  });

  // Aprovar/Rejeitar documento
  const validarDocumentoMutation = useMutation({
    mutationFn: async ({ 
      documentoId, 
      aprovado, 
      motivo 
    }: { 
      documentoId: string; 
      aprovado: boolean; 
      motivo?: string;
    }) => {
      logger.info('[useAdmissaoWorkflow] Validando documento', { documentoId, aprovado });

      await supabase
        .from('admissao_documentos')
        .update({
          status: aprovado ? 'aprovado' : 'rejeitado',
          motivo_rejeicao: motivo,
          validado_em: new Date().toISOString(),
        })
        .eq('id', documentoId);
    },
    onSuccess: (_, { aprovado }) => {
      queryClient.invalidateQueries({ queryKey: ['admissao-workflow', admissaoId] });
      toast.success(aprovado ? 'Documento aprovado!' : 'Documento rejeitado');
    },
  });

  // Cancelar admissão
  const cancelarAdmissaoMutation = useMutation({
    mutationFn: async (motivo: string) => {
      if (!admissaoId) throw new Error('ID da admissão não informado');

      logger.warn('[useAdmissaoWorkflow] Cancelando admissão', { admissaoId, motivo });

      await supabase
        .from('admissoes')
        .update({
          status: 'cancelado',
          observacoes: motivo,
          updated_at: new Date().toISOString(),
        })
        .eq('id', admissaoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissao-workflow', admissaoId] });
      toast.success('Admissão cancelada');
    },
  });

  // ============================================
  // RETURN
  // ============================================

  return {
    // Dados
    admissao,
    etapaAtual,
    progresso,
    etapasConfig: ETAPAS_CONFIG,
    etapasOrdem: ETAPAS_ORDEM,
    documentosObrigatorios: DOCUMENTOS_OBRIGATORIOS,

    // Estados
    isLoading,
    error,

    // Helpers
    podeAvancar,
    setEtapaAtual,

    // Ações
    avancarEtapa: avancarEtapaMutation.mutate,
    uploadDocumento: uploadDocumentoMutation.mutate,
    validarDocumento: validarDocumentoMutation.mutate,
    cancelarAdmissao: cancelarAdmissaoMutation.mutate,
    refetch,

    // Estados das mutations
    isAdvancing: avancarEtapaMutation.isPending,
    isUploading: uploadDocumentoMutation.isPending,
    isValidating: validarDocumentoMutation.isPending,
    isCanceling: cancelarAdmissaoMutation.isPending,
  };
}

export default useAdmissaoWorkflow;
