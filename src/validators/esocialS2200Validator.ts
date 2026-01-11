// V16-FIX: Validador eSocial S-2200 (Admissão)
export interface DadosS2200 {
  // Dados do Trabalhador
  cpfTrab: string;
  nmTrab: string;
  sexo: 'M' | 'F';
  racaCor: number;
  estCiv: number;
  grauInstr: string;
  nmSoc?: string;
  dtNascto: string;
  
  // Endereço
  tpLograd?: string;
  dscLograd: string;
  nrLograd: string;
  complemento?: string;
  bairro?: string;
  cep: string;
  codMunic: string;
  uf: string;
  
  // Documentos
  nisTrab?: string;
  
  // Contrato
  matricula: string;
  dtAdm: string;
  tpRegTrab: number; // 1=CLT, 2=Estatutário
  tpRegPrev: number; // 1=RGPS, 2=RPPS
  
  // Cargo
  codCargo?: string;
  nmCargo?: string;
  CBOCargo: string;
  
  // Remuneração
  vrSalFx: number;
  undSalFixo: number;
  
  // Jornada
  tpJornada: number;
  qtdHrsSem?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const CAMPOS_OBRIGATORIOS = [
  'cpfTrab', 'nmTrab', 'sexo', 'racaCor', 'estCiv', 'grauInstr',
  'dtNascto', 'dscLograd', 'nrLograd', 'cep', 'codMunic', 'uf',
  'matricula', 'dtAdm', 'tpRegTrab', 'tpRegPrev', 'CBOCargo',
  'vrSalFx', 'undSalFixo', 'tpJornada'
];

export function validateS2200(dados: Partial<DadosS2200>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Verificar campos obrigatórios
  for (const campo of CAMPOS_OBRIGATORIOS) {
    if (!(campo in dados) || dados[campo as keyof DadosS2200] === undefined || dados[campo as keyof DadosS2200] === '') {
      errors.push(`Campo obrigatório: ${campo}`);
    }
  }

  // Validar CPF
  if (dados.cpfTrab) {
    const cpf = dados.cpfTrab.replace(/\D/g, '');
    if (cpf.length !== 11) {
      errors.push('CPF deve ter 11 dígitos');
    }
    if (/^(\d)+$/.test(cpf)) {
      errors.push('CPF inválido (todos dígitos iguais)');
    }
  }

  // Validar data de nascimento
  if (dados.dtNascto) {
    const nasc = new Date(dados.dtNascto);
    const hoje = new Date();
    const idade = Math.floor((hoje.getTime() - nasc.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (idade < 14) {
      errors.push('Trabalhador deve ter pelo menos 14 anos');
    }
    if (idade > 80) {
      warnings.push('Verificar data de nascimento - idade acima de 80 anos');
    }
  }

  // Validar data de admissão
  if (dados.dtAdm) {
    const adm = new Date(dados.dtAdm);
    const hoje = new Date();
    
    if (adm > hoje) {
      warnings.push('Data de admissão é futura - será evento de admissão preliminar');
    }
    
    if (dados.dtNascto) {
      const nasc = new Date(dados.dtNascto);
      if (adm < nasc) {
        errors.push('Data de admissão não pode ser anterior ao nascimento');
      }
    }
  }

  // Validar CEP
  if (dados.cep) {
    const cep = dados.cep.replace(/\D/g, '');
    if (cep.length !== 8) {
      errors.push('CEP deve ter 8 dígitos');
    }
  }

  // Validar CBO
  if (dados.CBOCargo) {
    if (!/^\d{6}$/.test(dados.CBOCargo)) {
      errors.push('CBO deve ter 6 dígitos');
    }
  }

  // Validar salário
  if (dados.vrSalFx !== undefined && dados.vrSalFx < 1518) {
    warnings.push('Salário abaixo do mínimo nacional (R$ 1.518,00)');
  }

  // Validar código município
  if (dados.codMunic && !/^\d{7}$/.test(dados.codMunic)) {
    errors.push('Código do município deve ter 7 dígitos (IBGE)');
  }

  // Validar sexo
  if (dados.sexo && !['M', 'F'].includes(dados.sexo)) {
    errors.push('Sexo deve ser M ou F');
  }

  // Validar raça/cor (tabela eSocial)
  if (dados.racaCor && ![1, 2, 3, 4, 5, 6].includes(dados.racaCor)) {
    errors.push('Raça/Cor inválida (1=Branca, 2=Preta, 3=Parda, 4=Amarela, 5=Indígena, 6=Não informado)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function prepareS2200ForSubmission(dados: DadosS2200): { ready: boolean; data?: DadosS2200; validation: ValidationResult } {
  const validation = validateS2200(dados);
  
  if (!validation.valid) {
    return { ready: false, validation };
  }

  // Limpar e formatar dados
  const prepared: DadosS2200 = {
    ...dados,
    cpfTrab: dados.cpfTrab.replace(/\D/g, ''),
    cep: dados.cep.replace(/\D/g, ''),
    nmTrab: dados.nmTrab.toUpperCase().trim(),
  };

  return { ready: true, data: prepared, validation };
}
