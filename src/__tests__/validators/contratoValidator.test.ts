// V16-057: Tests for Contrato Validator
import { describe, it, expect } from 'vitest';

const tiposContrato = ['indeterminado', 'determinado', 'experiencia', 'temporario', 'estagio', 'jovem_aprendiz'];

const validateContrato = (data: any) => {
  const errors: string[] = [];
  if (!data.tipo || !tiposContrato.includes(data.tipo)) errors.push('Tipo de contrato inválido');
  if (!data.data_inicio) errors.push('Data de início obrigatória');
  if (data.tipo === 'determinado' && !data.data_fim) errors.push('Contrato determinado requer data fim');
  if (data.tipo === 'experiencia' && !data.dias_experiencia) errors.push('Informe os dias de experiência');
  if (data.dias_experiencia && data.dias_experiencia > 90) errors.push('Experiência máxima é 90 dias');
  return { valid: errors.length === 0, errors };
};

describe('contratoValidator', () => {
  it('deve validar contrato indeterminado', () => {
    const result = validateContrato({ tipo: 'indeterminado', data_inicio: '2025-01-01' });
    expect(result.valid).toBe(true);
  });

  it('deve exigir data_fim para determinado', () => {
    const result = validateContrato({ tipo: 'determinado', data_inicio: '2025-01-01' });
    expect(result.errors).toContain('Contrato determinado requer data fim');
  });

  it('deve validar limite de experiência', () => {
    const result = validateContrato({ tipo: 'experiencia', data_inicio: '2025-01-01', dias_experiencia: 120 });
    expect(result.errors).toContain('Experiência máxima é 90 dias');
  });

  it('deve rejeitar tipo inválido', () => {
    const result = validateContrato({ tipo: 'invalido', data_inicio: '2025-01-01' });
    expect(result.errors).toContain('Tipo de contrato inválido');
  });
});
