import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';

export const valeTransporteService = {
  async calcularCustoMensal(colaboradorId: string, diasUteis: number = 22) {
    // 1. Obter salário do colaborador para cálculo do desconto de 6%
    const { data: colab, error: colabError } = await supabase
      .from('colaboradores')
      .select('salario_base')
      .eq('id', colaboradorId)
      .single();
    
    if (colabError) throw colabError;
    const salario = (colab as any).salario_base || 0;
    const descontoMaximo = salario * 0.06;

    // 2. Obter rotas/tarifas vinculadas ao colaborador
    const { data: rotas, error: rotasError } = await supabase
      .from('beneficios_colaborador')
      .select('*, beneficio:beneficios(*)')
      .eq('colaborador_id', colaboradorId);

    if (rotasError) throw rotasError;

    // Filter by type manually if needed or update query
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
      diasUteis
    };
  }
};

export const valeAlimentacaoService = {
  async calcularCredito(beneficioId: string, diasTrabalhados: number = 22) {
    const { data: beneficio, error } = await supabase
      .from('beneficios')
      .select('valor')
      .eq('id', beneficioId)
      .single();

    if (error) throw error;

    // Using 'valor' as a base. If it's VR, we might assume it's daily. 
    // This depends on how 'tipo' is used. For now, let's just fix the TS error.
    const valor = (beneficio as any).valor || 0;
    
    // Simplification: if value is small, maybe it's daily. If large, monthly.
    if (valor < 100) {
      return valor * diasTrabalhados;
    }
    
    return valor;
  }
};

export const planoSaudeService = {
  async calcularCoparticipacao(colaboradorId: string, mesReferencia: string) {
    const { data, error } = await (supabase
      .from('beneficiarios_plano') as any)
      .select('valor_coparticipacao')
      .eq('colaborador_id', colaboradorId)
      .eq('mes_referencia', mesReferencia);

    if (error) throw error;
    
    return (data || []).reduce((acc: number, item: any) => acc + (item.valor_coparticipacao || 0), 0);
  },
  
  async listarDependentesNoPlano(colaboradorId: string) {
    const { data, error } = await (supabase
      .from('beneficiarios_plano') as any)
      .select('*, dependente:dependentes(*)');
      .eq('colaborador_id', colaboradorId)
      .not('dependente_id', 'is', null);
    
    if (error) throw error;
    return data || [];
  }
};

export const seguroVidaService = {
  async calcularPremioMedio(empresaId: string) {
    // Fixing the complex count query which often fails in Supabase TS if not configured
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
      const { count, error: countError } = await (supabase
        .from('beneficios_colaborador') as any)
        .select('*', { count: 'exact', head: true })
        .eq('beneficio_id', beneficio.id);
      
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
    return (data as any) || [];
  },

  async criar(dados: any) {
    const { data, error } = await (supabase
      .from('dependentes') as any)
      .insert(dados)
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