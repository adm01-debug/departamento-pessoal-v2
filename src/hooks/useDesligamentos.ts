/**
 * @fileoverview Hook para gerenciamento de desligamentos
 * @module hooks/useDesligamentos
 */
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { useEmpresas } from './useEmpresas';

export type TipoDesligamento = 
  | 'sem_justa_causa'
  | 'justa_causa'
  | 'pedido_demissao'
  | 'acordo'
  | 'fim_contrato'
  | 'falecimento';

export interface Desligamento {
  id: string;
  colaborador_id: string;
  tipo: TipoDesligamento;
  data_desligamento: string;
  data_aviso?: string;
  motivo?: string;
  status: string;
  salario_base: number;
  saldo_salario: number;
  aviso_previo: number;
  ferias_vencidas: number;
  ferias_proporcionais: number;
  terco_constitucional: number;
  decimo_terceiro: number;
  multa_fgts: number;
  total_proventos: number;
  total_descontos: number;
  valor_liquido: number;
  empresa_id?: string;
  checklist_comunicacao: boolean;
  checklist_documentacao: boolean;
  checklist_calculo_rescisao: boolean;
  checklist_homologacao: boolean;
  checklist_revogacao_acessos: boolean;
  checklist_devolucao_equipamentos: boolean;
  checklist_esocial: boolean;
  checklist_pagamento: boolean;
  created_at: string;
  updated_at: string;
}

export interface DesligamentoInsert {
  colaborador_id: string;
  tipo: TipoDesligamento;
  data_desligamento: string;
  data_aviso?: string;
  motivo?: string;
  salario_base: number;
  saldo_salario: number;
  aviso_previo: number;
  ferias_vencidas: number;
  ferias_proporcionais: number;
  terco_constitucional: number;
  decimo_terceiro: number;
  multa_fgts: number;
  total_proventos: number;
  total_descontos: number;
  valor_liquido: number;
  empresa_id?: string;
}

export interface CalculoRescisao {
  saldoSalario: number;
  avisoPrevio: number;
  feriasVencidas: number;
  feriasProporcionais: number;
  tercoConstitucional: number;
  decimoTerceiro: number;
  multaFgts: number;
  totalProventos: number;
  inss: number;
  irrf: number;
  totalDescontos: number;
  valorLiquido: number;
}

const tipoLabels: Record<TipoDesligamento, string> = {
  sem_justa_causa: 'Dispensa sem Justa Causa',
  justa_causa: 'Dispensa por Justa Causa',
  pedido_demissao: 'Pedido de Demissão',
  acordo: 'Acordo Mútuo (Art. 484-A)',
  fim_contrato: 'Fim de Contrato',
  falecimento: 'Falecimento',
};


export interface UseDesligamentosReturn {
  desligamentos: Desligamento[];
  loading: boolean;
  error: string | null;
  fetchDesligamentos: () => Promise<void>;
  createDesligamento: (data: DesligamentoInsert) => Promise<Desligamento | null>;
  updateDesligamento: (id: string, data: Partial<DesligamentoInsert>) => Promise<boolean>;
  deleteDesligamento: (id: string) => Promise<boolean>;
  updateChecklist: (id: string, field: string, value: boolean) => Promise<boolean>;
  concluirDesligamento: (id: string) => Promise<boolean>;
  calcularRescisao: (salario: number, dataAdmissao: Date, dataDesligamento: Date, tipo: TipoDesligamento, avisoPrevioTrabalhado: boolean) => CalculoRescisao;
  tipoLabels: Record<TipoDesligamento, string>;
}

