import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useColaboradores } from './useColaboradores';
import { useEmpresas } from './useEmpresas';

export type EtapaAdmissao = 
  | 'solicitacao'
  | 'documentos'
  | 'validacao'
  | 'pendente'
  | 'exame'
  | 'contrato'
  | 'assinatura'
  | 'esocial';

// Etapa final que indica admissão concluída
const ETAPA_CONCLUIDA = 'esocial';

export interface Admissao {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  salario_proposto: number;
  data_prevista: string;
  etapa: EtapaAdmissao;
  observacoes?: string;
  cpf?: string;
  data_nascimento?: string;
  sexo?: string;
  email?: string;
  telefone?: string;
  estado_civil?: string;
  nome_mae?: string;
  empresa_id?: string;
  created_at: string;
  updated_at: string;
  checklist_documentos_pessoais: boolean;
  checklist_comprovante_endereco: boolean;
  checklist_foto: boolean;
  checklist_ctps: boolean;
  checklist_exame_admissional: boolean;
  checklist_contrato_assinado: boolean;
  checklist_esocial_enviado: boolean;
}

export interface AdmissaoInsert {
  nome: string;
  cargo: string;
  departamento: string;
  salario_proposto: number;
  data_prevista: string;
  observacoes?: string;
  cpf?: string;
  data_nascimento?: string;
  sexo?: string;
  email?: string;
  telefone?: string;
  estado_civil?: string;
  nome_mae?: string;
  empresa_id?: string;
}

const etapaLabels: Record<EtapaAdmissao, string> = {
  solicitacao: 'Solicitação Recebida',
  documentos: 'Coleta de Documentos',
  validacao: 'Validação',
  pendente: 'Pendente',
  exame: 'Exame Admissional',
  contrato: 'Contrato',
  assinatura: 'Assinatura',
  esocial: 'eSocial',
};

const etapaOrder: EtapaAdmissao[] = [
  'solicitacao',
  'documentos',
  'validacao',
  'pendente',
  'exame',
  'contrato',
  'assinatura',
  'esocial',
];

export function useAdmissoes() {
  const [admissoes, setAdmissoes] = useState<Admissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { createColaborador } = useColaboradores();
  const { empresaAtualId } = useEmpresas();

  const fetchAdmissoes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('admissoes')
        .select('id, nome, cpf, cargo, departamento, data_admissao, status')
        .order('created_at', { ascending: false });

      if (empresaAtualId) {
        query = query.eq('empresa_id', empresaAtualId);
      }

      const { data, error: err } = await query;

      if (err) throw err;
      setAdmissoes((data ?? []) as Admissao[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      logger.error('Erro ao buscar admissões:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissoes();
  }, [empresaAtualId]);

  const createAdmissao = async (data: AdmissaoInsert) => {
    try {
      const { data: newAdmissao, error: err } = await supabase
        .from('admissoes')
        .insert({ ...data, empresa_id: empresaAtualId })
        .select()
        .single();

      if (err) throw err;
      setAdmissoes(prev => [newAdmissao as Admissao, ...prev]);
      toast.success('Admissão criada com sucesso!');
      return newAdmissao;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao criar admissão: ' + errorMessage);
      throw err;
    }
  };

  const updateAdmissao = async (id: string, data: Partial<Admissao>) => {
    try {
      const { data: updated, error: err } = await supabase
        .from('admissoes')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (err) throw err;
      setAdmissoes(prev => prev.map(a => a.id === id ? updated as Admissao : a));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao atualizar admissão: ' + errorMessage);
      throw err;
    }
  };

  const deleteAdmissao = async (id: string) => {
    try {
      const { error: err } = await supabase
        .from('admissoes')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setAdmissoes(prev => prev.filter(a => a.id !== id));
      toast.success('Admissão removida!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao remover admissão: ' + errorMessage);
      throw err;
    }
  };

  const advanceStage = async (admissao: Admissao) => {
    const currentIndex = etapaOrder.indexOf(admissao.etapa);
    if (currentIndex < etapaOrder.length - 1) {
      const nextEtapa = etapaOrder[currentIndex + 1];
      await updateAdmissao(admissao.id, { etapa: nextEtapa });
      toast.success(`Avançado para: ${etapaLabels[nextEtapa]}`);
      return nextEtapa;
    }
    return admissao.etapa;
  };

  // Converter admissão concluída em colaborador
  const converterParaColaborador = async (admissao: Admissao) => {
    try {
      // Validar campos obrigatórios
      const camposFaltantes: string[] = [];
      if (!admissao.cpf) camposFaltantes.push('CPF');
      if (!admissao.data_nascimento) camposFaltantes.push('Data de Nascimento');
      if (!admissao.sexo) camposFaltantes.push('Sexo');
      if (!admissao.nome_mae) camposFaltantes.push('Nome da Mãe');
      
      if (camposFaltantes.length > 0) {
        toast.error(`Preencha os dados obrigatórios: ${camposFaltantes.join(', ')}`);
        throw new Error('Dados incompletos para conversão');
      }

      // Criar o colaborador com os dados da admissão
      const novoColaborador = await createColaborador({
        nome_completo: admissao.nome,
        cargo: admissao.cargo,
        departamento: admissao.departamento,
        salario_base: admissao.salario_proposto,
        data_admissao: admissao.data_prevista,
        data_nascimento: admissao.data_nascimento,
        sexo: admissao.sexo as 'masculino' | 'feminino',
        estado_civil: (admissao.estado_civil || 'solteiro') as any,
        cpf: admissao.cpf,
        nome_mae: admissao.nome_mae,
        email: admissao.email,
        celular: admissao.telefone,
        tipo_contrato: 'clt' as const,
        status: 'ativo' as const,
      });

      // Remover a admissão da lista
      await deleteAdmissao(admissao.id);
      
      toast.success(`${admissao.nome} foi adicionado como colaborador!`);
      return novoColaborador;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      if (errorMessage !== 'Dados incompletos para conversão') {
        toast.error('Erro ao converter admissão: ' + errorMessage);
      }
      throw err;
    }
  };

  const updateChecklist = async (id: string, field: string, value: boolean) => {
    await updateAdmissao(id, { [field]: value });
  };

  const getProgress = (admissao: Admissao) => {
    const currentIndex = etapaOrder.indexOf(admissao.etapa);
    return Math.round(((currentIndex + 1) / etapaOrder.length) * 100);
  };

  return {
    admissoes,
    loading,
    error,
    fetchAdmissoes,
    createAdmissao,
    updateAdmissao,
    deleteAdmissao,
    advanceStage,
    updateChecklist,
    getProgress,
    converterParaColaborador,
    etapaLabels,
    etapaOrder,
    ETAPA_CONCLUIDA,
  };
}





