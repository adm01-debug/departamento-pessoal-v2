// @ts-nocheck
// V18: RescisaoService - Cálculo de Rescisão Completo
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcularINSS } from '@/calculators/inss';
import { calcularIRRF } from '@/calculators/irrf';

export type TipoRescisao = 
  | 'sem_justa_causa' 
  | 'justa_causa' 
  | 'pedido_demissao' 
  | 'acordo'
  | 'termino_contrato';

export interface Rescisao {
  id: string;
  demissao_id: string;
  colaborador_id: string;
  empresa_id: string;
  data_calculo: string;
  // Proventos
  saldo_salario: number;
  decimo13_proporcional: number;
  ferias_proporcionais: number;
  terco_ferias_proporcionais: number;
  ferias_vencidas: number;
  terco_ferias_vencidas: number;
  aviso_previo_indenizado: number;
  dias_aviso_previo: number;
  multa_fgts: number;
  percentual_multa_fgts: number;
  // Totais
  total_bruto: number;
  inss: number;
  irrf: number;
  outros_descontos: number;
  total_descontos: number;
  total_liquido: number;
  // Direitos
  saca_fgts: boolean;
  seguro_desemprego: boolean;
  // Status
  status: 'rascunho' | 'calculado' | 'aprovado' | 'pago';
}

export interface DadosCalculo {
  salario: number;
  dataAdmissao: string;
  dataDemissao: string;
  tipoRescisao: TipoRescisao;
  saldoFGTS: number;
  diasTrabalhados?: number;
  temFeriasVencidas?: boolean;
  avisoPrevioTrabalhado?: boolean;
  mediaVariaveis?: number;
  dependentesIRRF?: number;
}

