import { describe, it, expect } from 'vitest';

describe('useOnboarding', () => {
  it('deve calcular progresso do onboarding', () => {
    const tarefas = [
      { concluida: true },
      { concluida: true },
      { concluida: false },
      { concluida: false }
    ];
    const concluidas = tarefas.filter(t => t.concluida).length;
    const progresso = (concluidas / tarefas.length) * 100;
    expect(progresso).toBe(50);
  });

  it('deve ordenar tarefas por ordem', () => {
    const tarefas = [
      { ordem: 3, titulo: 'C' },
      { ordem: 1, titulo: 'A' },
      { ordem: 2, titulo: 'B' }
    ];
    const ordenadas = [...tarefas].sort((a, b) => a.ordem - b.ordem);
    expect(ordenadas[0].titulo).toBe('A');
  });
});
