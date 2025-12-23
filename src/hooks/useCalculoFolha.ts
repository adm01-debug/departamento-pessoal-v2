import { useAuditoriaIntegration } from './useAuditoriaIntegration';
import { logger } from '@/lib/logger';
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import {
  calcularHolerite,
  calcularINSS,
  calcularIRRF,
  calcularFGTS,
  calcularEncargosPatronais,
  DadosColaborador,
  DadosPonto,
  DadosBeneficios,
  ProventoDesconto,
  JORNADA_MENSAL_PADRAO,
} from '@/lib/calculosTrabalhistas2025';
import { FolhaPagamento, Holerite, LancamentoFolha, StatusFolha } from '@/types/folha';
import { ColaboradorDB } from '@/types/colaborador';

// =====================================================
// TIPOS
// =====================================================

interface ColaboradorComPonto extends ColaboradorDB {
  ponto?: {
    horasExtras50: number;
    horasExtras100: number;
    horasNoturnas: number;
    diasFalta: number;
    horasAtraso: number;
    diasUteis: number;
    domingosFeriados: number;
  };
  beneficios?: {
    valorVT: number;
    valorVR: number;
    valorPlanoSaude: number;
    valorPlanoOdonto: number;
  };
  eventosVariaveis?: ProventoDesconto[];
}

interface ResumoFolha {
  totalColaboradores: number;
  totalProventos: number;
  totalDescontos: number;
  totalLiquido: number;
  totalFGTS: number;
  totalINSSPatronal: number;
  totalEncargos: number;
}

// =====================================================
// HOOK PRINCIPAL
// =====================================================

