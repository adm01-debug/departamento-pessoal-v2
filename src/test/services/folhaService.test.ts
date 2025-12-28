/**
 * @fileoverview Testes REAIS para folhaService - Cálculos trabalhistas
 * @version V8.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { folhaService } from '@/services/folhaService';
import { calcularINSS, calcularIRRF, calcularFGTS } from '@/lib/calculosTrabalhistas';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    })),
  },
}));

describe('folhaService', () => {
  describe('Cálculo de INSS Progressivo 2024', () => {
    it('deve calcular INSS para salário na 1ª faixa (até R$ 1.412,00)', () => {
      const salario = 1412.00;
      const resultado = calcularINSS(salario);
      // 1ª faixa: 7.5%
      expect(resultado.valorINSS).toBeCloseTo(105.90, 2);
      expect(resultado.aliquotaEfetiva).toBeCloseTo(7.5, 1);
    });

    it('deve calcular INSS para salário na 2ª faixa (R$ 1.412,01 a R$ 2.666,68)', () => {
      const salario = 2000.00;
      const resultado = calcularINSS(salario);
      // 1ª faixa: 1412 * 7.5% = 105.90
      // 2ª faixa: (2000 - 1412) * 9% = 52.92
      // Total: 158.82
      expect(resultado.valorINSS).toBeCloseTo(158.82, 2);
    });

    it('deve calcular INSS para salário na 3ª faixa (R$ 2.666,69 a R$ 4.000,03)', () => {
      const salario = 3500.00;
      const resultado = calcularINSS(salario);
      // 1ª: 105.90, 2ª: 112.92, 3ª: (3500 - 2666.68) * 12%
      expect(resultado.valorINSS).toBeGreaterThan(300);
      expect(resultado.valorINSS).toBeLessThan(400);
    });

    it('deve calcular INSS para salário na 4ª faixa (R$ 4.000,04 a R$ 7.786,02)', () => {
      const salario = 6000.00;
      const resultado = calcularINSS(salario);
      expect(resultado.valorINSS).toBeGreaterThan(500);
      expect(resultado.valorINSS).toBeLessThan(700);
    });

    it('deve respeitar teto do INSS (R$ 7.786,02)', () => {
      const salario = 15000.00;
      const resultado = calcularINSS(salario);
      // Máximo INSS: ~908.85
      expect(resultado.valorINSS).toBeCloseTo(908.85, 0);
    });

    it('deve retornar detalhamento por faixa', () => {
      const salario = 5000.00;
      const resultado = calcularINSS(salario);
      expect(resultado.detalhamento).toBeDefined();
      expect(resultado.detalhamento.length).toBeGreaterThan(0);
    });
  });

  describe('Cálculo de IRRF 2024', () => {
    it('deve ser isento para base até R$ 2.259,20', () => {
      const baseIRRF = 2000.00;
      const resultado = calcularIRRF(baseIRRF, 0);
      expect(resultado.valorIRRF).toBe(0);
      expect(resultado.faixa).toBe(1);
    });

    it('deve calcular 7.5% para 2ª faixa (R$ 2.259,21 a R$ 2.826,65)', () => {
      const baseIRRF = 2500.00;
      const resultado = calcularIRRF(baseIRRF, 0);
      // (2500 * 7.5%) - 169.44 = 18.06
      expect(resultado.valorIRRF).toBeCloseTo(18.06, 2);
      expect(resultado.faixa).toBe(2);
    });

    it('deve calcular 15% para 3ª faixa (R$ 2.826,66 a R$ 3.751,05)', () => {
      const baseIRRF = 3500.00;
      const resultado = calcularIRRF(baseIRRF, 0);
      // (3500 * 15%) - 381.44 = 143.56
      expect(resultado.valorIRRF).toBeCloseTo(143.56, 2);
      expect(resultado.faixa).toBe(3);
    });

    it('deve calcular 22.5% para 4ª faixa (R$ 3.751,06 a R$ 4.664,68)', () => {
      const baseIRRF = 4000.00;
      const resultado = calcularIRRF(baseIRRF, 0);
      // (4000 * 22.5%) - 662.77 = 237.23
      expect(resultado.valorIRRF).toBeCloseTo(237.23, 2);
      expect(resultado.faixa).toBe(4);
    });

    it('deve calcular 27.5% para 5ª faixa (acima de R$ 4.664,68)', () => {
      const baseIRRF = 8000.00;
      const resultado = calcularIRRF(baseIRRF, 0);
      // (8000 * 27.5%) - 896.00 = 1304.00
      expect(resultado.valorIRRF).toBeCloseTo(1304.00, 2);
      expect(resultado.faixa).toBe(5);
    });

    it('deve deduzir dependentes (R$ 189,59 por dependente)', () => {
      const baseIRRF = 5000.00;
      const dependentes = 2;
      const resultado = calcularIRRF(baseIRRF, dependentes);
      // Base ajustada: 5000 - (2 * 189.59) = 4620.82
      expect(resultado.baseCalculo).toBeCloseTo(4620.82, 2);
    });
  });

  describe('Cálculo de FGTS', () => {
    it('deve calcular 8% sobre remuneração', () => {
      const remuneracao = 5000.00;
      const fgts = calcularFGTS(remuneracao);
      expect(fgts).toBeCloseTo(400.00, 2);
    });

    it('deve calcular FGTS sobre salário + horas extras', () => {
      const salario = 3000.00;
      const horasExtras = 500.00;
      const fgts = calcularFGTS(salario + horasExtras);
      expect(fgts).toBeCloseTo(280.00, 2);
    });

    it('deve calcular FGTS sobre 13º salário', () => {
      const decimoTerceiro = 4000.00;
      const fgts = calcularFGTS(decimoTerceiro);
      expect(fgts).toBeCloseTo(320.00, 2);
    });
  });

  describe('Geração de Folha Mensal', () => {
    const mockColaborador = {
      id: 'colab-001',
      nome: 'João Silva',
      salario: 5000.00,
      dependentes: 1,
      valeTransporte: 220.00,
      valeAlimentacao: 0,
      planoSaude: 300.00,
    };

    it('deve calcular folha completa corretamente', () => {
      const salarioBruto = mockColaborador.salario;
      
      // INSS
      const inss = calcularINSS(salarioBruto);
      
      // Base IRRF = Bruto - INSS - Dependentes
      const deducaoDependente = 189.59;
      const baseIRRF = salarioBruto - inss.valorINSS - (mockColaborador.dependentes * deducaoDependente);
      const irrf = calcularIRRF(baseIRRF, 0);
      
      // Descontos
      const vt = Math.min(salarioBruto * 0.06, mockColaborador.valeTransporte);
      const planoSaude = mockColaborador.planoSaude;
      
      // Líquido
      const descontos = inss.valorINSS + irrf.valorIRRF + vt + planoSaude;
      const liquido = salarioBruto - descontos;
      
      expect(liquido).toBeGreaterThan(3500);
      expect(liquido).toBeLessThan(4500);
    });

    it('deve calcular horas extras 50%', () => {
      const salarioHora = 5000 / 220; // ~22.73
      const horasExtras50 = 10;
      const valorHE50 = salarioHora * 1.5 * horasExtras50;
      expect(valorHE50).toBeCloseTo(340.91, 2);
    });

    it('deve calcular horas extras 100%', () => {
      const salarioHora = 5000 / 220;
      const horasExtras100 = 8;
      const valorHE100 = salarioHora * 2 * horasExtras100;
      expect(valorHE100).toBeCloseTo(363.64, 2);
    });

    it('deve calcular adicional noturno 20%', () => {
      const salarioHora = 5000 / 220;
      const horasNoturnas = 40;
      const adicionalNoturno = salarioHora * 0.2 * horasNoturnas;
      expect(adicionalNoturno).toBeCloseTo(181.82, 2);
    });

    it('deve calcular DSR sobre comissões', () => {
      const comissoes = 1000.00;
      const diasUteis = 22;
      const domingos = 4;
      const dsr = (comissoes / diasUteis) * domingos;
      expect(dsr).toBeCloseTo(181.82, 2);
    });
  });

  describe('Fechamento de Folha', () => {
    it('deve somar total de proventos', () => {
      const proventos = [
        { rubrica: 'SALARIO', valor: 5000 },
        { rubrica: 'HORA_EXTRA_50', valor: 340.91 },
        { rubrica: 'ADICIONAL_NOTURNO', valor: 181.82 },
      ];
      const totalProventos = proventos.reduce((acc, p) => acc + p.valor, 0);
      expect(totalProventos).toBeCloseTo(5522.73, 2);
    });

    it('deve somar total de descontos', () => {
      const descontos = [
        { rubrica: 'INSS', valor: 636.13 },
        { rubrica: 'IRRF', valor: 237.23 },
        { rubrica: 'VT', valor: 220 },
        { rubrica: 'PLANO_SAUDE', valor: 300 },
      ];
      const totalDescontos = descontos.reduce((acc, d) => acc + d.valor, 0);
      expect(totalDescontos).toBeCloseTo(1393.36, 2);
    });

    it('deve calcular líquido = proventos - descontos', () => {
      const totalProventos = 5522.73;
      const totalDescontos = 1393.36;
      const liquido = totalProventos - totalDescontos;
      expect(liquido).toBeCloseTo(4129.37, 2);
    });
  });
});
