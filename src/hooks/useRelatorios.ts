// @ts-nocheck
/**
 * @fileoverview Hook para geração de relatórios
 * @module hooks/useRelatorios
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { exportToExcel, exportToPDF, exportToCSV, formatters, ExportColumn } from '@/lib/exportUtils';


// Validação de parâmetros para prevenir injection
const validateYear = (year: number | undefined): number => {
  const currentYear = new Date().getFullYear();
  if (year === undefined) return currentYear;
  if (typeof year !== 'number' || isNaN(year)) return currentYear;
  if (year < 1900 || year > currentYear + 10) return currentYear;
  return Math.floor(year);
};

const validateDateString = (dateStr: string): string => {
  // Aceita apenas formato YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    throw new Error('Invalid date format');
  }
  return dateStr;
};

import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type FormatoRelatorio = 'PDF' | 'Excel' | 'CSV';

export interface FiltroRelatorio {
  dataInicio?: string;
  dataFim?: string;
  departamento?: string;
  status?: string;
  colaboradorId?: string;
  competencia?: string;
}


export interface UseRelatoriosReturn {
  gerando: boolean;
  gerarListaColaboradores: (filtros?: { departamento?: string; status?: string }) => Promise<void>;
  gerarAniversariantes: (mes?: number) => Promise<void>;
  gerarPorDepartamento: () => Promise<void>;
  gerarFichaRegistro: (colaboradorId: string) => Promise<void>;
  gerarResumoFolha: (competencia: string) => Promise<void>;
  gerarEncargos: (competencia: string) => Promise<void>;
  gerarProgramacaoFerias: (ano?: number) => Promise<void>;
  gerarFeriasVencer: () => Promise<void>;
  gerarAfastamentosPorTipo: (periodo?: { inicio: string; fim: string }) => Promise<void>;
  gerarAbsenteismo: (periodo?: { inicio: string; fim: string }) => Promise<void>;
  gerarTurnover: (ano?: number) => Promise<void>;
  gerarDesligamentosPorMotivo: (periodo?: { inicio: string; fim: string }) => Promise<void>;
  gerarEspelhoPonto: (colaboradorId: string, mes: string) => Promise<void>;
  gerarBancoHoras: () => Promise<void>;
  gerarIndicadoresDP: () => Promise<void>;
}

export function useRelatorios(): UseRelatoriosReturn {
  const [gerando, setGerando] = useState(false);

  // Helper para gerar relatórios
  const gerarRelatorio = async (
    nome: string,
    columns: ExportColumn[],
    data: Record<string, unknown>[],
    formato: FormatoRelatorio,
    titulo: string,
    subtitulo?: string
  ) => {
    const options = {
      filename: nome.toLowerCase().replace(/\s+/g, '_'),
      title: titulo,
      subtitle: subtitulo,
      columns,
      data
    };

    switch (formato) {
      case 'PDF':
        exportToPDF(options);
        break;
      case 'Excel':
        exportToExcel(options);
        break;
      case 'CSV':
        exportToCSV(options);
        break;
    }

    toast.success(`Relatório ${titulo} gerado com sucesso!`);
  };

  // ==================== RELATÓRIOS DE CADASTRO ====================

  const gerarListaColaboradores = async (formato: FormatoRelatorio, filtro?: FiltroRelatorio) => {
    setGerando(true);
    try {
      let query = supabase.from('colaboradores').select('id, tipo, nome, parametros, created_at');
      
      if (filtro?.departamento) query = query.eq('departamento', filtro.departamento);
      if (filtro?.status) query = query.eq('status', filtro.status as unknown);
      
      const { data, error } = await query.order('nome_completo');
      if (error) throw error;

      const columns: ExportColumn[] = [
        { key: 'matricula', header: 'Matrícula', width: 12 },
        { key: 'nome_completo', header: 'Nome', width: 30 },
        { key: 'cpf', header: 'CPF', width: 15, format: formatters.cpf },
        { key: 'cargo', header: 'Cargo', width: 20 },
        { key: 'departamento', header: 'Departamento', width: 15 },
        { key: 'data_admissao', header: 'Admissão', width: 12, format: formatters.date },
        { key: 'salario_base', header: 'Salário', width: 12, format: formatters.currency },
        { key: 'status', header: 'Status', width: 10, format: formatters.status },
      ];

      await gerarRelatorio(
        'lista_colaboradores',
        columns,
        data ?? [],
        formato,
        'Lista de Colaboradores',
        `Total: ${data?.length ?? 0} colaboradores`
      );
    } finally {
      setGerando(false);
    }
  };

  const gerarAniversariantes = async (formato: FormatoRelatorio, mes?: number) => {
    setGerando(true);
    try {
      const mesAtual = mes || new Date().getMonth() + 1;
      const { data, error } = await supabase
        .from('colaboradores')
        .select('id, tipo, nome, parametros, created_at')
        .eq('status', 'ativo');
      
      if (error) throw error;

      // Filtrar por mês de aniversário
      const aniversariantes = (data ?? []).filter(c => {
        if (!c.data_nascimento) return false;
        const mesNasc = new Date(c.data_nascimento).getMonth() + 1;
        return mesNasc === mesAtual;
      }).sort((a, b) => {
        const diaA = new Date(a.data_nascimento!).getDate();
        const diaB = new Date(b.data_nascimento!).getDate();
        return diaA - diaB;
      });

      const columns: ExportColumn[] = [
        { key: 'nome_completo', header: 'Nome', width: 30 },
        { key: 'data_nascimento', header: 'Data Nasc.', width: 12, format: formatters.date },
        { key: 'departamento', header: 'Departamento', width: 15 },
        { key: 'cargo', header: 'Cargo', width: 20 },
        { key: 'email', header: 'E-mail', width: 25 },
      ];

      const nomeMes = format(new Date(2024, mesAtual - 1, 1), 'MMMM', { locale: ptBR });

      await gerarRelatorio(
        'aniversariantes',
        columns,
        aniversariantes,
        formato,
        `Aniversariantes de ${nomeMes}`,
        `Total: ${aniversariantes.length} colaboradores`
      );
    } finally {
      setGerando(false);
    }
  };

  const gerarPorDepartamento = async (formato: FormatoRelatorio) => {
    setGerando(true);
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('departamento, status, salario_base')
        .eq('status', 'ativo');
      
      if (error) throw error;

      // Agrupar por departamento
      const agrupado = (data ?? []).reduce((acc, c) => {
        if (!acc[c.departamento]) {
          acc[c.departamento] = { total: 0, salarioTotal: 0 };
        }
        acc[c.departamento].total++;
        acc[c.departamento].salarioTotal += c.salario_base;
        return acc;
      }, {} as Record<string, { total: number; salarioTotal: number }>);

      const resultado = Object.entries(agrupado).map(([dept, info]) => ({
        departamento: dept,
        total_colaboradores: info.total,
        salario_medio: info.salarioTotal / info.total,
        custo_total: info.salarioTotal,
      }));

      const columns: ExportColumn[] = [
        { key: 'departamento', header: 'Departamento', width: 20 },
        { key: 'total_colaboradores', header: 'Colaboradores', width: 15 },
        { key: 'salario_medio', header: 'Salário Médio', width: 15, format: formatters.currency },
        { key: 'custo_total', header: 'Custo Total', width: 15, format: formatters.currency },
      ];

      await gerarRelatorio(
        'colaboradores_departamento',
        columns,
        resultado,
        formato,
        'Colaboradores por Departamento',
        `Total de departamentos: ${resultado.length}`
      );
    } finally {
      setGerando(false);
    }
  };

  const gerarFichaRegistro = async (colaboradorId: string, formato: FormatoRelatorio) => {
    setGerando(true);
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('id, tipo, nome, parametros, created_at')
        .eq('id', colaboradorId)
        .single();
      
      if (error) throw error;

      const fichaData = [
        { campo: 'Nome Completo', valor: data.nome_completo },
        { campo: 'CPF', valor: formatters.cpf(data.cpf) },
        { campo: 'RG', valor: data.rg || '-' },
        { campo: 'Data de Nascimento', valor: formatters.date(data.data_nascimento) },
        { campo: 'Sexo', valor: data.sexo === 'masculino' ? 'Masculino' : 'Feminino' },
        { campo: 'Estado Civil', valor: data.estado_civil },
        { campo: 'Nome da Mãe', valor: data.nome_mae },
        { campo: 'Nome do Pai', valor: data.nome_pai || '-' },
        { campo: 'Endereço', valor: `${data.logradouro ?? ''}, ${data.numero ?? ''} - ${data.bairro ?? ''}, ${data.cidade ?? ''}/${data.uf ?? ''}` },
        { campo: 'CEP', valor: data.cep || '-' },
        { campo: 'Telefone', valor: data.telefone || '-' },
        { campo: 'Celular', valor: data.celular || '-' },
        { campo: 'E-mail', valor: data.email || '-' },
        { campo: 'PIS/PASEP', valor: data.pis_pasep || '-' },
        { campo: 'CTPS', valor: data.ctps_numero ? `${data.ctps_numero}/${data.ctps_serie}` : '-' },
        { campo: 'Cargo', valor: data.cargo },
        { campo: 'Departamento', valor: data.departamento },
        { campo: 'Data de Admissão', valor: formatters.date(data.data_admissao) },
        { campo: 'Salário Base', valor: formatters.currency(data.salario_base) },
        { campo: 'Tipo de Contrato', valor: data.tipo_contrato?.toUpperCase() },
        { campo: 'Banco', valor: data.banco_nome || '-' },
        { campo: 'Agência/Conta', valor: data.agencia ? `${data.agencia} / ${data.conta}` : '-' },
      ];

      const columns: ExportColumn[] = [
        { key: 'campo', header: 'Campo', width: 25 },
        { key: 'valor', header: 'Informação', width: 50 },
      ];

      await gerarRelatorio(
        `ficha_registro_${data.nome_completo.replace(/\s+/g, '_')}`,
        columns,
        fichaData,
        formato,
        'Ficha de Registro',
        data.nome_completo
      );
    } finally {
      setGerando(false);
    }
  };

  // ==================== RELATÓRIOS DE FOLHA ====================

  const gerarResumoFolha = async (competencia: string, formato: FormatoRelatorio) => {
    setGerando(true);
    try {
      const { data: folha, error: folhaError } = await supabase
        .from('folhas_pagamento')
        .select('id, tipo, nome, parametros, created_at')
        .eq('competencia', competencia)
        .single();
      
      if (folhaError && folhaError.code !== 'PGRST116') throw folhaError;

      if (!folha) {
        toast.error('Nenhuma folha encontrada para esta competência');
        return;
      }

      const { data: holerites, error: holError } = await supabase
        .from('holerites')
        .select('id, tipo, nome, parametros, created_at')
        .eq('folha_id', folha.id);
      
      if (holError) throw holError;

      const columns: ExportColumn[] = [
        { key: 'colaborador_nome', header: 'Colaborador', width: 25 },
        { key: 'colaborador_departamento', header: 'Departamento', width: 15 },
        { key: 'salario_base', header: 'Salário Base', width: 12, format: formatters.currency },
        { key: 'total_proventos', header: 'Proventos', width: 12, format: formatters.currency },
        { key: 'total_descontos', header: 'Descontos', width: 12, format: formatters.currency },
        { key: 'liquido', header: 'Líquido', width: 12, format: formatters.currency },
        { key: 'valor_inss', header: 'INSS', width: 10, format: formatters.currency },
        { key: 'valor_irrf', header: 'IRRF', width: 10, format: formatters.currency },
        { key: 'valor_fgts', header: 'FGTS', width: 10, format: formatters.currency },
      ];

      await gerarRelatorio(
        `resumo_folha_${competencia}`,
        columns,
        holerites ?? [],
        formato,
        `Resumo da Folha - ${competencia}`,
        `Total Líquido: ${formatters.currency(folha.total_liquido)}`
      );
    } finally {
      setGerando(false);
    }
  };

  const gerarEncargos = async (competencia: string, formato: FormatoRelatorio) => {
    setGerando(true);
    try {
      const { data: folha, error } = await supabase
        .from('folhas_pagamento')
        .select('id, tipo, nome, parametros, created_at')
        .eq('competencia', competencia)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;

      if (!folha) {
        toast.error('Nenhuma folha encontrada');
        return;
      }

      const encargosData = [
        { descricao: 'INSS Colaborador', valor: folha.total_descontos * 0.3 },
        { descricao: 'INSS Patronal', valor: folha.total_inss_patronal },
        { descricao: 'FGTS', valor: folha.total_fgts },
        { descricao: 'Total Encargos', valor: (folha.total_inss_patronal ?? 0) + (folha.total_fgts ?? 0) },
      ];

      const columns: ExportColumn[] = [
        { key: 'descricao', header: 'Descrição', width: 30 },
        { key: 'valor', header: 'Valor', width: 20, format: formatters.currency },
      ];

      await gerarRelatorio(
        `encargos_${competencia}`,
        columns,
        encargosData,
        formato,
        `Encargos Sociais - ${competencia}`,
        `Competência: ${competencia}`
      );
    } finally {
      setGerando(false);
    }
  };

  // ==================== RELATÓRIOS DE FÉRIAS ====================

  const gerarProgramacaoFerias = async (ano: number, formato: FormatoRelatorio) => {
    setGerando(true);
    try {
      const { data, error } = await supabase
        .from('ferias')
        .select('*, colaboradores(nome_completo, cargo, departamento)')
        .gte('data_inicio', validateDateString(`${validateYear(ano)}-01-01`))
        .lte('data_inicio', validateDateString(`${validateYear(ano)}-12-31`))
        .order('data_inicio');
      
      if (error) throw error;

      const resultado = (data ?? []).map((f: unknown) => ({
        colaborador: f.colaboradores?.nome_completo,
        departamento: f.colaboradores?.departamento,
        data_inicio: f.data_inicio,
        data_fim: f.data_fim,
        dias_gozo: f.dias_gozo,
        dias_abono: f.dias_abono,
        status: f.status,
        valor_liquido: f.valor_liquido,
      }));

      const columns: ExportColumn[] = [
        { key: 'colaborador', header: 'Colaborador', width: 25 },
        { key: 'departamento', header: 'Departamento', width: 15 },
        { key: 'data_inicio', header: 'Início', width: 12, format: formatters.date },
        { key: 'data_fim', header: 'Fim', width: 12, format: formatters.date },
        { key: 'dias_gozo', header: 'Dias', width: 8 },
        { key: 'dias_abono', header: 'Abono', width: 8 },
        { key: 'status', header: 'Status', width: 12 },
        { key: 'valor_liquido', header: 'Valor', width: 12, format: formatters.currency },
      ];

      await gerarRelatorio(
        `programacao_ferias_${ano}`,
        columns,
        resultado,
        formato,
        `Programação de Férias - ${ano}`,
        `Total: ${resultado.length} férias programadas`
      );
    } finally {
      setGerando(false);
    }
  };

  const gerarFeriasVencer = async (formato: FormatoRelatorio) => {
    setGerando(true);
    try {
      const { data, error } = await supabase
        .from('periodos_aquisitivos')
        .select('*, colaboradores(nome_completo, cargo, departamento, data_admissao)')
        .eq('status', 'adquirido')
        .order('data_fim');
      
      if (error) throw error;

      const hoje = new Date();
      const resultado = (data ?? []).map((p: unknown) => {
        const dataLimite = new Date(p.data_fim);
        dataLimite.setFullYear(dataLimite.getFullYear() + 1);
        const diasRestantes = differenceInDays(dataLimite, hoje);
        
        return {
          colaborador: p.colaboradores?.nome_completo,
          departamento: p.colaboradores?.departamento,
          periodo: `${p.numero_periodo}º`,
          periodo_inicio: p.data_inicio,
          periodo_fim: p.data_fim,
          dias_direito: p.dias_direito,
          data_limite: format(dataLimite, 'yyyy-MM-dd'),
          dias_restantes: diasRestantes,
          situacao: diasRestantes < 0 ? 'VENCIDO' : diasRestantes < 30 ? 'URGENTE' : 'OK',
        };
      }).filter((p: unknown) => p.dias_restantes < 90);

      const columns: ExportColumn[] = [
        { key: 'colaborador', header: 'Colaborador', width: 25 },
        { key: 'departamento', header: 'Departamento', width: 15 },
        { key: 'periodo', header: 'Período', width: 8 },
        { key: 'periodo_fim', header: 'Aquisição', width: 12, format: formatters.date },
        { key: 'dias_direito', header: 'Dias', width: 8 },
        { key: 'data_limite', header: 'Limite', width: 12, format: formatters.date },
        { key: 'dias_restantes', header: 'Dias Rest.', width: 10 },
        { key: 'situacao', header: 'Situação', width: 10 },
      ];

      await gerarRelatorio(
        'ferias_vencer',
        columns,
        resultado,
        formato,
        'Férias a Vencer',
        `${resultado.length} colaboradores com férias próximas do vencimento`
      );
    } finally {
      setGerando(false);
    }
  };

  // ==================== RELATÓRIOS DE AFASTAMENTOS ====================

  const gerarAfastamentosPorTipo = async (formato: FormatoRelatorio, filtro?: FiltroRelatorio) => {
    setGerando(true);
    try {
      let query = supabase
        .from('afastamentos')
        .select('*, colaboradores(nome_completo, departamento)');
      
      if (filtro?.dataInicio) query = query.gte('data_inicio', filtro.dataInicio);
      if (filtro?.dataFim) query = query.lte('data_inicio', filtro.dataFim);
      
      const { data, error } = await query.order('tipo');
      if (error) throw error;

      const resultado = (data ?? []).map((a: unknown) => ({
        colaborador: a.colaboradores?.nome_completo,
        departamento: a.colaboradores?.departamento,
        tipo: a.tipo.replace(/_/g, ' ').toUpperCase(),
        data_inicio: a.data_inicio,
        data_fim: a.data_fim_real || a.data_fim_prevista,
        dias_empresa: a.dias_empresa,
        dias_inss: a.dias_inss,
        status: a.status,
        cid: a.cid || '-',
      }));

      const columns: ExportColumn[] = [
        { key: 'colaborador', header: 'Colaborador', width: 25 },
        { key: 'tipo', header: 'Tipo', width: 20 },
        { key: 'data_inicio', header: 'Início', width: 12, format: formatters.date },
        { key: 'data_fim', header: 'Fim', width: 12, format: formatters.date },
        { key: 'dias_empresa', header: 'Dias Emp.', width: 10 },
        { key: 'dias_inss', header: 'Dias INSS', width: 10 },
        { key: 'status', header: 'Status', width: 12 },
        { key: 'cid', header: 'CID', width: 8 },
      ];

      await gerarRelatorio(
        'afastamentos_tipo',
        columns,
        resultado,
        formato,
        'Afastamentos por Tipo',
        `Total: ${resultado.length} afastamentos`
      );
    } finally {
      setGerando(false);
    }
  };

  const gerarAbsenteismo = async (formato: FormatoRelatorio, competencia?: string) => {
    setGerando(true);
    try {
      const comp = competencia || format(new Date(), 'yyyy-MM');
      const dataInicio = `${comp}-01`;
      const dataFim = format(endOfMonth(parseISO(dataInicio)), 'yyyy-MM-dd');

      const { data: colaboradores } = await supabase
        .from('colaboradores')
        .select('id, nome_completo, departamento')
        .eq('status', 'ativo');

      const { data: afastamentos } = await supabase
        .from('afastamentos')
        .select('colaborador_id, dias_total')
        .gte('data_inicio', dataInicio)
        .lte('data_inicio', dataFim);

      // Calcular absenteísmo por departamento
      const porDept = (colaboradores ?? []).reduce((acc, c) => {
        if (!acc[c.departamento]) {
          acc[c.departamento] = { total: 0, diasPerdidos: 0 };
        }
        acc[c.departamento].total++;
        
        const afastColab = (afastamentos ?? []).filter((a: unknown) => a.colaborador_id === c.id);
        afastColab.forEach((a: unknown) => {
          acc[c.departamento].diasPerdidos += a.dias_total ?? 0;
        });
        
        return acc;
      }, {} as Record<string, { total: number; diasPerdidos: number }>);

      const diasUteisMes = 22;
      const resultado = Object.entries(porDept).map(([dept, info]) => ({
        departamento: dept,
        colaboradores: info.total,
        dias_perdidos: info.diasPerdidos,
        dias_esperados: info.total * diasUteisMes,
        taxa_absenteismo: ((info.diasPerdidos / (info.total * diasUteisMes)) * 100).toFixed(2) + '%',
      }));

      const columns: ExportColumn[] = [
        { key: 'departamento', header: 'Departamento', width: 20 },
        { key: 'colaboradores', header: 'Colaboradores', width: 15 },
        { key: 'dias_perdidos', header: 'Dias Perdidos', width: 15 },
        { key: 'dias_esperados', header: 'Dias Esperados', width: 15 },
        { key: 'taxa_absenteismo', header: 'Taxa Absenteísmo', width: 15 },
      ];

      await gerarRelatorio(
        `absenteismo_${comp}`,
        columns,
        resultado,
        formato,
        `Taxa de Absenteísmo - ${comp}`,
        'Por departamento'
      );
    } finally {
      setGerando(false);
    }
  };

  // ==================== RELATÓRIOS DE DESLIGAMENTOS ====================

  const gerarTurnover = async (formato: FormatoRelatorio, ano?: number) => {
    setGerando(true);
    try {
      const anoAtual = validateYear(ano);
      
      const { data: admissoes } = await supabase
        .from('colaboradores')
        .select('data_admissao')
        .gte('data_admissao', validateDateString(`${anoAtual}-01-01`))
        .lte('data_admissao', validateDateString(`${anoAtual}-12-31`));

      const { data: desligamentos } = await supabase
        .from('desligamentos')
        .select('data_desligamento, tipo')
        .gte('data_desligamento', validateDateString(`${anoAtual}-01-01`))
        .lte('data_desligamento', validateDateString(`${anoAtual}-12-31`));

      const { data: ativos } = await supabase
        .from('colaboradores')
        .select('id')
        .eq('status', 'ativo');

      const totalAtivos = ativos?.length || 1;
      const totalAdmissoes = admissoes?.length ?? 0;
      const totalDesligamentos = desligamentos?.length ?? 0;
      const turnover = ((totalAdmissoes + totalDesligamentos) / 2 / totalAtivos * 100);

      const resultado = [
        { indicador: 'Total de Colaboradores Ativos', valor: totalAtivos },
        { indicador: 'Admissões no Ano', valor: totalAdmissoes },
        { indicador: 'Desligamentos no Ano', valor: totalDesligamentos },
        { indicador: 'Taxa de Turnover', valor: turnover.toFixed(2) + '%' },
      ];

      const columns: ExportColumn[] = [
        { key: 'indicador', header: 'Indicador', width: 35 },
        { key: 'valor', header: 'Valor', width: 20 },
      ];

      await gerarRelatorio(
        `turnover_${anoAtual}`,
        columns,
        resultado,
        formato,
        `Indicadores de Turnover - ${anoAtual}`,
        'Análise anual'
      );
    } finally {
      setGerando(false);
    }
  };

  const gerarDesligamentosPorMotivo = async (formato: FormatoRelatorio, filtro?: FiltroRelatorio) => {
    setGerando(true);
    try {
      let query = supabase
        .from('desligamentos')
        .select('*, colaboradores(nome_completo, departamento, cargo)');
      
      if (filtro?.dataInicio) query = query.gte('data_desligamento', filtro.dataInicio);
      if (filtro?.dataFim) query = query.lte('data_desligamento', filtro.dataFim);
      
      const { data, error } = await query.order('data_desligamento', { ascending: false });
      if (error) throw error;

      const tipoLabels: Record<string, string> = {
        sem_justa_causa: 'Dispensa sem Justa Causa',
        justa_causa: 'Dispensa por Justa Causa',
        pedido_demissao: 'Pedido de Demissão',
        acordo: 'Acordo Mútuo',
        fim_contrato: 'Fim de Contrato',
        falecimento: 'Falecimento',
      };

      const resultado = (data ?? []).map((d: unknown) => ({
        colaborador: d.colaboradores?.nome_completo,
        departamento: d.colaboradores?.departamento,
        cargo: d.colaboradores?.cargo,
        tipo: tipoLabels[d.tipo] || d.tipo,
        data_desligamento: d.data_desligamento,
        valor_rescisao: d.valor_liquido,
        status: d.status === 'concluido' ? 'Concluído' : 'Em Andamento',
      }));

      const columns: ExportColumn[] = [
        { key: 'colaborador', header: 'Colaborador', width: 25 },
        { key: 'departamento', header: 'Departamento', width: 15 },
        { key: 'tipo', header: 'Motivo', width: 22 },
        { key: 'data_desligamento', header: 'Data', width: 12, format: formatters.date },
        { key: 'valor_rescisao', header: 'Rescisão', width: 12, format: formatters.currency },
        { key: 'status', header: 'Status', width: 12 },
      ];

      await gerarRelatorio(
        'desligamentos_motivo',
        columns,
        resultado,
        formato,
        'Desligamentos por Motivo',
        `Total: ${resultado.length} desligamentos`
      );
    } finally {
      setGerando(false);
    }
  };

  // ==================== RELATÓRIOS DE PONTO ====================

  const gerarEspelhoPonto = async (
    colaboradorId: string,
    colaboradorNome: string,
    competencia: string,
    formato: FormatoRelatorio
  ) => {
    setGerando(true);
    try {
      const [ano, mes] = competencia.split('-').map(Number);
      const dataInicio = `${competencia}-01`;
      const ultimoDia = new Date(ano, mes, 0).getDate();
      const dataFim = `${competencia}-${ultimoDia}`;

      const { data, error } = await supabase
        .from('registros_ponto')
        .select('id, tipo, nome, parametros, created_at')
        .eq('colaborador_id', colaboradorId)
        .gte('data', dataInicio)
        .lte('data', dataFim)
        .order('data');
      
      if (error) throw error;

      const resultado = (data ?? []).map((r: unknown) => ({
        data: r.data,
        tipo: r.tipo_dia,
        entrada_1: r.entrada_1 || '-',
        saida_1: r.saida_1 || '-',
        entrada_2: r.entrada_2 || '-',
        saida_2: r.saida_2 || '-',
        horas_trab: r.horas_trabalhadas?.substring(0, 5) || '-',
        extras: r.horas_extras?.substring(0, 5) || '-',
        falta: r.horas_falta?.substring(0, 5) || '-',
      }));

      const columns: ExportColumn[] = [
        { key: 'data', header: 'Data', width: 12, format: formatters.date },
        { key: 'tipo', header: 'Tipo', width: 10 },
        { key: 'entrada_1', header: 'Ent. 1', width: 8 },
        { key: 'saida_1', header: 'Saí. 1', width: 8 },
        { key: 'entrada_2', header: 'Ent. 2', width: 8 },
        { key: 'saida_2', header: 'Saí. 2', width: 8 },
        { key: 'horas_trab', header: 'Trabalhadas', width: 12 },
        { key: 'extras', header: 'Extras', width: 10 },
        { key: 'falta', header: 'Falta', width: 10 },
      ];

      await gerarRelatorio(
        `espelho_ponto_${colaboradorNome.replace(/\s+/g, '_')}_${competencia}`,
        columns,
        resultado,
        formato,
        `Espelho de Ponto - ${competencia}`,
        colaboradorNome
      );
    } finally {
      setGerando(false);
    }
  };

  const gerarBancoHoras = async (formato: FormatoRelatorio, departamento?: string) => {
    setGerando(true);
    try {
      let query = supabase
        .from('colaboradores')
        .select('id, nome_completo, departamento')
        .eq('status', 'ativo');
      
      if (departamento) query = query.eq('departamento', departamento);
      
      const { data: colaboradores, error } = await query;
      if (error) throw error;

      const resultado: unknown[] = [];
      
      for (const colab of colaboradores ?? []) {
        const { data: banco } = await supabase
          .from('banco_horas')
          .select('saldo_atual')
          .eq('colaborador_id', colab.id)
          .order('data', { ascending: false })
          .limit(1);
        
        resultado.push({
          colaborador: colab.nome_completo,
          departamento: colab.departamento,
          saldo_atual: banco?.[0]?.saldo_atual || '00:00:00',
        });
      }

      const columns: ExportColumn[] = [
        { key: 'colaborador', header: 'Colaborador', width: 30 },
        { key: 'departamento', header: 'Departamento', width: 20 },
        { key: 'saldo_atual', header: 'Saldo Atual', width: 15 },
      ];

      await gerarRelatorio(
        'banco_horas',
        columns,
        resultado,
        formato,
        'Banco de Horas',
        `${resultado.length} colaboradores`
      );
    } finally {
      setGerando(false);
    }
  };

  // ==================== INDICADORES ====================

  const gerarIndicadoresDP = async (formato: FormatoRelatorio) => {
    setGerando(true);
    try {
      const hoje = new Date();
      const anoAtual = hoje.getFullYear();
      const mesAtual = format(hoje, 'yyyy-MM');

      // Buscar dados
      const [
        { data: colaboradores },
        { data: admissoes },
        { data: desligamentos },
        { data: afastamentos },
        { data: ferias }
      ] = await Promise.all([
        supabase.from('colaboradores').select('id, salario_base, status'),
        supabase.from('admissoes').select('id').neq('etapa', 'esocial'),
        supabase.from('desligamentos').select('id').gte('data_desligamento', validateDateString(`${anoAtual}-01-01`)),
        supabase.from('afastamentos').select('id').in('status', ['ativo', 'prorrogado']),
        supabase.from('ferias').select('id').eq('status', 'em_gozo')
      ]);

      const ativos = colaboradores?.filter(c => c.status === 'ativo') ?? [];
      const custoFolha = ativos.reduce((sum, c) => sum + (c.salario_base ?? 0), 0);

      const indicadores = [
        { indicador: 'Colaboradores Ativos', valor: ativos.length.toString() },
        { indicador: 'Admissões em Andamento', valor: (admissoes?.length ?? 0).toString() },
        { indicador: 'Desligamentos no Ano', valor: (desligamentos?.length ?? 0).toString() },
        { indicador: 'Afastamentos Ativos', valor: (afastamentos?.length ?? 0).toString() },
        { indicador: 'Colaboradores em Férias', valor: (ferias?.length ?? 0).toString() },
        { indicador: 'Custo Folha Projetado', valor: formatters.currency(custoFolha) },
        { indicador: 'Custo Médio por Colaborador', valor: formatters.currency(custoFolha / (ativos.length || 1)) },
      ];

      const columns: ExportColumn[] = [
        { key: 'indicador', header: 'Indicador', width: 35 },
        { key: 'valor', header: 'Valor', width: 25 },
      ];

      await gerarRelatorio(
        `indicadores_dp_${mesAtual}`,
        columns,
        indicadores,
        formato,
        'Indicadores de DP',
        `Referência: ${format(hoje, 'dd/MM/yyyy')}`
      );
    } finally {
      setGerando(false);
    }
  };

  return {
    gerando,
    // Cadastro
    gerarListaColaboradores,
    gerarAniversariantes,
    gerarPorDepartamento,
    gerarFichaRegistro,
    // Folha
    gerarResumoFolha,
    gerarEncargos,
    // Férias
    gerarProgramacaoFerias,
    gerarFeriasVencer,
    // Afastamentos
    gerarAfastamentosPorTipo,
    gerarAbsenteismo,
    // Desligamentos
    gerarTurnover,
    gerarDesligamentosPorMotivo,
    // Ponto
    gerarEspelhoPonto,
    gerarBancoHoras,
    // Indicadores
    gerarIndicadoresDP,
  };
}










