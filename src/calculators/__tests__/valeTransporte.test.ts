// V18-T012: Testes da Calculadora Vale Transporte
import { describe, it, expect } from 'vitest';
import { calcularValeTransporte, PERCENTUAL_DESCONTO_VT, ParamsVT } from '../valeTransporte';

describe('Calculadora Vale Transporte', () => {
  describe('calcularValeTransporte', () => {
    it('deve calcular valor total do VT', () => {
      const resultado = calcularValeTransporte({ salarioBase: 3000, valorPassagem: 5 });
      expect(resultado.valorVT).toBe(220); // 5 * 22 * 2
    });

    it('deve calcular limite de desconto (6%)', () => {
      const resultado = calcularValeTransporte({ salarioBase: 3000, valorPassagem: 5 });
      expect(resultado.limiteDesconto).toBe(180); // 3000 * 6%
    });

    it('deve limitar desconto ao máximo de 6%', () => {
      const resultado = calcularValeTransporte({ salarioBase: 2000, valorPassagem: 10 });
      expect(resultado.descontoEmpregado).toBe(120); // limite de 6% de 2000
    });

    it('deve calcular custo empresa corretamente', () => {
      const resultado = calcularValeTransporte({ salarioBase: 3000, valorPassagem: 5 });
      expect(resultado.custoEmpresa).toBe(resultado.valorVT - resultado.descontoEmpregado);
    });

    it('deve aceitar dias úteis customizados', () => {
      const resultado = calcularValeTransporte({ salarioBase: 3000, valorPassagem: 5, diasUteis: 20 });
      expect(resultado.valorVT).toBe(200); // 5 * 20 * 2
    });

    it('deve aceitar viagens por dia customizadas', () => {
      const resultado = calcularValeTransporte({ salarioBase: 3000, valorPassagem: 5, viagensDia: 4 });
      expect(resultado.valorVT).toBe(440); // 5 * 22 * 4
    });

    it('deve usar valores padrão (22 dias, 2 viagens)', () => {
      const resultado = calcularValeTransporte({ salarioBase: 3000, valorPassagem: 4.5 });
      expect(resultado.valorVT).toBe(198); // 4.5 * 22 * 2
    });

    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularValeTransporte({ salarioBase: 3333.33, valorPassagem: 4.75 });
      expect(resultado.valorVT.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });

  describe('PERCENTUAL_DESCONTO_VT', () => {
    it('deve ser 6%', () => {
      expect(PERCENTUAL_DESCONTO_VT).toBe(6);
    });
  });
});
