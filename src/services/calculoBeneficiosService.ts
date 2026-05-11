import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';

export const valeTransporteService = {
  async calcularCustoMensal(colaboradorId: string, diasUteis: number = 22) {
    // 1. Obter salário do colaborador para cálculo do desconto de 6%
    const { data: colab, error: colabError } = await supabase
      .from('colaboradores')
      .select('salario')
      .eq('id', colaboradorId)
      .single();
    
    if (colabError) throw colabError;
    const salario = colab.salario || 0;
    const descontoMaximo = salario * 0.06;

    // 2. Obter rotas/tarifas vinculadas ao colaborador
    const { data: rotas, error: rotasError } = await supabase
      .from('beneficios_colaborador')
      .select('*, beneficio:beneficios(*)')
      .eq('colaborador_id', colaboradorId)
      .eq('beneficio.tipo', 'transporte');

    if (rotasError) throw rotasError;

    const custoTotal = (rotas || []).reduce((acc, r) => {
      const valorDiario = (r as any).beneficio?.valor || 0;
      const passagensDia = (r as any).quantidade_diaria || 2;
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
      .select('valor, valor_diario')
      .eq('id', beneficioId)
      .single();

    if (error) throw error;

    // Se tiver valor diário fixo (ex: VR), multiplica pelos dias
    if (beneficio.valor_diario) {
      return beneficio.valor_diario * diasTrabalhados;
    }
    
    // Se for valor mensal fixo (ex: VA), retorna o valor cheio
    return beneficio.valor || 0;
  }
};

export const planoSaudeService = {
  async calcularCoparticipacao(colaboradorId: string, mesReferencia: string) {
    const { data, error } = await supabase
      .from('coparticipacao_saude' as any)
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .eq('mes_referencia', mesReferencia);

    if (error) throw error;
    
    return (data || []).reduce((acc: number, item: any) => acc + item.valor, 0);
  }
};

export const dependentesService = {
  async listarPorColaborador(colaboradorId: string) {
    const { data, error } = await supabase
      .from('dependentes' as any)
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('nome');
    
    if (error) throw error;
    return data || [];
  },

  async criar(dados: any) {
    const { data, error } = await supabase
      .from('dependentes' as any)
      .insert(dados)
      .select()
      .single();
    
    if (error) throw error;

    await auditLogger.log({
      tabela: 'dependentes',
      registro_id: data.id,
      acao: 'INSERT',
      dados_novos: data
    });

    return data;
  }
};