export const rescisaoServiceReal = {
  /**
   * Calcula rescisão completa
   */
  async calcular(demissaoId: string): Promise<Partial<Rescisao>> {
    // Buscar dados da demissão
    const { data: demissao, error } = await supabase
      .from('demissoes')
      .select('*, colaborador:colaboradores(*)')
      .eq('id', demissaoId)
      .single();

    if (error || !demissao) {
      throw new Error('Demissão não encontrada');
    }

    const col = demissao.colaborador;
    const salario = col.salario || 0;
    
    // Datas
    const dataAdm = new Date(col.data_admissao);
    const dataDem = new Date(demissao.data_demissao);
    
    // Tempo de serviço
    const diasServico = Math.floor((dataDem.getTime() - dataAdm.getTime()) / (1000 * 60 * 60 * 24));
    const anosServico = Math.floor(diasServico / 365);
    const mesesServico = Math.floor((diasServico % 365) / 30);
    
    // Dias no mês da rescisão
    const diasNoMes = dataDem.getDate();
    const meses13 = dataDem.getMonth() + (dataDem.getDate() >= 15 ? 1 : 0);
    
    // Tipo de rescisão
    const tipo = demissao.tipo as TipoRescisao;
    const avisoPrevioTrabalhado = demissao.aviso_trabalhado || false;
    
    // 1. Saldo de salário
    const saldoSalario = Math.round((salario / 30) * diasNoMes * 100) / 100;
    
    // 2. 13º proporcional (exceto justa causa)
    let decimo13 = 0;
    if (tipo !== 'justa_causa') {
      decimo13 = Math.round((salario / 12) * meses13 * 100) / 100;
    }
    
    // 3. Férias proporcionais + 1/3 (exceto justa causa)
    let feriasProporcionais = 0;
    let tercoFeriasProporcionais = 0;
    if (tipo !== 'justa_causa') {
      const avosFerias = Math.min(mesesServico + (diasServico % 30 >= 15 ? 1 : 0), 12);
      feriasProporcionais = Math.round((salario / 12) * avosFerias * 100) / 100;
      tercoFeriasProporcionais = Math.round(feriasProporcionais / 3 * 100) / 100;
    }
    
    // 4. Férias vencidas (sempre paga)
    const feriasVencidas = demissao.tem_ferias_vencidas ? salario : 0;
    const tercoFeriasVencidas = demissao.tem_ferias_vencidas ? Math.round(salario / 3 * 100) / 100 : 0;
    
    // 5. Aviso prévio
    let avisoPrevioIndenizado = 0;
    let diasAvisoPrevio = 0;
    if ((tipo === 'sem_justa_causa' || tipo === 'acordo') && !avisoPrevioTrabalhado) {
      diasAvisoPrevio = 30 + Math.min(anosServico * 3, 60);
      if (tipo === 'acordo') {
        diasAvisoPrevio = Math.floor(diasAvisoPrevio / 2);
      }
      avisoPrevioIndenizado = Math.round((salario / 30) * diasAvisoPrevio * 100) / 100;
    }
    
    // 6. Multa FGTS
    const saldoFGTS = salario * 0.08 * Math.floor(anosServico * 12 + mesesServico);
    let multaFGTS = 0;
    let percentualMultaFGTS = 0;
    let sacaFGTS = false;
    let seguroDesemprego = false;
    
    if (tipo === 'sem_justa_causa') {
      percentualMultaFGTS = 40;
      multaFGTS = Math.round(saldoFGTS * 0.40 * 100) / 100;
      sacaFGTS = true;
      seguroDesemprego = true;
    } else if (tipo === 'acordo') {
      percentualMultaFGTS = 20;
      multaFGTS = Math.round(saldoFGTS * 0.20 * 100) / 100;
      sacaFGTS = true;
    }
    
    // Total proventos
    const totalBruto = saldoSalario + decimo13 + 
      feriasProporcionais + tercoFeriasProporcionais +
      feriasVencidas + tercoFeriasVencidas +
      avisoPrevioIndenizado;
    
    // Descontos
    const baseINSS = saldoSalario + avisoPrevioIndenizado + decimo13;
    const inss = calcularINSS(baseINSS);
    
    const baseIRRF = totalBruto - feriasProporcionais - tercoFeriasProporcionais - 
      feriasVencidas - tercoFeriasVencidas - inss;
    const irrf = calcularIRRF(baseIRRF, demissao.dependentes_irrf || 0);
    
    const totalDescontos = inss + irrf;
    
    return {
      demissao_id: demissaoId,
      colaborador_id: col.id,
      empresa_id: col.empresa_id,
      data_calculo: new Date().toISOString(),
      saldo_salario: saldoSalario,
      decimo13_proporcional: decimo13,
      ferias_proporcionais: feriasProporcionais,
      terco_ferias_proporcionais: tercoFeriasProporcionais,
      ferias_vencidas: feriasVencidas,
      terco_ferias_vencidas: tercoFeriasVencidas,
      aviso_previo_indenizado: avisoPrevioIndenizado,
      dias_aviso_previo: diasAvisoPrevio,
      multa_fgts: multaFGTS,
      percentual_multa_fgts: percentualMultaFGTS,
      total_bruto: Math.round(totalBruto * 100) / 100,
      inss,
      irrf,
      outros_descontos: 0,
      total_descontos: Math.round(totalDescontos * 100) / 100,
      total_liquido: Math.round((totalBruto + multaFGTS - totalDescontos) * 100) / 100,
      saca_fgts: sacaFGTS,
      seguro_desemprego: seguroDesemprego,
      status: 'calculado'
    };
  },

  /**
   * Salva rescisão no banco
   */
  async salvar(rescisao: Partial<Rescisao>): Promise<Rescisao> {
    const { data, error } = await supabase
      .from('rescisoes')
      .upsert(rescisao)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  /**
   * Busca rescisão por demissão
   */
  async getByDemissao(demissaoId: string): Promise<Rescisao | null> {
    const { data, error } = await supabase
      .from('rescisoes')
      .select('*')
      .eq('demissao_id', demissaoId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(handleSupabaseError(error));
    }
    return data;
  },

  /**
   * Lista rescisões da empresa
   */
  async listar(empresaId: string): Promise<Rescisao[]> {
    const { data, error } = await supabase
      .from('rescisoes')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('data_calculo', { ascending: false });

    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  /**
   * Aprova rescisão
   */
  async aprovar(id: string): Promise<Rescisao> {
    const { data, error } = await supabase
      .from('rescisoes')
      .update({ status: 'aprovado' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  /**
   * Marca como pago
   */
  async marcarPago(id: string): Promise<Rescisao> {
    const { data, error } = await supabase
      .from('rescisoes')
      .update({ status: 'pago' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  }
};

export default rescisaoServiceReal;
