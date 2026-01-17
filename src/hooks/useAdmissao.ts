// V18: useAdmissao Hook - Formatado e Documentado
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissaoService } from '@/services';
import { useToast } from './useToast';

export type StatusAdmissao = 
  | 'rascunho' 
  | 'documentos_pendentes' 
  | 'aguardando_aprovacao' 
  | 'aprovada' 
  | 'concluida' 
  | 'cancelada';

export interface Admissao {
  id: string;
  empresa_id: string;
  nome: string;
  cpf: string;
  email?: string;
  cargo_id?: string;
  cargo_nome?: string;
  departamento_id?: string;
  departamento_nome?: string;
  data_admissao: string;
  salario: number;
  tipo_contrato: string;
  status: StatusAdmissao;
  documentos?: string[];
  progresso: number;
  created_at: string;
}

export interface AdmissaoFilters {
  status?: StatusAdmissao;
  data_inicio?: string;
  data_fim?: string;
}

/**
 * Hook para listar admissões
 */
export function useAdmissoes(filtros?: AdmissaoFilters) {
  return useQuery<Admissao[]>({
    queryKey: ['admissoes', filtros],
    queryFn: async () => {
      return admissaoService.getAll();
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para detalhes de uma admissão
 */
export function useAdmissao(id: string) {
  return useQuery<Admissao>({
    queryKey: ['admissao', id],
    queryFn: async () => {
      return admissaoService.getById(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook para criar admissão
 */
export function useCreateAdmissao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<Admissao>) => {
      return admissaoService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissoes'] });
      toast({ title: 'Admissão iniciada com sucesso!' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao criar admissão', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
}

/**
 * Hook para atualizar admissão
 */
export function useUpdateAdmissao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Admissao> & { id: string }) => {
      return admissaoService.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissoes'] });
      queryClient.invalidateQueries({ queryKey: ['admissao'] });
      toast({ title: 'Admissão atualizada!' });
    },
  });
}

/**
 * Hook para concluir admissão
 */
export function useConcluirAdmissao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return admissaoService.concluir(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissoes'] });
      queryClient.invalidateQueries({ queryKey: ['colaboradores'] });
      toast({ title: 'Admissão concluída! Colaborador criado.' });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao concluir admissão', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
}

/**
 * Hook para cancelar admissão
 */
export function useCancelarAdmissao() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return admissaoService.cancelar(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissoes'] });
      toast({ title: 'Admissão cancelada' });
    },
  });
}

export default useAdmissoes;