export function useCalculoFolha() {
  const [calculating, setCalculating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const auditoria = useAuditoriaIntegration('folha_calculo');

  /**
   * Busca colaboradores ativos com seus dados de ponto e benefícios
   */
  const buscarColaboradoresParaCalculo = async (competencia: string): Promise<ColaboradorComPonto[]> => {
    // 1. Buscar colaboradores ativos
    const { data: colaboradores, error: errColabs } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('status', 'ativo')
      .order('nome_completo');

    if (errColabs) throw errColabs;
    if (!colaboradores || colaboradores.length === 0) {
      throw new Error('Nenhum colaborador ativo encontrado');
    }

    // 2. Extrair ano e mês da competência
    const [ano, mes] = competencia.split('-').map(Number);
    const dataInicio = `${competencia}-01`;
    const dataFim = new Date(ano, mes, 0).toISOString().split('T')[0];

    // 3. Buscar registros de ponto do período
    const { data: registrosPonto } = await supabase
      .from('registros_ponto')
      .select('*')
      .gte('data', dataInicio)
      .lte('data', dataFim);

    // 4. Buscar eventos variáveis do período
    const { data: eventos } = await supabase
      .from('eventos_variaveis')
      .select('*, rubricas_folha(*)')
      .eq('competencia', competencia);

    // 5. Buscar benefícios dos colaboradores
    let beneficiosMap: Record<string, DadosBeneficios> = {};
    try {
      const { data: beneficios } = await supabase
        .from('beneficios_colaborador')
        .select('*, tipos_beneficio(*)');
      
      if (beneficios) {
        for (const b of beneficios) {
          const tipoNome = (b.tipos_beneficio as { nome?: string } | null)?.nome?.toLowerCase() ?? '';
          if (!beneficiosMap[b.colaborador_id]) {
            beneficiosMap[b.colaborador_id] = {
              valorVT: 0,
              valorVR: 0,
              valorPlanoSaude: 0,
              valorPlanoOdonto: 0,
            };
          }
          
          if (tipoNome.includes('transporte') || tipoNome.includes('vt')) {
            beneficiosMap[b.colaborador_id].valorVT = b.valor ?? 0;
          } else if (tipoNome.includes('refeição') || tipoNome.includes('vr') || tipoNome.includes('alimenta')) {
            beneficiosMap[b.colaborador_id].valorVR = b.valor ?? 0;
          } else if (tipoNome.includes('saúde') || tipoNome.includes('saude') || tipoNome.includes('médico')) {
            beneficiosMap[b.colaborador_id].valorPlanoSaude = b.desconto ?? 0;
          } else if (tipoNome.includes('odonto') || tipoNome.includes('dental')) {
            beneficiosMap[b.colaborador_id].valorPlanoOdonto = b.desconto ?? 0;
          }
        }
      }
    } catch {
      // Tabela não existe ainda, usar valores zerados
    }

    // 6. Processar dados por colaborador
    return colaboradores.map((colab) => {
      // Agregar ponto do colaborador
      const pontoColab = (registrosPonto ?? []).filter(p => p.colaborador_id === colab.id);
      
      let horasExtras50 = 0;
      let horasExtras100 = 0;
      let horasNoturnas = 0;
      let diasFalta = 0;
      let horasAtraso = 0;
      let diasUteis = 0;
      let domingosFeriados = 0;

      for (const reg of pontoColab) {
        // Converter interval para horas
        const parseInterval = (interval: unknown): number => {
          if (!interval || typeof interval !== 'string') return 0;
          const match = interval.match(/(\d+):(\d+):(\d+)/);
          if (match) {
            return parseInt(match[1]) + parseInt(match[2]) / 60;
          }
          return 0;
        };

        horasExtras50 += parseInterval(reg.horas_extras);
        
        if (reg.tipo_dia === 'falta') {
          diasFalta += 1;
        } else if (reg.tipo_dia === 'normal') {
          diasUteis += 1;
        } else if (reg.tipo_dia === 'feriado' || reg.tipo_dia === 'folga') {
          domingosFeriados += 1;
        }

        horasAtraso += parseInterval(reg.horas_falta);
      }

      // Eventos variáveis do colaborador
      const eventosColab = (eventos ?? [])
        .filter(e => e.colaborador_id === colab.id)
        .map(e => {
          const rubrica = e.rubricas_folha as { codigo?: string; descricao?: string; tipo?: string; incide_inss?: boolean; incide_irrf?: boolean; incide_fgts?: boolean } | null;
          return {
            codigo: rubrica?.codigo || '999',
            descricao: rubrica?.descricao || 'Evento',
            tipo: (rubrica?.tipo || 'provento') as 'provento' | 'desconto',
            referencia: e.referencia,
            valor: e.valor,
            incideINSS: rubrica?.incide_inss || false,
            incideIRRF: rubrica?.incide_irrf || false,
            incideFGTS: rubrica?.incide_fgts || false,
          };
        });

      return {
        ...colab,
        ponto: {
          horasExtras50,
          horasExtras100,
          horasNoturnas,
          diasFalta,
          horasAtraso,
          diasUteis: diasUteis || 22, // Default 22 dias úteis
          domingosFeriados: domingosFeriados || 8, // Default 8 dias
        },
        beneficios: beneficiosMap[colab.id] || {
          valorVT: 0,
          valorVR: 0,
          valorPlanoSaude: 0,
          valorPlanoOdonto: 0,
        },
        eventosVariaveis: eventosColab,
      };
    });
  };

  /**
   * Calcula a folha de pagamento completa
   */
  const calcularFolha = async (folhaId: string, competencia: string): Promise<ResumoFolha> => {
    try {
      setCalculating(true);
      setProgress(0);

      // 1. Buscar colaboradores
      toast.info('Buscando colaboradores...');
      const colaboradores = await buscarColaboradoresParaCalculo(competencia);
      setProgress(10);

      // 2. Limpar holerites anteriores
      await supabase.from('holerites').delete().eq('folha_id', folhaId);
      setProgress(20);

      // 3. Calcular cada colaborador
      const holeritesParaInserir: {
        folha_id: string;
        colaborador_id: string;
        colaborador_nome: string;
        colaborador_cpf: string;
        colaborador_cargo: string;
        colaborador_departamento: string;
        colaborador_matricula: string | null;
        salario_base: number;
        total_proventos: number;
        total_descontos: number;
        liquido: number;
        base_inss: number;
        base_irrf: number;
        base_fgts: number;
        valor_inss: number;
        valor_irrf: number;
        valor_fgts: number;
        dependentes_irrf: number;
        faltas_dias: number;
        horas_extras_50: number;
        horas_extras_100: number;
      }[] = [];

      let resumo: ResumoFolha = {
        totalColaboradores: 0,
        totalProventos: 0,
        totalDescontos: 0,
        totalLiquido: 0,
        totalFGTS: 0,
        totalINSSPatronal: 0,
        totalEncargos: 0,
      };

      const totalColabs = colaboradores.length;
      const jornadaMensalPadrao = (colab: ColaboradorComPonto) => {
        // Calcular jornada mensal a partir da jornada semanal
        return colab.jornada_semanal ? (colab.jornada_semanal / 6) * 30 : JORNADA_MENSAL_PADRAO;
      };
      
      for (let i = 0; i < totalColabs; i++) {
        const colab = colaboradores[i];
        
        // Preparar dados para o cálculo
        const dadosColab: DadosColaborador = {
          id: colab.id,
          nome: colab.nome_completo,
          cpf: colab.cpf,
          cargo: colab.cargo,
          departamento: colab.departamento,
          matricula: colab.matricula,
          salarioBase: colab.salario_base,
          dependentesIRRF: 0, // Buscar da tabela de dependentes se necessário
          jornadaMensal: jornadaMensalPadrao(colab),
        };

        const dadosPonto: DadosPonto = colab.ponto || {
          horasExtras50: 0,
          horasExtras100: 0,
          horasNoturnas: 0,
          diasFalta: 0,
          horasAtraso: 0,
          diasUteis: 22,
          domingosFeriados: 8,
        };

        const dadosBeneficios: DadosBeneficios = {
          ...(colab.beneficios || {
            valorVT: 0,
            valorVR: 0,
            valorPlanoSaude: 0,
            valorPlanoOdonto: 0,
          }),
          outrosDescontos: [],
        };

        // Calcular holerite
        const resultado = calcularHolerite(
          dadosColab,
          dadosPonto,
          dadosBeneficios,
          colab.eventosVariaveis ?? []
        );

        // Calcular encargos patronais
        const encargos = calcularEncargosPatronais(resultado.baseFGTS);

        // Montar holerite
        holeritesParaInserir.push({
          folha_id: folhaId,
          colaborador_id: colab.id,
          colaborador_nome: colab.nome_completo,
          colaborador_cpf: colab.cpf,
          colaborador_cargo: colab.cargo,
          colaborador_departamento: colab.departamento,
          colaborador_matricula: colab.matricula || null,
          salario_base: colab.salario_base,
          total_proventos: resultado.totalProventos,
          total_descontos: resultado.totalDescontos,
          liquido: resultado.liquido,
          base_inss: resultado.baseINSS,
          base_irrf: resultado.baseIRRF,
          base_fgts: resultado.baseFGTS,
          valor_inss: resultado.valorINSS,
          valor_irrf: resultado.valorIRRF,
          valor_fgts: resultado.valorFGTS,
          dependentes_irrf: dadosColab.dependentesIRRF,
          faltas_dias: dadosPonto.diasFalta,
          horas_extras_50: dadosPonto.horasExtras50,
          horas_extras_100: dadosPonto.horasExtras100,
        });

        // Acumular resumo
        resumo.totalColaboradores += 1;
        resumo.totalProventos += resultado.totalProventos;
        resumo.totalDescontos += resultado.totalDescontos;
        resumo.totalLiquido += resultado.liquido;
        resumo.totalFGTS += resultado.valorFGTS;
        resumo.totalINSSPatronal += encargos.inssPatronal;
        resumo.totalEncargos += encargos.total;

        // Atualizar progresso
        setProgress(20 + Math.round((i / totalColabs) * 60));
      }

      setProgress(80);

      // 4. Inserir holerites
      toast.info('Salvando holerites...');
      const { error: errHolerites } = await supabase
        .from('holerites')
        .insert(holeritesParaInserir);

      if (errHolerites) throw errHolerites;
      setProgress(90);
      
      // ✅ AUDITORIA
      await auditoria.registrarCriacao(folhaId, { tipo: 'calculo_holerites', quantidade: holeritesParaInserir.length, competencia });

      // 5. Atualizar folha com totais
      const { error: errFolha } = await supabase
        .from('folhas_pagamento')
        .update({
          status: 'calculada' as StatusFolha,
          data_calculo: new Date().toISOString(),
          total_proventos: Math.round(resumo.totalProventos * 100) / 100,
          total_descontos: Math.round(resumo.totalDescontos * 100) / 100,
          total_liquido: Math.round(resumo.totalLiquido * 100) / 100,
          total_fgts: Math.round(resumo.totalFGTS * 100) / 100,
          total_inss_patronal: Math.round(resumo.totalINSSPatronal * 100) / 100,
          total_colaboradores: resumo.totalColaboradores,
        })
        .eq('id', folhaId);

      if (errFolha) throw errFolha;
      setProgress(100);

      // ✅ AUDITORIA
      await auditoria.registrarAlteracao(folhaId, {}, { status: 'calculada', totais: resumo });
      toast.success(`Folha calculada! ${resumo.totalColaboradores} colaboradores processados.`);
      return resumo;

    } catch (error: unknown) {
      logger.error('Erro ao calcular folha:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao calcular folha: ' + message);
      throw error;
    } finally {
      setCalculating(false);
      setProgress(0);
    }
  };

  /**
   * Recalcula um holerite específico
   */
  const recalcularHolerite = async (holeriteId: string): Promise<void> => {
    try {
      setCalculating(true);

      // Buscar holerite atual
      const { data: holerite, error: errHolerite } = await supabase
        .from('holerites')
        .select('*, folhas_pagamento(*)')
        .eq('id', holeriteId)
        .single();

      if (errHolerite || !holerite) throw new Error('Holerite não encontrado');

      // Buscar colaborador
      const { data: colab, error: errColab } = await supabase
        .from('colaboradores')
        .select('*')
        .eq('id', holerite.colaborador_id)
        .single();

      if (errColab || !colab) throw new Error('Colaborador não encontrado');

      const jornadaMensal = colab.jornada_semanal ? (colab.jornada_semanal / 6) * 30 : JORNADA_MENSAL_PADRAO;

      // Preparar dados
      const dadosColab: DadosColaborador = {
        id: colab.id,
        nome: colab.nome_completo,
        cpf: colab.cpf,
        cargo: colab.cargo,
        departamento: colab.departamento,
        matricula: colab.matricula,
        salarioBase: colab.salario_base,
        dependentesIRRF: holerite.dependentes_irrf ?? 0,
        jornadaMensal,
      };

      const dadosPonto: DadosPonto = {
        horasExtras50: holerite.horas_extras_50 ?? 0,
        horasExtras100: holerite.horas_extras_100 ?? 0,
        horasNoturnas: 0,
        diasFalta: holerite.faltas_dias ?? 0,
        horasAtraso: 0,
        diasUteis: 22,
        domingosFeriados: 8,
      };

      const dadosBeneficios: DadosBeneficios = {
        valorVT: 0,
        valorVR: 0,
        valorPlanoSaude: 0,
        valorPlanoOdonto: 0,
        outrosDescontos: [],
      };

      // Recalcular
      const resultado = calcularHolerite(dadosColab, dadosPonto, dadosBeneficios);

      // Atualizar holerite
      const { error: errUpdate } = await supabase
        .from('holerites')
        .update({
          total_proventos: resultado.totalProventos,
          total_descontos: resultado.totalDescontos,
          liquido: resultado.liquido,
          base_inss: resultado.baseINSS,
          base_irrf: resultado.baseIRRF,
          base_fgts: resultado.baseFGTS,
          valor_inss: resultado.valorINSS,
          valor_irrf: resultado.valorIRRF,
          valor_fgts: resultado.valorFGTS,
        })
        .eq('id', holeriteId);

      if (errUpdate) throw errUpdate;

      toast.success('Holerite recalculado com sucesso!');

    } catch (error: unknown) {
      logger.error('Erro ao recalcular holerite:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro: ' + message);
      throw error;
    } finally {
      setCalculating(false);
    }
  };

  /**
   * Simula cálculo de um colaborador (sem salvar)
   */
  const simularCalculo = (
    salarioBase: number,
    horasExtras50: number = 0,
    horasExtras100: number = 0,
    diasFalta: number = 0,
    dependentes: number = 0
  ) => {
    const dadosColab: DadosColaborador = {
      id: 'simulacao',
      nome: 'Simulação',
      cpf: '000.000.000-00',
      cargo: 'Cargo',
      departamento: 'Departamento',
      salarioBase,
      dependentesIRRF: dependentes,
      jornadaMensal: JORNADA_MENSAL_PADRAO,
    };

    const dadosPonto: DadosPonto = {
      horasExtras50,
      horasExtras100,
      horasNoturnas: 0,
      diasFalta,
      horasAtraso: 0,
      diasUteis: 22,
      domingosFeriados: 8,
    };

    const dadosBeneficios: DadosBeneficios = {
      valorVT: 0,
      valorVR: 0,
      valorPlanoSaude: 0,
      valorPlanoOdonto: 0,
      outrosDescontos: [],
    };

    return calcularHolerite(dadosColab, dadosPonto, dadosBeneficios);
  };

  return {
    calcularFolha,
    recalcularHolerite,
    simularCalculo,
    calculating,
    progress,
  };
}

// =====================================================
// HOOKS AUXILIARES
// =====================================================

/**
 * Hook para gerenciar eventos variáveis
 */
export function useEventosVariaveis(competencia: string) {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const auditoria = useAuditoriaIntegration('folha_calculo');

  const fetchEventos = useCallback(async () => {
    if (!competencia) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('eventos_variaveis')
        .select('*, rubricas_folha(*), colaboradores(nome_completo)')
        .eq('competencia', competencia)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEventos(data ?? []);
    } catch (err) {
      logger.error('Erro ao buscar eventos:', err);
    } finally {
      setLoading(false);
    }
  }, [competencia]);

  const addEvento = async (evento: {
    colaborador_id: string;
    rubrica_id: string;
    referencia?: number;
    valor: number;
    observacao?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('eventos_variaveis')
        .insert({
          ...evento,
          competencia,
          created_by: user?.id,
        })
        .select('*, rubricas_folha(*), colaboradores(nome_completo)')
        .single();

      if (error) throw error;
      setEventos(prev => [data, ...prev]);
      toast.success('Evento adicionado!');
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro: ' + message);
      throw err;
    }
  };

  const removeEvento = async (eventoId: string) => {
    try {
      const { error } = await supabase
        .from('eventos_variaveis')
        .delete()
        .eq('id', eventoId);

      if (error) throw error;
      setEventos(prev => prev.filter(e => e.id !== eventoId));
      toast.success('Evento removido!');
      await auditoria.registrarExclusao('registro', {});
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro: ' + message);
      throw err;
    }
  };

  return { eventos, loading, fetchEventos, addEvento, removeEvento };
}



