// V20-009: Service Geracao de Recibos
export interface DadosRecibo {
  colaboradorId: string;
  colaboradorNome: string;
  colaboradorCpf: string;
  empresaNome: string;
  empresaCnpj: string;
  competencia: string;
  tipo: 'holerite' | 'ferias' | 'rescisao' | '13_salario' | 'adiantamento';
  proventos: Array<{ descricao: string; referencia?: string; valor: number }>;
  descontos: Array<{ descricao: string; referencia?: string; valor: number }>;
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
  baseINSS: number;
  baseIRRF: number;
  baseFGTS: number;
  fgtsDeposito: number;
}

export interface ReciboGerado {
  id: string;
  dados: DadosRecibo;
  html: string;
  geradoEm: string;
}

export const reciboService = {
  gerar(dados: DadosRecibo): ReciboGerado {
    const id = `REC-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    const html = this.gerarHTML(dados);
    
    return {
      id,
      dados,
      html,
      geradoEm: new Date().toISOString()
    };
  },

  gerarHTML(dados: DadosRecibo): string {
    return `
      <!DOCTYPE html>
      <html>
      <head><title>Recibo - ${dados.competencia}</title></head>
      <body>
        <h1>${dados.tipo.toUpperCase()}</h1>
        <p>Empresa: ${dados.empresaNome} - CNPJ: ${dados.empresaCnpj}</p>
        <p>Colaborador: ${dados.colaboradorNome} - CPF: ${dados.colaboradorCpf}</p>
        <p>Competência: ${dados.competencia}</p>
        <hr/>
        <h2>Proventos: R$ ${dados.totalProventos.toFixed(2)}</h2>
        <h2>Descontos: R$ ${dados.totalDescontos.toFixed(2)}</h2>
        <h1>Líquido: R$ ${dados.liquido.toFixed(2)}</h1>
        <hr/>
        <p>FGTS do mês: R$ ${dados.fgtsDeposito.toFixed(2)}</p>
      </body>
      </html>
    `;
  },

  async gerarPDF(recibo: ReciboGerado): Promise<Blob> {
    // Placeholder - integrar com jsPDF
    return new Blob([recibo.html], { type: 'text/html' });
  }
};

export default reciboService;
