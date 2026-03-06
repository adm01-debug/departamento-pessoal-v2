// @ts-nocheck
// V21-001: Service CNAB 240 - Pagamento Folha
export interface HeaderArquivoCNAB {
  codigoBanco: string;
  tipoRegistro: '0';
  codigoConvenio: string;
  nomeEmpresa: string;
  dataGeracao: string;
  sequencialArquivo: number;
}

export interface DetalheCNAB {
  tipoRegistro: '3';
  segmento: 'A' | 'B' | 'J';
  favorecido: string;
  cpfCnpj: string;
  banco: string;
  agencia: string;
  conta: string;
  valor: number;
  dataPagamento: string;
}

export interface TrailerCNAB {
  tipoRegistro: '9';
  quantidadeRegistros: number;
  valorTotal: number;
}

export const cnab240Service = {
  BANCOS: {
    '001': 'Banco do Brasil',
    '104': 'Caixa Econômica Federal',
    '237': 'Bradesco',
    '341': 'Itaú',
    '033': 'Santander'
  },

  gerarHeader(dados: Partial<HeaderArquivoCNAB>): string {
    const linha = [
      (dados.codigoBanco || '001').padStart(3, '0'),
      '0000',
      '0',
      ' '.repeat(9),
      '2',
      (dados.codigoConvenio || '').padEnd(20, ' '),
      (dados.nomeEmpresa || '').padEnd(30, ' ').substring(0, 30),
      dados.dataGeracao || new Date().toISOString().split('T')[0].replace(/-/g, ''),
      String(dados.sequencialArquivo || 1).padStart(6, '0'),
      '089',
      '00000',
      ' '.repeat(54),
      '000'
    ].join('');
    return linha.padEnd(240, ' ');
  },

  gerarDetalhe(detalhe: DetalheCNAB, sequencial: number): string {
    return `3${detalhe.segmento}${String(sequencial).padStart(5, '0')}`.padEnd(240, ' ');
  },

  gerarTrailer(trailer: TrailerCNAB): string {
    return `9${String(trailer.quantidadeRegistros).padStart(6, '0')}${String(Math.round(trailer.valorTotal * 100)).padStart(18, '0')}`.padEnd(240, ' ');
  },

  gerarArquivo(header: Partial<HeaderArquivoCNAB>, detalhes: DetalheCNAB[]): string {
    const linhas: string[] = [];
    linhas.push(this.gerarHeader(header));
    detalhes.forEach((d, i) => linhas.push(this.gerarDetalhe(d, i + 1)));
    linhas.push(this.gerarTrailer({ tipoRegistro: '9', quantidadeRegistros: detalhes.length + 2, valorTotal: detalhes.reduce((a, b) => a + b.valor, 0) }));
    return linhas.join('\n');
  }
};

export default cnab240Service;
