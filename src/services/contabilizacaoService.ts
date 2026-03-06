// @ts-nocheck
// V21-002: Service de Contabilizacao - Lancamentos Contabeis
export interface LancamentoContabil {
  data: string;
  conta: string;
  contrapartida: string;
  valor: number;
  historico: string;
  documento?: string;
  centoCusto?: string;
}

export interface PlanoContas {
  codigo: string;
  descricao: string;
  tipo: 'A' | 'P' | 'R' | 'D'; // Ativo, Passivo, Receita, Despesa
  natureza: 'D' | 'C'; // Débito, Crédito
}

export const contabilizacaoService = {
  // Contas padrão para folha de pagamento
  CONTAS: {
    SALARIOS: '3.1.1.01',
    ENCARGOS_INSS: '3.1.2.01',
    ENCARGOS_FGTS: '3.1.2.02',
    PROVISAO_FERIAS: '2.1.3.01',
    PROVISAO_13: '2.1.3.02',
    INSS_RECOLHER: '2.1.1.01',
    IRRF_RECOLHER: '2.1.1.02',
    FGTS_RECOLHER: '2.1.1.03',
    SALARIOS_PAGAR: '2.1.2.01',
    BANCO: '1.1.1.02'
  },

  gerarLancamentosFolha(competencia: string, dados: { salarios: number; inss: number; irrf: number; fgts: number; liquido: number }): LancamentoContabil[] {
    const lancamentos: LancamentoContabil[] = [];
    const historico = `Folha de pagamento ${competencia}`;

    // Débito Despesa Salários / Crédito Salários a Pagar
    lancamentos.push({ data: competencia, conta: this.CONTAS.SALARIOS, contrapartida: this.CONTAS.SALARIOS_PAGAR, valor: dados.salarios, historico });

    // Débito Despesa INSS / Crédito INSS a Recolher
    if (dados.inss > 0) {
      lancamentos.push({ data: competencia, conta: this.CONTAS.ENCARGOS_INSS, contrapartida: this.CONTAS.INSS_RECOLHER, valor: dados.inss, historico });
    }

    // Débito Despesa FGTS / Crédito FGTS a Recolher
    if (dados.fgts > 0) {
      lancamentos.push({ data: competencia, conta: this.CONTAS.ENCARGOS_FGTS, contrapartida: this.CONTAS.FGTS_RECOLHER, valor: dados.fgts, historico });
    }

    return lancamentos;
  },

  formatarParaExportacao(lancamentos: LancamentoContabil[]): string {
    return lancamentos.map(l => 
      `${l.data};${l.conta};${l.contrapartida};${l.valor.toFixed(2)};${l.historico}`
    ).join('\n');
  }
};

export default contabilizacaoService;
