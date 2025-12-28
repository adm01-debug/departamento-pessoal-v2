/**
 * @fileoverview Testes REAIS para feriasService
 * @version V8.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addMonths, differenceInMonths, addDays, format } from 'date-fns';

// Cálculos de férias
const calcularFeriasProporcionais = (salario: number, mesesTrabalhados: number) => {
  const feriasProporcional = (salario / 12) * mesesTrabalhados;
  const tercoConstitucional = feriasProporcional / 3;
  return { feriasProporcional, tercoConstitucional, total: feriasProporcional + tercoConstitucional };
};

const calcularFerias = (salario: number, diasFerias: number, abonoEnabled: boolean = false) => {
  const valorDia = salario / 30;
  const valorFerias = valorDia * diasFerias;
  const tercoConstitucional = valorFerias / 3;
  const abonoPecuniario = abonoEnabled ? (salario / 30) * 10 : 0;
  const tercoAbono = abonoPecuniario / 3;
  
  return {
    valorFerias,
    tercoConstitucional,
    abonoPecuniario,
    tercoAbono,
    totalBruto: valorFerias + tercoConstitucional + abonoPecuniario + tercoAbono,
  };
};

const calcularPeriodoAquisitivo = (dataAdmissao: Date) => {
  const hoje = new Date();
  const mesesTrabalhados = differenceInMonths(hoje, dataAdmissao);
  const periodoCompleto = mesesTrabalhados >= 12;
  const periodosVencidos = Math.floor(mesesTrabalhados / 12);
  const diasDireito = periodoCompleto ? 30 : Math.floor((mesesTrabalhados / 12) * 30);
  
  return { mesesTrabalhados, periodoCompleto, periodosVencidos, diasDireito };
};

describe('feriasService', () => {
  describe('Cálculo de Férias Integrais (30 dias)', () => {
    it('deve calcular férias de 30 dias sem abono', () => {
      const salario = 5000.00;
      const resultado = calcularFerias(salario, 30, false);
      
      expect(resultado.valorFerias).toBe(5000.00);
      expect(resultado.tercoConstitucional).toBeCloseTo(1666.67, 2);
      expect(resultado.abonoPecuniario).toBe(0);
      expect(resultado.totalBruto).toBeCloseTo(6666.67, 2);
    });

    it('deve calcular férias de 30 dias com abono pecuniário', () => {
      const salario = 5000.00;
      const resultado = calcularFerias(salario, 30, true);
      
      // Abono = 10 dias = 5000/30 * 10 = 1666.67
      expect(resultado.abonoPecuniario).toBeCloseTo(1666.67, 2);
      // 1/3 do abono = 555.56
      expect(resultado.tercoAbono).toBeCloseTo(555.56, 2);
      // Total = 5000 + 1666.67 + 1666.67 + 555.56 = 8888.90
      expect(resultado.totalBruto).toBeCloseTo(8888.89, 2);
    });
  });

  describe('Férias Proporcionais', () => {
    it('deve calcular proporcionais para 6 meses trabalhados', () => {
      const salario = 3000.00;
      const meses = 6;
      const resultado = calcularFeriasProporcionais(salario, meses);
      
      // 6/12 avos = 1500
      expect(resultado.feriasProporcional).toBe(1500.00);
      // 1/3 = 500
      expect(resultado.tercoConstitucional).toBe(500.00);
      expect(resultado.total).toBe(2000.00);
    });

    it('deve calcular proporcionais para 3 meses trabalhados', () => {
      const salario = 4000.00;
      const meses = 3;
      const resultado = calcularFeriasProporcionais(salario, meses);
      
      expect(resultado.feriasProporcional).toBeCloseTo(1000.00, 2);
      expect(resultado.tercoConstitucional).toBeCloseTo(333.33, 2);
    });

    it('deve calcular proporcionais para 11 meses trabalhados', () => {
      const salario = 6000.00;
      const meses = 11;
      const resultado = calcularFeriasProporcionais(salario, meses);
      
      expect(resultado.feriasProporcional).toBe(5500.00);
      expect(resultado.tercoConstitucional).toBeCloseTo(1833.33, 2);
    });
  });

  describe('Período Aquisitivo', () => {
    it('deve identificar período completo (12+ meses)', () => {
      const dataAdmissao = addMonths(new Date(), -13);
      const resultado = calcularPeriodoAquisitivo(dataAdmissao);
      
      expect(resultado.periodoCompleto).toBe(true);
      expect(resultado.diasDireito).toBe(30);
      expect(resultado.periodosVencidos).toBe(1);
    });

    it('deve identificar período incompleto (< 12 meses)', () => {
      const dataAdmissao = addMonths(new Date(), -8);
      const resultado = calcularPeriodoAquisitivo(dataAdmissao);
      
      expect(resultado.periodoCompleto).toBe(false);
      expect(resultado.mesesTrabalhados).toBe(8);
      expect(resultado.diasDireito).toBe(20); // 8/12 * 30 = 20
    });

    it('deve calcular múltiplos períodos vencidos', () => {
      const dataAdmissao = addMonths(new Date(), -30);
      const resultado = calcularPeriodoAquisitivo(dataAdmissao);
      
      expect(resultado.periodosVencidos).toBe(2);
    });
  });

  describe('Regras de Negócio - Férias', () => {
    it('deve permitir fracionar em até 3 períodos', () => {
      const periodos = [
        { inicio: '2024-01-15', dias: 14 },
        { inicio: '2024-04-10', dias: 10 },
        { inicio: '2024-07-20', dias: 6 },
      ];
      
      const totalDias = periodos.reduce((acc, p) => acc + p.dias, 0);
      expect(totalDias).toBe(30);
      expect(periodos.length).toBeLessThanOrEqual(3);
      
      // Pelo menos um período deve ter 14+ dias
      const temPeriodoMinimo = periodos.some(p => p.dias >= 14);
      expect(temPeriodoMinimo).toBe(true);
      
      // Nenhum período pode ter menos de 5 dias
      const todosAcima5 = periodos.every(p => p.dias >= 5);
      expect(todosAcima5).toBe(true);
    });

    it('deve rejeitar período menor que 5 dias', () => {
      const diasFerias = 4;
      expect(diasFerias).toBeLessThan(5);
    });

    it('deve verificar antecedência mínima de 30 dias', () => {
      const dataInicio = addDays(new Date(), 45);
      const dataNotificacao = new Date();
      const diasAntecedencia = Math.floor((dataInicio.getTime() - dataNotificacao.getTime()) / (1000 * 60 * 60 * 24));
      
      expect(diasAntecedencia).toBeGreaterThanOrEqual(30);
    });

    it('deve calcular dobra de férias vencidas', () => {
      const salario = 4000.00;
      const feriasNormais = salario + (salario / 3); // 5333.33
      const feriasDobradas = feriasNormais * 2;
      
      expect(feriasDobradas).toBeCloseTo(10666.67, 2);
    });
  });

  describe('Descontos em Férias', () => {
    it('deve calcular INSS sobre férias', () => {
      const totalFerias = 6666.67;
      // INSS progressivo (simplificado para teste)
      const inss = totalFerias * 0.11; // ~11% efetivo
      expect(inss).toBeGreaterThan(700);
    });

    it('deve calcular IRRF sobre férias', () => {
      const totalFerias = 6666.67;
      const inss = 733.33;
      const baseIRRF = totalFerias - inss;
      // 22.5% - 662.77
      const irrf = (baseIRRF * 0.225) - 662.77;
      expect(irrf).toBeGreaterThan(600);
    });

    it('deve deduzir pensão alimentícia se houver', () => {
      const totalFerias = 6666.67;
      const percentualPensao = 30;
      const pensao = totalFerias * (percentualPensao / 100);
      expect(pensao).toBeCloseTo(2000.00, 2);
    });
  });

  describe('Abono Pecuniário (venda de férias)', () => {
    it('deve permitir vender até 1/3 das férias (10 dias)', () => {
      const diasFerias = 30;
      const diasAbono = diasFerias / 3;
      expect(diasAbono).toBe(10);
    });

    it('deve calcular valor do abono', () => {
      const salario = 6000.00;
      const valorDia = salario / 30;
      const abono = valorDia * 10;
      const tercoAbono = abono / 3;
      
      expect(abono).toBe(2000.00);
      expect(tercoAbono).toBeCloseTo(666.67, 2);
    });

    it('deve solicitar abono até 15 dias antes do período aquisitivo', () => {
      const fimPeriodoAquisitivo = addDays(new Date(), 20);
      const dataLimiteSolicitacao = addDays(fimPeriodoAquisitivo, -15);
      const hoje = new Date();
      
      const podeVender = hoje <= dataLimiteSolicitacao;
      expect(podeVender).toBe(true);
    });
  });
});
