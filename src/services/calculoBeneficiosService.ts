import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';

export const valeTransporteService = {
  async calcularCustoMensal(colaboradorId: string, diasUteis: number = 22) {
    const { data: colab, error: colabError } = await supabase
      .from('colaboradores')
      .select('salario_base')
      .eq('id', colaboradorId)
      .single();
    
    if (colabError) throw colabError;
    const salario = (colab as any).salario_base || 0;
    const descontoMaximo = salario * 0.06;

    const { data: rotas, error: rotasError } = await supabase
      .from('beneficios_colaborador')
      .select('*, beneficio:beneficios(*)')
      .eq('colaborador_id', colaboradorId)
      .eq('status_vinculo', 'ativo');

    if (rotasError) throw rotasError;

    const rotasTransporte = (rotas || []).filter((r: any) => r.beneficio?.tipo === 'transporte');

    const custoTotal = rotasTransporte.reduce((acc, r: any) => {
      const valorDiario = r.beneficio?.valor || 0;
      const passagensDia = r.quantidade_diaria || 2;
      return acc + (valorDiario * passagensDia * diasUteis);
    }, 0);

    const descontoEfetivo = Math.min(custoTotal, descontoMaximo);
    const custoEmpresa = Math.max(0, custoTotal - descontoEfetivo);

    return {
      custoTotal,
      descontoColaborador: descontoEfetivo,
      custoEmpresa,
      diasUteis,
      aliquotaDesconto: 0.06
    };
  }
};

export const valeAlimentacaoService = {
  async calcularCredito(beneficioId: string, diasTrabalhados: number = 22) {
    const { data: beneficio, error } = await supabase
      .from('beneficios')
      .select('valor, tipo')
      .eq('id', beneficioId)
      .single();

    if (error) throw error;
    const valor = (beneficio as any).valor || 0;
    
    // Se for mensal (valor alto), retorna o valor cheio, senão calcula proporcional
    if (valor < 100) {
      return valor * diasTrabalhados;
    }
    
    return valor;
  },

  async registrarRecarga(dados: { colaborador_id: string, vale_id?: string, valor: number, mes_referencia: string, origem_recurso?: string }) {
    const { data, error } = await supabase.from('recargas_vale').insert({
      ...dados,
      data_recarga: new Date().toISOString().split('T')[0],
      status: 'processado'
    }).select().single();

    if (error) throw error;

    await auditLogger.log({
      tabela: 'recargas_vale',
      registro_id: (data as any).id,
      acao: 'INSERT',
      dados_novos: data
    });

    return data;
  }
};

export const planoSaudeService = {
  async calcularCoparticipacao(colaboradorId: string, mesReferencia: string) {
    const { data, error } = await supabase
      .from('beneficiarios_plano')
      .select('valor_coparticipacao')
      .eq('colaborador_id', colaboradorId)
      .eq('mes_referencia', mesReferencia)
      .neq('status', 'excluido');

    if (error) throw error;
    
    return (data || []).reduce((acc: number, item: any) => acc + (Number(item.valor_coparticipacao) || 0), 0);
  },
  
  async listarDependentesNoPlano(colaboradorId: string) {
    const { data, error } = await (supabase
      .from('beneficiarios_plano') as any)
      .select('*, dependente:dependentes(*)')
      .eq('colaborador_id', colaboradorId)
      .not('dependente_id', 'is', null)
      .neq('status', 'excluido');
    
    if (error) throw error;
    return data || [];
  }
};

export const seguroVidaService = {
  async calcularPremioMedio(empresaId: string) {
    const { data, error } = await supabase
      .from('beneficios')
      .select('id, valor, tipo')
      .eq('empresa_id', empresaId)
      .eq('tipo', 'vida');
    
    if (error) throw error;
    if (!data || data.length === 0) return 0;

    let totalPremiums = 0;
    let totalParticipants = 0;

    for (const beneficio of data) {
      const { count, error: countError } = await supabase
        .from('beneficios_colaborador')
        .select('*', { count: 'exact', head: true })
        .eq('beneficio_id', beneficio.id)
        .eq('status_vinculo', 'ativo');
      
      if (!countError && count !== null) {
        totalPremiums += (beneficio.valor || 0) * count;
        totalParticipants += count;
      }
    }
    
    return totalParticipants > 0 ? totalPremiums / totalParticipants : 0;
  }
};

export const dependentesService = {
  async listarPorColaborador(colaboradorId: string) {
    const { data, error } = await (supabase
      .from('dependentes') as any)
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('nome');
    
    if (error) throw error;
    return data || [];
  },

  async criar(dados: any) {
    const { data, error } = await supabase
      .from('dependentes')
      .insert({
        ...dados,
        data_inicio_vigencia: dados.data_inicio_vigencia || new Date().toISOString().split('T')[0]
      })
      .select()
      .single();
    
    if (error) throw error;

    await auditLogger.log({
      tabela: 'dependentes',
      registro_id: (data as any).id,
      acao: 'INSERT',
      dados_novos: data
    });

    return data;
  }
};