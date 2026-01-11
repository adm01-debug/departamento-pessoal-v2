// V16-FIX: Validador de Sequência de Ponto
export interface PontoRegistro {
  entrada_1?: string | null;
  saida_1?: string | null;
  entrada_2?: string | null;
  saida_2?: string | null;
  entrada_3?: string | null;
  saida_3?: string | null;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  nextExpected: 'entrada' | 'saida' | 'complete';
}

export function validatePontoSequence(ponto: PontoRegistro): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const parseTime = (t: string | null | undefined): number | null => {
    if (!t) return null;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  const e1 = parseTime(ponto.entrada_1);
  const s1 = parseTime(ponto.saida_1);
  const e2 = parseTime(ponto.entrada_2);
  const s2 = parseTime(ponto.saida_2);
  const e3 = parseTime(ponto.entrada_3);
  const s3 = parseTime(ponto.saida_3);

  // Verificar sequência lógica
  if (s1 !== null && e1 === null) {
    errors.push('Saída 1 registrada sem entrada 1');
  }
  if (e2 !== null && s1 === null) {
    errors.push('Entrada 2 registrada sem saída 1');
  }
  if (s2 !== null && e2 === null) {
    errors.push('Saída 2 registrada sem entrada 2');
  }
  if (e3 !== null && s2 === null) {
    errors.push('Entrada 3 registrada sem saída 2');
  }
  if (s3 !== null && e3 === null) {
    errors.push('Saída 3 registrada sem entrada 3');
  }

  // Verificar ordem cronológica
  if (e1 !== null && s1 !== null && s1 <= e1) {
    errors.push('Saída 1 deve ser após entrada 1');
  }
  if (s1 !== null && e2 !== null && e2 <= s1) {
    errors.push('Entrada 2 deve ser após saída 1');
  }
  if (e2 !== null && s2 !== null && s2 <= e2) {
    errors.push('Saída 2 deve ser após entrada 2');
  }
  if (s2 !== null && e3 !== null && e3 <= s2) {
    errors.push('Entrada 3 deve ser após saída 2');
  }
  if (e3 !== null && s3 !== null && s3 <= e3) {
    errors.push('Saída 3 deve ser após entrada 3');
  }

  // Verificar intervalo mínimo de almoço (1 hora)
  if (s1 !== null && e2 !== null) {
    const intervalo = e2 - s1;
    if (intervalo < 60) {
      warnings.push(`Intervalo de ${intervalo} minutos é menor que 1 hora`);
    }
  }

  // Verificar jornada máxima (10 horas por dia)
  let totalMinutos = 0;
  if (e1 !== null && s1 !== null) totalMinutos += s1 - e1;
  if (e2 !== null && s2 !== null) totalMinutos += s2 - e2;
  if (e3 !== null && s3 !== null) totalMinutos += s3 - e3;
  
  if (totalMinutos > 600) {
    warnings.push(`Jornada de ${Math.floor(totalMinutos/60)}h${totalMinutos%60}min excede 10 horas`);
  }

  // Determinar próxima batida esperada
  let nextExpected: 'entrada' | 'saida' | 'complete' = 'entrada';
  if (e1 === null) nextExpected = 'entrada';
  else if (s1 === null) nextExpected = 'saida';
  else if (e2 === null) nextExpected = 'entrada';
  else if (s2 === null) nextExpected = 'saida';
  else if (e3 === null) nextExpected = 'entrada';
  else if (s3 === null) nextExpected = 'saida';
  else nextExpected = 'complete';

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    nextExpected,
  };
}

export function canRegister(ponto: PontoRegistro, tipo: 'entrada' | 'saida'): { allowed: boolean; reason?: string } {
  const result = validatePontoSequence(ponto);
  
  if (result.nextExpected === 'complete') {
    return { allowed: false, reason: 'Todos os registros do dia já foram feitos' };
  }
  
  if (result.nextExpected !== tipo) {
    return { allowed: false, reason: `Próxima batida esperada é ${result.nextExpected}` };
  }
  
  return { allowed: true };
}
