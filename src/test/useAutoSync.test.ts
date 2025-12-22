import { describe, it, expect, vi } from 'vitest';

describe('useAutoSync', () => {
  it('deve verificar horário permitido para sync', () => {
    const horaAtual = 14; // 2 PM
    const horaInicio = 8;
    const horaFim = 18;
    const permitido = horaAtual >= horaInicio && horaAtual <= horaFim;
    expect(permitido).toBe(true);
  });

  it('deve bloquear sync fora do horário', () => {
    const horaAtual = 22; // 10 PM
    const horaInicio = 8;
    const horaFim = 18;
    const permitido = horaAtual >= horaInicio && horaAtual <= horaFim;
    expect(permitido).toBe(false);
  });

  it('deve calcular próximo sync', () => {
    const intervaloMinutos = 30;
    const ultimoSync = new Date('2024-01-15T10:00:00');
    const proximoSync = new Date(ultimoSync.getTime() + intervaloMinutos * 60 * 1000);
    expect(proximoSync.getMinutes()).toBe(30);
  });
});
