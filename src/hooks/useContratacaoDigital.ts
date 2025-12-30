import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuditoriaIntegration } from './useAuditoriaIntegration';

export interface AdmissaoToken {
  id: string;
  admissao_id: string;
  token: string;
  email_candidato: string | null;
  telefone_candidato: string | null;
  data_expiracao: string;
  dados_preenchidos: boolean;
  documentos_enviados: boolean;
  contrato_gerado: boolean;
  contrato_assinado: boolean;
  created_at: string;
}


export interface UseContratacaoDigitalReturn {
  tokens: AdmissaoToken[];
  isLoading: boolean;

  criarToken: (
    vars: { admissaoId: string; email?: string; telefone?: string },
    options?: { onSuccess?: () => void; onError?: () => void }
  ) => void;

  reenviarToken: (
    admissaoId: string,
    options?: { onSuccess?: () => void; onError?: () => void }
  ) => void;

  getTokenByAdmissao: (admissaoId: string) => Promise<AdmissaoToken | null>;
  getDocumentosAdmissao: (admissaoId: string) => Promise<Array<{ tipo: string; url: string; status: string }>>;

  validarDocumento: (
    vars: { documentoId: string; validado: boolean; observacoes?: string },
    options?: { onSuccess?: () => void; onError?: () => void }
  ) => void;

  gerarLinkContratacao: (token: string) => string;
  copiarLink: (token: string) => Promise<string>;

  isCriando: boolean;
  isReenviando: boolean;
}

export function useContratacaoDigital(): UseContratacaoDigitalReturn {
  const queryClient = useQueryClient();

  // Buscar todos os tokens de admissão
  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['admissao-tokens'],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admissao_tokens')
        .select(`
          *,
          admissoes (id, nome, cargo, departamento, email, telefone)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Criar token para admissão
  const criarToken = useMutation({
    mutationFn: async ({ 
      admissaoId, 
      email, 
      telefone 
    }: { 
      admissaoId: string; 
      email?: string; 
      telefone?: string;
    }) => {
      const { data, error } = await supabase
        .from('admissao_tokens')
        .insert({
          admissao_id: admissaoId,
          email_candidato: email,
          telefone_candidato: telefone,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Link de contratação digital criado!');
      queryClient.invalidateQueries({ queryKey: ['admissao-tokens'] });
    },
    onError: () => {
      toast.error('Erro ao criar link');
    },
  });

  // Reenviar token (criar novo token para mesma admissão)
  const reenviarToken = useMutation({
    mutationFn: async (admissaoId: string) => {
      // Invalidar tokens antigos (opcional - poderia manter)
      // const { error: updateError } = await supabase
      //   .from('admissao_tokens')
      //   .update({ data_expiracao: new Date().toISOString() })
      //   .eq('admissao_id', admissaoId);
      
      const { data, error } = await supabase
        .from('admissao_tokens')
        .insert({
          admissao_id: admissaoId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Novo link criado!');
      queryClient.invalidateQueries({ queryKey: ['admissao-tokens'] });
    },
    onError: () => {
      toast.error('Erro ao criar novo link');
    },
  });

  // Buscar token por admissão
  const getTokenByAdmissao = async (admissaoId: string) => {
    const { data, error } = await supabase
      .from('admissao_tokens')
      .select('*')
      .eq('admissao_id', admissaoId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  };

  // Buscar documentos de uma admissão
  const getDocumentosAdmissao = async (admissaoId: string) => {
    const { data, error } = await supabase
      .from('documentos_admissao')
      .select('*')
      .eq('admissao_id', admissaoId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  };

  // Validar documento
  const validarDocumento = useMutation({
    mutationFn: async ({ 
      documentoId, 
      validado,
      observacoes 
    }: { 
      documentoId: string; 
      validado: boolean;
      observacoes?: string;
    }) => {
      const { error } = await supabase
        .from('documentos_admissao')
        .update({
          validado,
          validado_em: new Date().toISOString(),
          observacoes,
        })
        .eq('id', documentoId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Documento atualizado!');
      queryClient.invalidateQueries({ queryKey: ['admissao-tokens'] });
    },
    onError: () => {
      toast.error('Erro ao atualizar documento');
    },
  });

  // Gerar URL completa do link
  const gerarLinkContratacao = (token: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/contratacao?token=${token}`;
  };

  // Copiar link para área de transferência
  const copiarLink = async (token: string) => {
    const link = gerarLinkContratacao(token);
    await navigator.clipboard.writeText(link);
    toast.success('Link copiado!');
    return link;
  };

  return {
    tokens,
    isLoading,
    criarToken: criarToken.mutate,
    reenviarToken: reenviarToken.mutate,
    getTokenByAdmissao,
    getDocumentosAdmissao,
    validarDocumento: validarDocumento.mutate,
    gerarLinkContratacao,
    copiarLink,
    isCriando: criarToken.isPending,
    isReenviando: reenviarToken.isPending,
  };
}





