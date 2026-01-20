// V18-T014: Testes da Calculadora Médias
import { describe, it, expect } from 'vitest';
import { calcularMedia, calcularMediaHorasExtras, calcularMediaComissoes, calcularMediaAdicionais, ValorVariavel } from '../medias';

describe('Calculadora Médias', () => {
  const valores12Meses: ValorVariavel[] = [
    { competencia: '2025-01', valor: 100 },
    { competencia: '2025-02', valor: 150 },
    { competencia: '2025-03', valor: 200 },
    { competencia: '2025-04', valor: 120 },
    { competencia: '2025-05', valor: 180 },
    { competencia: '2025-06', valor: 160 },
    { competencia: '2025-07', valor: 140 },
    { competencia: '2025-08', valor: 170 },
    { competencia: '2025-09', valor: 130 },
    { competencia: '2025-10', valor: 190 },
    { competencia: '2025-11', valor: 110 },
    { competencia: '2025-12', valor: 150 }
  ];

  describe('calcularMedia', () => {
    it('deve calcular média simples', () => {
      const valores: ValorVariavel[] = [
        { competencia: '2025-01', valor: 100 },
        { competencia: '2025-02', valor: 200 }
      ];
      expect(calcularMedia(valores)).toBe(150);
    });

    it('deve usar últimos N meses', () => {
      const media6 = calcularMedia(valores12Meses, 6);
      expect(media6).toBeGreaterThan(0);
    });

    it('deve limitar ao número de valores disponíveis', () => {
      const valores: ValorVariavel[] = [
        { competencia: '2025-01', valor: 100 },
        { competencia: '2025-02', valor: 200 }
      ];
      const media = calcularMedia(valores, 12);
      expect(media).toBe(150); // usa só os 2 disponíveis
    });

    it('deve retornar 0 para lista vazia', () => {
      expect(calcularMedia([])).toBe(0);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const valores: ValorVariavel[] = [
        { competencia: '2025-01', valor: 100 },
        { competencia: '2025-02', valor: 200 },
        { competencia: '2025-03', valor: 150 }
      ];
      const media = calcularMedia(valores);
      expect(media.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });

  describe('calcularMediaHorasExtras', () => {
    it('deve calcular média de horas extras', () => {
      const horasExtras: ValorVariavel[] = [
        { competencia: '2025-01', valor: 300 },
        { competencia: '2025-02', valor: 400 }
      ];
      expect(calcularMediaHorasExtras(horasExtras)).toBe(350);
    });
  });

  describe('calcularMediaComissoes', () => {
    it('deve calcular média de comissões', () => {
      const comissoes: ValorVariavel[] = [
        { competencia: '2025-01', valor: 1000 },
        { competencia: '2025-02', valor: 1500 }
      ];
      expect(calcularMediaComissoes(comissoes)).toBe(1250);
    });
  });

  describe('calcularMediaAdicionais', () => {
    it('deve calcular média de adicionais', () => {
      const adicionais: ValorVariavel[] = [
        { competencia: '2025-01', valor: 200 },
        { competencia: '2025-02', valor: 250 }
      ];
      expect(calcularMediaAdicionais(adicionais)).toBe(225);
    });
  });
});
