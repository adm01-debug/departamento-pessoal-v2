// V18-T005: Testes da Calculadora Rescisão
// Criado em: 20/01/2026
import { describe, it, expect } from 'vitest';
import { calcularRescisao, TipoRescisao, DadosRescisao } from '../rescisao';

describe('Calculadora Rescisão', () => {
  const dadosBase: DadosRescisao = {
    salarioBase: 3000,
    dataAdmissao: new Date('2024-01-15'),
    dataRescisao: new Date('2026-01-20'),
    tipoRescisao: 'sem_justa_causa',
    saldoFGTS: 10000,
    diasTrabalhados: 20,
    feriasVencidas: false,
    avisoPrevioTrabalhado: false,
    mediaVariaveis: 0,
    dependentesIRRF: 0
  };

  describe('Rescisão sem justa causa', () => {
    it('deve calcular saldo de salário', () => {
      const resultado = calcularRescisao(dadosBase);
      expect(resultado.saldoSalario).toBe(2000); // 20 dias de 3000
    });

    it('deve calcular 13º proporcional', () => {
      const resultado = calcularRescisao(dadosBase);
      expect(resultado.decimoTerceiro).toBeGreaterThan(0);
    });

    it('deve calcular férias proporcionais', () => {
      const resultado = calcularRescisao(dadosBase);
      expect(resultado.feriasProporcionais).toBeGreaterThan(0);
      expect(resultado.tercoFeriasProporcionais).toBeCloseTo(resultado.feriasProporcionais / 3, 0);
    });

    it('deve calcular multa FGTS de 40%', () => {
      const resultado = calcularRescisao(dadosBase);
      expect(resultado.percentualMulta).toBe(40);
      expect(resultado.multaFGTS).toBe(4000);
    });

    it('deve calcular aviso prévio indenizado', () => {
      const resultado = calcularRescisao(dadosBase);
      expect(resultado.diasAvisoPrevio).toBeGreaterThanOrEqual(30);
      expect(resultado.avisoPrevioIndenizado).toBeGreaterThan(0);
    });

    it('deve dar direito ao saque do FGTS', () => {
      const resultado = calcularRescisao(dadosBase);
      expect(resultado.sacaFGTS).toBe(true);
    });

    it('deve dar direito ao seguro-desemprego', () => {
      const resultado = calcularRescisao(dadosBase);
      expect(resultado.seguroDesemprego).toBe(true);
    });
  });

  describe('Rescisão por justa causa', () => {
    it('não deve pagar 13º proporcional', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'justa_causa' };
      const resultado = calcularRescisao(dados);
      expect(resultado.decimoTerceiro).toBe(0);
    });

    it('não deve pagar férias proporcionais', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'justa_causa' };
      const resultado = calcularRescisao(dados);
      expect(resultado.feriasProporcionais).toBe(0);
    });

    it('não deve pagar multa FGTS', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'justa_causa' };
      const resultado = calcularRescisao(dados);
      expect(resultado.multaFGTS).toBe(0);
    });

    it('não deve dar direito ao saque do FGTS', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'justa_causa' };
      const resultado = calcularRescisao(dados);
      expect(resultado.sacaFGTS).toBe(false);
    });

    it('não deve dar direito ao seguro-desemprego', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'justa_causa' };
      const resultado = calcularRescisao(dados);
      expect(resultado.seguroDesemprego).toBe(false);
    });
  });

  describe('Pedido de demissão', () => {
    it('deve pagar 13º e férias proporcionais', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'pedido_demissao' };
      const resultado = calcularRescisao(dados);
      expect(resultado.decimoTerceiro).toBeGreaterThan(0);
      expect(resultado.feriasProporcionais).toBeGreaterThan(0);
    });

    it('não deve pagar multa FGTS', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'pedido_demissao' };
      const resultado = calcularRescisao(dados);
      expect(resultado.multaFGTS).toBe(0);
    });

    it('não deve dar direito ao saque do FGTS', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'pedido_demissao' };
      const resultado = calcularRescisao(dados);
      expect(resultado.sacaFGTS).toBe(false);
    });
  });

  describe('Rescisão por acordo (Reforma Trabalhista)', () => {
    it('deve calcular multa FGTS de 20%', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'acordo' };
      const resultado = calcularRescisao(dados);
      expect(resultado.percentualMulta).toBe(20);
      expect(resultado.multaFGTS).toBe(2000);
    });

    it('deve calcular aviso prévio pela metade', () => {
      const semJustaCausa = calcularRescisao(dadosBase);
      const acordo = calcularRescisao({ ...dadosBase, tipoRescisao: 'acordo' });
      expect(acordo.diasAvisoPrevio).toBe(Math.floor(semJustaCausa.diasAvisoPrevio / 2));
    });

    it('deve dar direito ao saque do FGTS', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'acordo' };
      const resultado = calcularRescisao(dados);
      expect(resultado.sacaFGTS).toBe(true);
    });

    it('não deve dar direito ao seguro-desemprego', () => {
      const dados: DadosRescisao = { ...dadosBase, tipoRescisao: 'acordo' };
      const resultado = calcularRescisao(dados);
      expect(resultado.seguroDesemprego).toBe(false);
    });
  });

  describe('Férias vencidas', () => {
    it('deve pagar férias vencidas + 1/3', () => {
      const dados: DadosRescisao = { ...dadosBase, feriasVencidas: true };
      const resultado = calcularRescisao(dados);
      expect(resultado.feriasVencidas).toBe(3000);
      expect(resultado.tercoFeriasVencidas).toBe(1000);
    });
  });

  describe('Aviso prévio', () => {
    it('não deve pagar aviso prévio se trabalhado', () => {
      const dados: DadosRescisao = { ...dadosBase, avisoPrevioTrabalhado: true };
      const resultado = calcularRescisao(dados);
      expect(resultado.avisoPrevioIndenizado).toBe(0);
    });

    it('deve calcular 3 dias adicionais por ano (máx 60)', () => {
      const dados5Anos: DadosRescisao = { 
        ...dadosBase, 
        dataAdmissao: new Date('2021-01-15') // ~5 anos
      };
      const resultado = calcularRescisao(dados5Anos);
      expect(resultado.diasAvisoPrevio).toBe(30 + 15); // 30 + (5*3)
    });
  });

  describe('Descontos', () => {
    it('deve calcular INSS sobre base correta', () => {
      const resultado = calcularRescisao(dadosBase);
      expect(resultado.inss).toBeGreaterThan(0);
    });

    it('deve calcular IRRF considerando dependentes', () => {
      const semDep = calcularRescisao(dadosBase);
      const comDep = calcularRescisao({ ...dadosBase, dependentesIRRF: 2 });
      expect(comDep.irrf).toBeLessThanOrEqual(semDep.irrf);
    });
  });

  describe('Totais', () => {
    it('deve calcular total líquido corretamente', () => {
      const resultado = calcularRescisao(dadosBase);
      const esperado = resultado.totalProventos + resultado.multaFGTS - resultado.totalDescontos;
      expect(resultado.totalLiquido).toBeCloseTo(esperado, 1);
    });
  });
});
