// @ts-nocheck
// V20-010: Service Geracao de Guias
export type TipoGuia = 'GPS' | 'DARF' | 'GRF' | 'GRRF' | 'DAE';

export interface DadosGuia {
  tipo: TipoGuia;
  competencia: string;
  vencimento: string;
  valor: number;
  codigoReceita?: string;
  cnpjCpf: string;
  razaoSocial: string;
  observacoes?: string;
}

export interface GuiaGerada {
  id: string;
  tipo: TipoGuia;
  dados: DadosGuia;
  codigoBarras?: string;
  linhaDigitavel?: string;
  geradoEm: string;
}

export const guiaService = {
  gerar(dados: DadosGuia): GuiaGerada {
    const id = `GUIA-${dados.tipo}-${Date.now()}`;
    
    return {
      id,
      tipo: dados.tipo,
      dados,
      codigoBarras: this.gerarCodigoBarras(dados),
      linhaDigitavel: this.gerarLinhaDigitavel(dados),
      geradoEm: new Date().toISOString()
    };
  },

  gerarCodigoBarras(dados: DadosGuia): string {
    // Placeholder - gerar código de barras real
    const base = `${dados.tipo}${dados.competencia.replace('/', '')}${Math.round(dados.valor * 100)}`;
    return base.padEnd(44, '0');
  },

  gerarLinhaDigitavel(dados: DadosGuia): string {
    const codigo = this.gerarCodigoBarras(dados);
    // Formatar em blocos
    return `${codigo.slice(0, 11)}.${codigo.slice(11, 22)}.${codigo.slice(22, 33)}.${codigo.slice(33, 44)}`;
  },

  // Códigos de receita comuns
  CODIGOS: {
    GPS_EMPRESA: '2100',
    GPS_MEI: '1910',
    DARF_IRRF: '0561',
    DARF_PIS: '8109',
    DARF_COFINS: '2172',
    GRF_FGTS: '115',
    GRRF_FGTS: '650'
  }
};

export default guiaService;
