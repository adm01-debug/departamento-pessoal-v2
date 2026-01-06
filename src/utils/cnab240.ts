export interface DadosCNAB240 {
  empresa: {
    cnpj: string;
    nome: string;
    banco: string;
    agencia: string;
    conta: string;
  };
  pagamentos: {
    funcionario: string;
    cpf: string;
    banco: string;
    agencia: string;
    conta: string;
    valor: number;
  }[];
}

export function gerarArquivoCNAB240(dados: DadosCNAB240): string {
  const linhas: string[] = [];
  const dataGeracao = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
  // Header do arquivo
  linhas.push(
    `${dados.empresa.banco}0001240    2${dados.empresa.cnpj.padStart(14, '0')}${dados.empresa.nome.padEnd(30)}`
  );
  
  // Detalhes dos pagamentos
  let seq = 1;
  dados.pagamentos.forEach(p => {
    linhas.push(
      `${dados.empresa.banco}00013${seq.toString().padStart(5, '0')}A${p.cpf}${p.valor.toFixed(2).padStart(15, '0')}`
    );
    seq++;
  });
  
  // Trailer do arquivo
  linhas.push(
    `${dados.empresa.banco}00019${dados.pagamentos.length.toString().padStart(6, '0')}`
  );
  
  return linhas.join('\n');
}
