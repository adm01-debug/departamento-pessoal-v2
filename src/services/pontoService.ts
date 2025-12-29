/**
 * @fileoverview Service para operações de ponto
 * @module services/pontoService
 * @version V8.1 - Corrigido por análise QA
 */
import { supabase } from '@/integrations/supabase/client';
import { RegistroPonto, PontoFilters, TipoBatida, ResumoMensal } from '@/types/ponto';
import { logger } from '@/lib/logger';
import { format, parseISO, differenceInMinutes } from 'date-fns';

// ============================================
// CONSTANTES
// ============================================

const TABLE_NAME = 'registros_ponto';
const TOLERANCIA_MINUTOS = 10;
const JORNADA_DIARIA_MINUTOS = 480; // 8 horas

const PONTO_FIELDS = `
  id, colaborador_id, data, entrada1, saida1, entrada2, saida2,
  horas_trabalhadas, horas_extras, horas_falta, banco_horas,
  tipo_dia, status, localizacao, dispositivo, ip, observacoes,
  aprovador_id, data_aprovacao, empresa_id, created_at, updated_at
`;

const PONTO_WITH_RELATIONS = `
  ${PONTO_FIELDS},
  colaborador:colaboradores(id, nome, cpf, departamento_id, jornada_trabalho)
`;

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function minutosParaHoras(minutos: number): string {
  const horas = Math.floor(Math.abs(minutos) / 60);
  const mins = Math.abs(minutos) % 60;
  const sinal = minutos < 0 ? '-' : '';
  return `${sinal}${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function horasParaMinutos(horas: string): number {
  if (!horas) return 0;
  const [h, m] = horas.split(':').map(Number);
  return (h * 60) + (m || 0);
}

function calcularMinutosTrabalhados(registro: Partial<RegistroPonto>): number {
  let total = 0;
  
  if (registro.entrada1 && registro.saida1) {
    total += horasParaMinutos(registro.saida1) - horasParaMinutos(registro.entrada1);
  }
  
  if (registro.entrada2 && registro.saida2) {
    total += horasParaMinutos(registro.saida2) - horasParaMinutos(registro.entrada2);
  }
  
  return Math.max(0, total);
}

function getDataHoje(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function getHoraAtual(): string {
  return format(new Date(), 'HH:mm:ss');
}

// ============================================
// SERVICE
// ============================================

export const pontoService = {
  /**
   * Lista registros de ponto com filtros
   */
  async listar(filters: PontoFilters): Promise<RegistroPonto[]> {
    try {
      let query = supabase
        .from(TABLE_NAME)
        .select(PONTO_WITH_RELATIONS);
      
      if (filters.empresa_id) {
        query = query.eq('empresa_id', filters.empresa_id);
      }
      if (filters.colaborador_id) {
        query = query.eq('colaborador_id', filters.colaborador_id);
      }
      if (filters.data_inicio) {
        query = query.gte('data', filters.data_inicio);
      }
      if (filters.data_fim) {
        query = query.lte('data', filters.data_fim);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query.order('data', { ascending: false });
      
      if (error) throw new Error(error.message);
      return (data ?? []) as RegistroPonto[];
    } catch (error) {
      logger.error('Erro ao listar registros de ponto:', error);
      throw error;
    }
  },

  /**
   * Busca registro por ID
   */
  async buscarPorId(id: string): Promise<RegistroPonto | null> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(PONTO_WITH_RELATIONS)
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw new Error(error.message);
      }
      return data as RegistroPonto;
    } catch (error) {
      logger.error('Erro ao buscar registro de ponto:', error);
      throw error;
    }
  },

  /**
   * Busca registro do dia atual
   */
  async buscarRegistroDia(colaboradorId: string, data?: string): Promise<RegistroPonto | null> {
    const dataConsulta = data || getDataHoje();
    
    try {
      const { data: registro, error } = await supabase
        .from(TABLE_NAME)
        .select(PONTO_FIELDS)
        .eq('colaborador_id', colaboradorId)
        .eq('data', dataConsulta)
        .maybeSingle();
      
      if (error) throw new Error(error.message);
      return registro as RegistroPonto | null;
    } catch (error) {
      logger.error('Erro ao buscar registro do dia:', error);
      throw error;
    }
  },

  /**
   * Registra batida de ponto
   */
  async registrarBatida(
    colaboradorId: string,
    tipo: TipoBatida,
    options?: {
      localizacao?: { lat: number; lng: number };
      dispositivo?: string;
      ip?: string;
      empresaId?: string;
    }
  ): Promise<RegistroPonto> {
    const data = getDataHoje();
    const hora = getHoraAtual();
    
    try {
      // Buscar registro existente do dia
      let registro = await this.buscarRegistroDia(colaboradorId, data);
      
      if (!registro) {
        // Criar novo registro
        const novoRegistro = {
          colaborador_id: colaboradorId,
          data,
          [tipo]: hora,
          status: 'aberto',
          localizacao: options?.localizacao ? JSON.stringify(options.localizacao) : null,
          dispositivo: options?.dispositivo,
          ip: options?.ip,
          empresa_id: options?.empresaId,
          created_at: new Date().toISOString(),
        };
        
        const { data: criado, error } = await supabase
          .from(TABLE_NAME)
          .insert([novoRegistro])
          .select(PONTO_FIELDS)
          .single();
        
        if (error) throw new Error(error.message);
        registro = criado as RegistroPonto;
      } else {
        // Atualizar registro existente
        if (registro[tipo]) {
          throw new Error(`Batida de ${tipo} já registrada para hoje`);
        }
        
        const { data: atualizado, error } = await supabase
          .from(TABLE_NAME)
          .update({
            [tipo]: hora,
            updated_at: new Date().toISOString(),
          })
          .eq('id', registro.id)
          .select(PONTO_FIELDS)
          .single();
        
        if (error) throw new Error(error.message);
        registro = atualizado as RegistroPonto;
      }
      
      // Recalcular horas se tiver batida completa
      if (registro.entrada1 && registro.saida2) {
        await this.calcularHorasDia(registro.id);
      }
      
      logger.info('Batida registrada:', { colaboradorId, tipo, hora });
      return registro;
    } catch (error) {
      logger.error('Erro ao registrar batida:', error);
      throw error;
    }
  },

  /**
   * Calcula horas de um dia específico
   */
  async calcularHorasDia(registroId: string): Promise<RegistroPonto> {
    try {
      const registro = await this.buscarPorId(registroId);
      if (!registro) throw new Error('Registro não encontrado');
      
      const minutosTrabalhados = calcularMinutosTrabalhados(registro);
      const horasExtras = Math.max(0, minutosTrabalhados - JORNADA_DIARIA_MINUTOS);
      const horasFalta = Math.max(0, JORNADA_DIARIA_MINUTOS - minutosTrabalhados);
      const bancoHoras = minutosTrabalhados - JORNADA_DIARIA_MINUTOS;
      
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          horas_trabalhadas: minutosParaHoras(minutosTrabalhados),
          horas_extras: minutosParaHoras(horasExtras),
          horas_falta: minutosParaHoras(horasFalta),
          banco_horas: bancoHoras,
          status: 'fechado',
          updated_at: new Date().toISOString(),
        })
        .eq('id', registroId)
        .select(PONTO_FIELDS)
        .single();
      
      if (error) throw new Error(error.message);
      return data as RegistroPonto;
    } catch (error) {
      logger.error('Erro ao calcular horas do dia:', error);
      throw error;
    }
  },

  /**
   * Calcula resumo mensal de horas
   */
  async calcularResumoMensal(
    colaboradorId: string,
    mes: number,
    ano: number
  ): Promise<ResumoMensal> {
    const dataInicio = `${ano}-${String(mes).padStart(2, '0')}-01`;
    const dataFim = `${ano}-${String(mes).padStart(2, '0')}-31`;
    
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select(PONTO_FIELDS)
        .eq('colaborador_id', colaboradorId)
        .gte('data', dataInicio)
        .lte('data', dataFim);
      
      if (error) throw new Error(error.message);
      
      const registros = (data ?? []) as RegistroPonto[];
      
      let totalMinutos = 0;
      let minutosExtras = 0;
      let minutosFalta = 0;
      let diasTrabalhados = 0;
      let diasFalta = 0;
      let atrasos = 0;
      
      for (const reg of registros) {
        const minutos = calcularMinutosTrabalhados(reg);
        
        if (minutos > 0) {
          diasTrabalhados++;
          totalMinutos += minutos;
          
          if (minutos > JORNADA_DIARIA_MINUTOS) {
            minutosExtras += minutos - JORNADA_DIARIA_MINUTOS;
          } else if (minutos < JORNADA_DIARIA_MINUTOS - TOLERANCIA_MINUTOS) {
            minutosFalta += JORNADA_DIARIA_MINUTOS - minutos;
          }
        } else if (reg.tipo_dia === 'util') {
          diasFalta++;
        }
        
        // Verificar atraso
        if (reg.entrada1) {
          const minutosEntrada = horasParaMinutos(reg.entrada1);
          const horarioEsperado = 8 * 60; // 08:00
          if (minutosEntrada > horarioEsperado + TOLERANCIA_MINUTOS) {
            atrasos++;
          }
        }
      }
      
      return {
        colaboradorId,
        mes,
        ano,
        totalHoras: minutosParaHoras(totalMinutos),
        horasExtras: minutosParaHoras(minutosExtras),
        horasFalta: minutosParaHoras(minutosFalta),
        saldoBancoHoras: totalMinutos - (diasTrabalhados * JORNADA_DIARIA_MINUTOS),
        diasTrabalhados,
        diasFalta,
        atrasos,
        registros,
      };
    } catch (error) {
      logger.error('Erro ao calcular resumo mensal:', error);
      throw error;
    }
  },

  /**
   * Ajusta registro de ponto (com justificativa)
   */
  async ajustarRegistro(
    id: string,
    dados: Partial<RegistroPonto>,
    justificativa: string,
    aprovadorId?: string
  ): Promise<RegistroPonto> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          ...dados,
          observacoes: justificativa,
          status: aprovadorId ? 'aprovado' : 'pendente',
          aprovador_id: aprovadorId,
          data_aprovacao: aprovadorId ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(PONTO_FIELDS)
        .single();
      
      if (error) throw new Error(error.message);
      
      logger.info('Registro ajustado:', { id, justificativa });
      return data as RegistroPonto;
    } catch (error) {
      logger.error('Erro ao ajustar registro:', error);
      throw error;
    }
  },

  /**
   * Aprovar ajuste de ponto
   */
  async aprovarAjuste(id: string, aprovadorId: string): Promise<RegistroPonto> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .update({
          status: 'aprovado',
          aprovador_id: aprovadorId,
          data_aprovacao: new Date().toISOString(),
        })
        .eq('id', id)
        .select(PONTO_FIELDS)
        .single();
      
      if (error) throw new Error(error.message);
      return data as RegistroPonto;
    } catch (error) {
      logger.error('Erro ao aprovar ajuste:', error);
      throw error;
    }
  },
};

export default pontoService;
