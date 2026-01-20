// V18-T021: Testes da Calculadora Salário Maternidade
import { describe, it, expect } from 'vitest';
import { 
  calcularSalarioMaternidade, 
  getTetoMaternidade, 
  DIAS_LICENCA_MATERNIDADE, 
  DIAS_LICENCA_EMPRESA_CIDADA 
} from '../salarioMaternidade';

describe('Calculadora Salário Maternidade', () => {
  describe('calcularSalarioMaternidade', () => {
    it('deve calcular licença padrão de 120 dias', () => {
      const resultado = calcularSalarioMaternidade({ salario: 3000 });
      expect(resultado.diasLicenca).toBe(120);
    });

    it('deve calcular licença empresa cidadã de 180 dias', () => {
      const resultado = calcularSalarioMaternidade({ salario: 3000, empresaCidada: true });
      expect(resultado.diasLicenca).toBe(180);
    });

    it('deve calcular valor total corretamente', () => {
      const resultado = calcularSalarioMaternidade({ salario: 3000 });
      const valorDia = 3000 / 30;
      expect(resultado.valorTotal).toBe(valorDia * 120);
    });

    it('deve aplicar teto INSS', () => {
      const resultado = calcularSalarioMaternidade({ salario: 20000 });
      expect(resultado.tetoAplicado).toBe(true);
      expect(resultado.valorMensal).toBe(getTetoMaternidade());
    });

    it('deve calcular divisão INSS x Empresa', () => {
      const resultado = calcularSalarioMaternidade({ salario: 3000, empresaCidada: true });
      expect(resultado.pagoINSS).toBeGreaterThan(0);
      expect(resultado.pagoEmpresa).toBeGreaterThan(0);
    });

    it('empresa cidadã paga 60 dias', () => {
      const resultado = calcularSalarioMaternidade({ salario: 3000, empresaCidada: true });
      const valorDia = 3000 / 30;
      expect(resultado.pagoEmpresa).toBe(valorDia * 60);
    });

    describe('Adoção', () => {
      it('deve calcular 120 dias para criança até 1 ano', () => {
        const resultado = calcularSalarioMaternidade({ salario: 3000, adocao: true, idadeCriancaAdocao: 1 });
        expect(resultado.diasLicenca).toBe(120);
      });

      it('deve calcular 60 dias para criança de 1 a 4 anos', () => {
        const resultado = calcularSalarioMaternidade({ salario: 3000, adocao: true, idadeCriancaAdocao: 3 });
        expect(resultado.diasLicenca).toBe(60);
      });

      it('deve calcular 30 dias para criança acima de 4 anos', () => {
        const resultado = calcularSalarioMaternidade({ salario: 3000, adocao: true, idadeCriancaAdocao: 6 });
        expect(resultado.diasLicenca).toBe(30);
      });
    });

    it('deve calcular data fim corretamente', () => {
      const resultado = calcularSalarioMaternidade({ salario: 3000, dataInicio: '2026-03-01' });
      const inicio = new Date('2026-03-01');
      inicio.setDate(inicio.getDate() + 120);
      expect(resultado.dataFim).toBe(inicio.toISOString().split('T')[0]);
    });
  });

  describe('Constantes', () => {
    it('deve ter 120 dias de licença padrão', () => {
      expect(DIAS_LICENCA_MATERNIDADE).toBe(120);
    });

    it('deve ter 180 dias para empresa cidadã', () => {
      expect(DIAS_LICENCA_EMPRESA_CIDADA).toBe(180);
    });
  });
});