export function useDesligamentos(): UseDesligamentosReturn {
  const [desligamentos, setDesligamentos] = useState<Desligamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { empresaAtualId } = useEmpresas();

  const fetchDesligamentos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('desligamentos')
        .select('id, colaborador_id, data_desligamento, motivo, tipo, status')
        .order('created_at', { ascending: false });

      if (empresaAtualId) {
        query = query.eq('empresa_id', empresaAtualId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDesligamentos((data ?? []) as Desligamento[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      logger.error('Erro ao buscar desligamentos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesligamentos();
  }, [empresaAtualId]);

  const calcularRescisao = (
    salario: number,
    dataAdmissao: Date,
    dataDesligamento: Date,
    tipo: TipoDesligamento,
    avisoPrevioTrabalhado: boolean
  ): CalculoRescisao => {
    const diasTrabalhados = differenceInDays(dataDesligamento, new Date(dataDesligamento.getFullYear(), dataDesligamento.getMonth(), 1)) + 1;
    const mesesTrabalhados = differenceInMonths(dataDesligamento, dataAdmissao);
    const mesesAno = dataDesligamento.getMonth() + 1;

    // Saldo de salário
    const saldoSalario = (salario / 30) * diasTrabalhados;

    // Aviso prévio (30 dias + 3 dias por ano de serviço, máx 90 dias)
    const anosServico = Math.floor(mesesTrabalhados / 12);
    const diasAvisoPrevio = Math.min(30 + (anosServico * 3), 90);
    let avisoPrevio = 0;
    if (tipo === 'sem_justa_causa') {
      avisoPrevio = avisoPrevioTrabalhado ? 0 : (salario / 30) * diasAvisoPrevio;
    } else if (tipo === 'acordo') {
      avisoPrevio = avisoPrevioTrabalhado ? 0 : ((salario / 30) * diasAvisoPrevio) / 2;
    }

    // Férias vencidas
    const feriasVencidas = mesesTrabalhados >= 12 ? salario : 0;

    // Férias proporcionais
    const mesesFerias = mesesTrabalhados % 12;
    const feriasProporcionais = tipo === 'justa_causa' ? 0 : (salario / 12) * mesesFerias;

    // 1/3 constitucional
    const tercoConstitucional = (feriasVencidas + feriasProporcionais) / 3;

    // 13º proporcional
    const decimoTerceiro = tipo === 'justa_causa' ? 0 : (salario / 12) * mesesAno;

    // Multa FGTS
    const baseFgts = salario * mesesTrabalhados * 0.08;
    let multaFgts = 0;
    if (tipo === 'sem_justa_causa') {
      multaFgts = baseFgts * 0.4;
    } else if (tipo === 'acordo') {
      multaFgts = baseFgts * 0.2;
    }

    const totalProventos = saldoSalario + avisoPrevio + feriasVencidas + feriasProporcionais + tercoConstitucional + decimoTerceiro + multaFgts;

    // Descontos INSS
    const baseInss = saldoSalario;
    let inss = 0;
    if (baseInss <= 1412) inss = baseInss * 0.075;
    else if (baseInss <= 2666.68) inss = baseInss * 0.09;
    else if (baseInss <= 4000.03) inss = baseInss * 0.12;
    else inss = baseInss * 0.14;
    inss = Math.min(inss, 908.85);

    // IRRF
    const baseIrrf = saldoSalario - inss;
    let irrf = 0;
    if (baseIrrf > 4664.68) irrf = (baseIrrf * 0.275) - 896.00;
    else if (baseIrrf > 3751.05) irrf = (baseIrrf * 0.225) - 662.77;
    else if (baseIrrf > 2826.65) irrf = (baseIrrf * 0.15) - 381.44;
    else if (baseIrrf > 2259.20) irrf = (baseIrrf * 0.075) - 169.44;
    irrf = Math.max(0, irrf);

    const totalDescontos = inss + irrf;
    const valorLiquido = totalProventos - totalDescontos;

    return {
      saldoSalario,
      avisoPrevio,
      feriasVencidas,
      feriasProporcionais,
      tercoConstitucional,
      decimoTerceiro,
      multaFgts,
      totalProventos,
      inss,
      irrf,
      totalDescontos,
      valorLiquido,
    };
  };

  const createDesligamento = async (data: DesligamentoInsert) => {
    try {
      const { data: newDesligamento, error } = await supabase
        .from('desligamentos')
        .insert({ ...data, empresa_id: empresaAtualId })
        .select()
        .single();

      if (error) throw error;
      setDesligamentos(prev => [newDesligamento as Desligamento, ...prev]);
      toast.success('Desligamento iniciado com sucesso!');
      return newDesligamento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao criar desligamento: ' + errorMessage);
      throw err;
    }
  };

  const updateDesligamento = async (id: string, data: Partial<Desligamento>) => {
    try {
      const { data: updated, error } = await supabase
        .from('desligamentos')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDesligamentos(prev => prev.map(d => d.id === id ? updated as Desligamento : d));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao atualizar desligamento: ' + errorMessage);
      throw err;
    }
  };

  const deleteDesligamento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('desligamentos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDesligamentos(prev => prev.filter(d => d.id !== id));
      toast.success('Desligamento removido!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao remover desligamento: ' + errorMessage);
      throw err;
    }
  };

  const updateChecklist = async (id: string, field: string, value: boolean) => {
    await updateDesligamento(id, { [field]: value });
  };

  const concluirDesligamento = async (id: string) => {
    await updateDesligamento(id, { status: 'concluido' });
    toast.success('Desligamento concluído!');
  };

  return {
    desligamentos,
    loading,
    error,
    fetchDesligamentos,
    createDesligamento,
    updateDesligamento,
    deleteDesligamento,
    updateChecklist,
    concluirDesligamento,
    calcularRescisao,
    tipoLabels,
  };
}
