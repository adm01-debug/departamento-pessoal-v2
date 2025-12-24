import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';
import { 
  FolhaPagamento, 
  Holerite, 
  LancamentoFolha, 
  RubricaFolha, 
  EventoVariavel,
  StatusFolha 
} from '@/types/folha';
import { ColaboradorDB } from '@/types/colaborador';
import { calcularINSS, calcularIRRF, calcularFGTS, calcularINSSPatronal } from '@/lib/calculosTrabalhistas';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './useAuth';
import { useEmpresas } from './useEmpresas';


export interface UseFolhasPagamentoReturn {
  folhas: FolhaPagamento[];
  loading: boolean;
  fetchFolhas: () => Promise<void>;
  createFolha: (competencia: string) => Promise<FolhaPagamento | null>;
  updateFolhaStatus: (id: string, status: StatusFolha) => Promise<boolean>;
  deleteFolha: (id: string) => Promise<boolean>;
}

export function useFolhasPagamento(): UseFolhasPagamentoReturn {
  const [folhas, setFolhas] = useState<FolhaPagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { empresaAtualId } = useEmpresas();

  const fetchFolhas = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('folhas_pagamento')
        .select('*')
        .order('competencia', { ascending: false });

      if (empresaAtualId) {
        query = query.eq('empresa_id', empresaAtualId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFolhas((data || []) as FolhaPagamento[]);
    } catch (err: unknown) {
      logger.error('Erro ao buscar folhas:', err);
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [empresaAtualId]);

  useEffect(() => {
    if (user) fetchFolhas();
  }, [user, fetchFolhas]);

  const createFolha = async (competencia: string, tipo: string = 'mensal') => {
    try {
      const { data, error } = await supabase
        .from('folhas_pagamento')
        .insert([{ competencia, tipo, created_by: user?.id, empresa_id: empresaAtualId }])
        .select()
        .single();

      if (error) throw error;
      setFolhas(prev => [data as FolhaPagamento, ...prev]);
      toast({ title: 'Folha criada!', description: `Competência ${competencia}` });
      return data as FolhaPagamento;
    } catch (err: unknown) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  const updateFolhaStatus = async (id: string, status: StatusFolha) => {
    try {
      const updateData: unknown = { status };
      if (status === 'calculada') updateData.data_calculo = new Date().toISOString();
      if (status === 'fechada') updateData.data_fechamento = new Date().toISOString();

      const { data, error } = await supabase
        .from('folhas_pagamento')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setFolhas(prev => prev.map(f => f.id === id ? data as FolhaPagamento : f));
      return data as FolhaPagamento;
    } catch (err: unknown) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  const deleteFolha = async (id: string) => {
    try {
      const { error } = await supabase
        .from('folhas_pagamento')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFolhas(prev => prev.filter(f => f.id !== id));
      toast({ title: 'Folha excluída!' });
    } catch (err: unknown) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  return { folhas, loading, fetchFolhas, createFolha, updateFolhaStatus, deleteFolha };
}

export function useRubricas() {
  const [rubricas, setRubricas] = useState<RubricaFolha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await supabase
          .from('rubricas_folha')
          .select('*')
          .eq('ativo', true)
          .order('codigo');

        if (error) throw error;
        setRubricas((data || []) as RubricaFolha[]);
      } catch (err: unknown) {
        logger.error('Erro ao buscar rubricas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { rubricas, loading };
}

export function useHolerites(folhaId: string) {
  const [holerites, setHolerites] = useState<Holerite[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHolerites = useCallback(async () => {
    if (!folhaId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('holerites')
        .select('*')
        .eq('folha_id', folhaId)
        .order('colaborador_nome');

      if (error) throw error;
      setHolerites((data || []) as Holerite[]);
    } catch (err: unknown) {
      logger.error('Erro ao buscar holerites:', err);
    } finally {
      setLoading(false);
    }
  }, [folhaId]);

  useEffect(() => {
    fetchHolerites();
  }, [fetchHolerites]);

  return { holerites, loading, fetchHolerites };
}

export function useLancamentos(holeriteId: string) {
  const [lancamentos, setLancamentos] = useState<LancamentoFolha[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLancamentos = useCallback(async () => {
    if (!holeriteId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lancamentos_folha')
        .select('*')
        .eq('holerite_id', holeriteId)
        .order('rubrica_codigo');

      if (error) throw error;
      setLancamentos((data || []) as LancamentoFolha[]);
    } catch (err: unknown) {
      logger.error('Erro ao buscar lançamentos:', err);
    } finally {
      setLoading(false);
    }
  }, [holeriteId]);

  useEffect(() => {
    fetchLancamentos();
  }, [fetchLancamentos]);

  return { lancamentos, loading, fetchLancamentos };
}

export function useEventosVariaveis(competencia: string) {
  const [eventos, setEventos] = useState<EventoVariavel[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchEventos = useCallback(async () => {
    if (!competencia) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('eventos_variaveis')
        .select('*, rubrica:rubricas_folha(*)')
        .eq('competencia', competencia);

      if (error) throw error;
      setEventos((data || []) as EventoVariavel[]);
    } catch (err: unknown) {
      logger.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  }, [competencia]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const addEvento = async (evento: Omit<EventoVariavel, 'id' | 'created_at' | 'rubrica'>) => {
    try {
      const { data, error } = await supabase
        .from('eventos_variaveis')
        .insert([{ ...evento, created_by: user?.id }])
        .select('*, rubrica:rubricas_folha(*)')
        .single();

      if (error) throw error;
      setEventos(prev => [...prev, data as EventoVariavel]);
      toast({ title: 'Evento adicionado!' });
      return data;
    } catch (err: unknown) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  const removeEvento = async (id: string) => {
    try {
      const { error } = await supabase
        .from('eventos_variaveis')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEventos(prev => prev.filter(e => e.id !== id));
      toast({ title: 'Evento removido!' });
    } catch (err: unknown) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
      throw err;
    }
  };

  return { eventos, loading, fetchEventos, addEvento, removeEvento };
}

// Hook para calcular a folha
export function useCalculoFolha() {
  const [calculating, setCalculating] = useState(false);
  const { user } = useAuth();
  const { empresaAtualId } = useEmpresas();

  const calcularFolha = async (folhaId: string, competencia: string) => {
    setCalculating(true);
    try {
      // 1. Buscar colaboradores ativos (filtrado por empresa)
      let queryColaboradores = supabase
        .from('colaboradores')
        .select('*')
        .eq('status', 'ativo');
      
      if (empresaAtualId) {
        queryColaboradores = queryColaboradores.eq('empresa_id', empresaAtualId);
      }

      const { data: colaboradores, error: colabError } = await queryColaboradores;

      if (colabError) throw colabError;
      if (!colaboradores || colaboradores.length === 0) {
        throw new Error('Nenhum colaborador ativo encontrado');
      }

      // 2. Buscar rubricas
      const { data: rubricas, error: rubError } = await supabase
        .from('rubricas_folha')
        .select('*')
        .eq('ativo', true);

      if (rubError) throw rubError;

      // 3. Buscar eventos variáveis da competência
      const { data: eventosVariaveis, error: evError } = await supabase
        .from('eventos_variaveis')
        .select('*')
        .eq('competencia', competencia);

      if (evError) throw evError;

      // 4. Limpar holerites anteriores
      await supabase
        .from('holerites')
        .delete()
        .eq('folha_id', folhaId);

      // Rubricas por código para fácil acesso
      const rubricasPorCodigo = new Map(rubricas?.map(r => [r.codigo, r]));
      const rubricaSalario = rubricasPorCodigo.get('001');
      const rubricaINSS = rubricasPorCodigo.get('050');
      const rubricaIRRF = rubricasPorCodigo.get('051');
      const rubricaBaseINSS = rubricasPorCodigo.get('090');
      const rubricaBaseIRRF = rubricasPorCodigo.get('091');
      const rubricaBaseFGTS = rubricasPorCodigo.get('092');
      const rubricaFGTS = rubricasPorCodigo.get('093');

      let totalProventos = 0;
      let totalDescontos = 0;
      let totalLiquido = 0;
      let totalFGTS = 0;
      let totalINSSPatronal = 0;

      // 5. Calcular para cada colaborador
      for (const colab of colaboradores as ColaboradorDB[]) {
        const salarioBase = colab.salario_base;
        
        // Eventos variáveis do colaborador
        const eventosColab = eventosVariaveis?.filter(e => e.colaborador_id === colab.id) || [];
        
        // Calcular proventos
        let baseINSS = salarioBase;
        let baseIRRF = salarioBase;
        let baseFGTS = salarioBase;
        let proventos = salarioBase;
        let descontos = 0;
        
        const lancamentos: unknown[] = [];
        
        // Adicionar salário base
        if (rubricaSalario) {
          lancamentos.push({
            rubrica_id: rubricaSalario.id,
            rubrica_codigo: '001',
            rubrica_descricao: 'Salário Base',
            tipo: 'provento',
            referencia: 30,
            valor: salarioBase,
            automatico: true,
          });
        }

        // Adicionar eventos variáveis
        for (const evento of eventosColab) {
          const rubrica = rubricas?.find(r => r.id === evento.rubrica_id);
          if (!rubrica) continue;

          lancamentos.push({
            rubrica_id: rubrica.id,
            rubrica_codigo: rubrica.codigo,
            rubrica_descricao: rubrica.descricao,
            tipo: rubrica.tipo,
            referencia: evento.referencia,
            valor: evento.valor,
            automatico: false,
          });

          if (rubrica.tipo === 'provento') {
            proventos += evento.valor;
            if (rubrica.incide_inss) baseINSS += evento.valor;
            if (rubrica.incide_irrf) baseIRRF += evento.valor;
            if (rubrica.incide_fgts) baseFGTS += evento.valor;
          } else if (rubrica.tipo === 'desconto') {
            descontos += evento.valor;
          }
        }

        // Calcular INSS
        const inss = calcularINSS(baseINSS);
        descontos += inss.valorINSS;

        // Calcular IRRF
        // Buscar quantidade de dependentes do colaborador
      const { data: dependentes } = await supabase
        .from('dependentes')
        .select('id')
        .eq('colaborador_id', colaborador.id);
      
      const qtdDependentes = dependentes?.length || 0;
      const irrf = calcularIRRF(baseIRRF, inss.valorINSS, qtdDependentes);
        descontos += irrf.valorIRRF;

        // Calcular FGTS
        const fgts = calcularFGTS(baseFGTS);

        // Calcular INSS Patronal
        const inssPatronal = calcularINSSPatronal(baseFGTS);

        // Líquido
        const liquido = proventos - descontos;

        // Adicionar lançamentos automáticos
        if (rubricaINSS) {
          lancamentos.push({
            rubrica_id: rubricaINSS.id,
            rubrica_codigo: '050',
            rubrica_descricao: 'INSS',
            tipo: 'desconto',
            referencia: inss.aliquotaEfetiva,
            valor: inss.valorINSS,
            automatico: true,
          });
        }

        if (rubricaIRRF && irrf.valorIRRF > 0) {
          lancamentos.push({
            rubrica_id: rubricaIRRF.id,
            rubrica_codigo: '051',
            rubrica_descricao: 'IRRF',
            tipo: 'desconto',
            referencia: irrf.aliquota,
            valor: irrf.valorIRRF,
            automatico: true,
          });
        }

        // Bases informativas
        if (rubricaBaseINSS) {
          lancamentos.push({
            rubrica_id: rubricaBaseINSS.id,
            rubrica_codigo: '090',
            rubrica_descricao: 'Base INSS',
            tipo: 'informativo',
            valor: baseINSS,
            automatico: true,
          });
        }

        if (rubricaBaseIRRF) {
          lancamentos.push({
            rubrica_id: rubricaBaseIRRF.id,
            rubrica_codigo: '091',
            rubrica_descricao: 'Base IRRF',
            tipo: 'informativo',
            valor: irrf.baseCalculo,
            automatico: true,
          });
        }

        if (rubricaBaseFGTS) {
          lancamentos.push({
            rubrica_id: rubricaBaseFGTS.id,
            rubrica_codigo: '092',
            rubrica_descricao: 'Base FGTS',
            tipo: 'informativo',
            valor: baseFGTS,
            automatico: true,
          });
        }

        if (rubricaFGTS) {
          lancamentos.push({
            rubrica_id: rubricaFGTS.id,
            rubrica_codigo: '093',
            rubrica_descricao: 'FGTS do Mês',
            tipo: 'informativo',
            valor: fgts,
            automatico: true,
          });
        }

        // 6. Criar holerite
        const { data: holerite, error: holError } = await supabase
          .from('holerites')
          .insert([{
            folha_id: folhaId,
            colaborador_id: colab.id,
            colaborador_nome: colab.nome_completo,
            colaborador_cpf: colab.cpf,
            colaborador_cargo: colab.cargo,
            colaborador_departamento: colab.departamento,
            colaborador_matricula: colab.matricula,
            salario_base: salarioBase,
            total_proventos: proventos,
            total_descontos: descontos,
            liquido: liquido,
            base_inss: baseINSS,
            base_irrf: irrf.baseCalculo,
            base_fgts: baseFGTS,
            valor_inss: inss.valorINSS,
            valor_irrf: irrf.valorIRRF,
            valor_fgts: fgts,
            dependentes_irrf: 0,
          }])
          .select()
          .single();

        if (holError) throw holError;

        // 7. Criar lançamentos
        const lancamentosParaInserir = lancamentos.map(l => ({
          ...l,
          holerite_id: holerite.id,
        }));

        const { error: lancError } = await supabase
          .from('lancamentos_folha')
          .insert(lancamentosParaInserir);

        if (lancError) throw lancError;

        // Acumular totais
        totalProventos += proventos;
        totalDescontos += descontos;
        totalLiquido += liquido;
        totalFGTS += fgts;
        totalINSSPatronal += inssPatronal;
      }

      // 8. Atualizar totais da folha
      const { error: updateError } = await supabase
        .from('folhas_pagamento')
        .update({
          status: 'calculada',
          data_calculo: new Date().toISOString(),
          total_colaboradores: colaboradores.length,
          total_proventos: totalProventos,
          total_descontos: totalDescontos,
          total_liquido: totalLiquido,
          total_fgts: totalFGTS,
          total_inss_patronal: totalINSSPatronal,
        })
        .eq('id', folhaId);

      if (updateError) throw updateError;

      toast({ title: 'Folha calculada!', description: `${colaboradores.length} holerites gerados.` });
      return true;
    } catch (err: unknown) {
      logger.error('Erro ao calcular folha:', err);
      toast({ title: 'Erro no cálculo', description: err.message, variant: 'destructive' });
      throw err;
    } finally {
      setCalculating(false);
    }
  };

  return { calcularFolha, calculating };
}





