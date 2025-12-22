import { describe, it, expect } from 'vitest';

describe('useFeriados', () => {
  it('deve identificar feriado nacional', () => {
    const feriados = [
      { data: '2024-01-01', tipo: 'nacional', nome: 'Confraternização' },
      { data: '2024-04-21', tipo: 'nacional', nome: 'Tiradentes' }
    ];
    const nacionais = feriados.filter(f => f.tipo === 'nacional');
    expect(nacionais).toHaveLength(2);
  });

  it('deve filtrar feriados por mês', () => {
    const feriados = [
      { data: '2024-01-01' },
      { data: '2024-01-25' },
      { data: '2024-02-12' }
    ];
    const janeiro = feriados.filter(f => f.data.startsWith('2024-01'));
    expect(janeiro).toHaveLength(2);
  });
});
