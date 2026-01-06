export interface DadosSEFIP {
  competencia: string;
  empresa: {
    cnpj: string;
    razaoSocial: string;
  };
  trabalhadores: {
    pis: string;
    nome: string;
    remuneracao: number;
    fgts: number;
  }[];
}

export function gerarArquivoSEFIP(dados: DadosSEFIP): string {
  const linhas: string[] = [];
  
  // Header
  linhas.push(`00SEFIP    ${dados.competencia}`);
  linhas.push(`10${dados.empresa.cnpj}${dados.empresa.razaoSocial.padEnd(40)}`);
  
  // Trabalhadores
  dados.trabalhadores.forEach(t => {
    linhas.push(
      `30${t.pis}${t.nome.padEnd(40)}${t.remuneracao.toFixed(2).padStart(15, '0')}`
    );
  });
  
  // Trailer
  linhas.push(`90${dados.trabalhadores.length.toString().padStart(6, '0')}`);
  
  return linhas.join('\n');
}

export function validarSEFIP(dados: DadosSEFIP): { valido: boolean; erros: string[] } {
  const erros: string[] = [];
  
  if (!dados.competencia) erros.push('Competência obrigatória');
  if (!dados.empresa?.cnpj) erros.push('CNPJ obrigatório');
  if (!dados.empresa?.razaoSocial) erros.push('Razão social obrigatória');
  
  return { valido: erros.length === 0, erros };
}
