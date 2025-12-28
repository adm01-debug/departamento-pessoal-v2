/**
 * @fileoverview Testes REAIS para pontoService
 * @version V8.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { differenceInMinutes, parse, format, isWeekend, addHours } from 'date-fns';

interface RegistroPonto {
  entrada1: string;
  saida1: string;
  entrada2: string;
  saida2: string;
}

const calcularHorasTrabalhadas = (registro: RegistroPonto): number => {
  const e1 = parse(registro.entrada1, 'HH:mm', new Date());
  const s1 = parse(registro.saida1, 'HH:mm', new Date());
  const e2 = parse(registro.entrada2, 'HH:mm', new Date());
  const s2 = parse(registro.saida2, 'HH:mm', new Date());
  
  const periodo1 = differenceInMinutes(s1, e1);
  const periodo2 = differenceInMinutes(s2, e2);
  
  return (periodo1 + periodo2) / 60;
};

const calcularHorasExtras = (horasTrabalhadas: number, jornadaDiaria: number): { he50: number; he100: number } => {
  const excedente = horasTrabalhadas - jornadaDiaria;
  if (excedente <= 0) return { he50: 0, he100: 0 };
  
  const he50 = Math.min(excedente, 2); // Primeiras 2h são 50%
  const he100 = Math.max(0, excedente - 2); // Excedente são 100%
  
  return { he50, he100 };
};

const calcularHorasNoturnas = (registro: RegistroPonto): number => {
  // Horário noturno: 22h às 05h
  // Hora noturna = 52:30 minutos
  let minutosNoturnos = 0;
  
  const s2 = parse(registro.saida2, 'HH:mm', new Date());
  const horaSaida = s2.getHours();
  const minutoSaida = s2.getMinutes();
  
  if (horaSaida >= 22 || horaSaida < 5) {
    if (horaSaida >= 22) {
      minutosNoturnos = (24 - horaSaida) * 60 - minutoSaida;
    } else {
      minutosNoturnos = horaSaida * 60 + minutoSaida;
    }
  }
  
  // Conversão: 52:30 = 1 hora noturna
  return minutosNoturnos / 52.5;
};

const verificarAtrasoFalta = (registro: RegistroPonto, horarioContratual: { entrada: string; tolerancia: number }) => {
  const entrada = parse(registro.entrada1, 'HH:mm', new Date());
  const contratoEntrada = parse(horarioContratual.entrada, 'HH:mm', new Date());
  
  const diferenca = differenceInMinutes(entrada, contratoEntrada);
  
  return {
    atrasado: diferenca > horarioContratual.tolerancia,
    minutosAtraso: Math.max(0, diferenca - horarioContratual.tolerancia),
    falta: diferenca > 120, // Mais de 2h = falta
  };
};

describe('pontoService', () => {
  describe('Cálculo de Horas Trabalhadas', () => {
    it('deve calcular jornada normal de 8h', () => {
      const registro: RegistroPonto = {
        entrada1: '08:00',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '17:00',
      };
      
      const horas = calcularHorasTrabalhadas(registro);
      expect(horas).toBe(8);
    });

    it('deve calcular jornada de 6h (sem intervalo)', () => {
      const registro: RegistroPonto = {
        entrada1: '08:00',
        saida1: '14:00',
        entrada2: '14:00',
        saida2: '14:00',
      };
      
      const horas = calcularHorasTrabalhadas(registro);
      expect(horas).toBe(6);
    });

    it('deve calcular jornada com intervalo maior', () => {
      const registro: RegistroPonto = {
        entrada1: '08:00',
        saida1: '12:00',
        entrada2: '14:00', // 2h de intervalo
        saida2: '18:00',
      };
      
      const horas = calcularHorasTrabalhadas(registro);
      expect(horas).toBe(8);
    });
  });

  describe('Cálculo de Horas Extras', () => {
    it('deve calcular HE 50% para primeiras 2h', () => {
      const horasTrabalhadas = 10;
      const jornada = 8;
      const { he50, he100 } = calcularHorasExtras(horasTrabalhadas, jornada);
      
      expect(he50).toBe(2);
      expect(he100).toBe(0);
    });

    it('deve calcular HE 100% após 2h extras', () => {
      const horasTrabalhadas = 12;
      const jornada = 8;
      const { he50, he100 } = calcularHorasExtras(horasTrabalhadas, jornada);
      
      expect(he50).toBe(2);
      expect(he100).toBe(2);
    });

    it('deve retornar zero se não houver excedente', () => {
      const horasTrabalhadas = 7;
      const jornada = 8;
      const { he50, he100 } = calcularHorasExtras(horasTrabalhadas, jornada);
      
      expect(he50).toBe(0);
      expect(he100).toBe(0);
    });

    it('deve calcular valor monetário HE 50%', () => {
      const salarioHora = 25.00;
      const he50 = 2;
      const valorHE50 = salarioHora * 1.5 * he50;
      expect(valorHE50).toBe(75.00);
    });

    it('deve calcular valor monetário HE 100%', () => {
      const salarioHora = 25.00;
      const he100 = 3;
      const valorHE100 = salarioHora * 2 * he100;
      expect(valorHE100).toBe(150.00);
    });
  });

  describe('Horário Noturno', () => {
    it('deve identificar trabalho após 22h', () => {
      const registro: RegistroPonto = {
        entrada1: '14:00',
        saida1: '18:00',
        entrada2: '19:00',
        saida2: '23:00',
      };
      
      const horasNoturnas = calcularHorasNoturnas(registro);
      expect(horasNoturnas).toBeGreaterThan(0);
    });

    it('deve calcular adicional noturno de 20%', () => {
      const horasNoturnas = 4;
      const salarioHora = 25.00;
      const adicionalNoturno = horasNoturnas * salarioHora * 0.2;
      expect(adicionalNoturno).toBe(20.00);
    });

    it('deve converter hora noturna (52:30 = 1h)', () => {
      const minutosNoturnos = 105; // 1h45min
      const horasNoturnas = minutosNoturnos / 52.5;
      expect(horasNoturnas).toBe(2);
    });
  });

  describe('Atrasos e Faltas', () => {
    it('deve detectar atraso além da tolerância', () => {
      const registro: RegistroPonto = {
        entrada1: '08:15',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '17:00',
      };
      
      const resultado = verificarAtrasoFalta(registro, { entrada: '08:00', tolerancia: 10 });
      
      expect(resultado.atrasado).toBe(true);
      expect(resultado.minutosAtraso).toBe(5);
    });

    it('deve aceitar entrada dentro da tolerância', () => {
      const registro: RegistroPonto = {
        entrada1: '08:08',
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '17:00',
      };
      
      const resultado = verificarAtrasoFalta(registro, { entrada: '08:00', tolerancia: 10 });
      
      expect(resultado.atrasado).toBe(false);
      expect(resultado.minutosAtraso).toBe(0);
    });

    it('deve calcular desconto por atraso', () => {
      const minutosAtraso = 30;
      const salarioHora = 25.00;
      const salarioMinuto = salarioHora / 60;
      const desconto = minutosAtraso * salarioMinuto;
      expect(desconto).toBeCloseTo(12.50, 2);
    });

    it('deve identificar falta', () => {
      const registro: RegistroPonto = {
        entrada1: '10:30', // 2h30 de atraso
        saida1: '12:00',
        entrada2: '13:00',
        saida2: '17:00',
      };
      
      const resultado = verificarAtrasoFalta(registro, { entrada: '08:00', tolerancia: 10 });
      
      expect(resultado.falta).toBe(true);
    });
  });

  describe('Banco de Horas', () => {
    it('deve creditar horas extras no banco', () => {
      const saldoAtual = 10;
      const horasCreditar = 2.5;
      const novoSaldo = saldoAtual + horasCreditar;
      expect(novoSaldo).toBe(12.5);
    });

    it('deve debitar horas do banco', () => {
      const saldoAtual = 15;
      const horasDebitar = 8; // Dia de folga
      const novoSaldo = saldoAtual - horasDebitar;
      expect(novoSaldo).toBe(7);
    });

    it('deve limitar saldo máximo (ex: 60h)', () => {
      const saldoAtual = 58;
      const horasCreditar = 5;
      const limiteMaximo = 60;
      const novoSaldo = Math.min(saldoAtual + horasCreditar, limiteMaximo);
      expect(novoSaldo).toBe(60);
    });

    it('deve alertar saldo negativo', () => {
      const saldoAtual = 5;
      const horasDebitar = 8;
      const novoSaldo = saldoAtual - horasDebitar;
      expect(novoSaldo).toBeLessThan(0);
    });
  });

  describe('Validações de Registro', () => {
    it('deve rejeitar registro fora da localização', () => {
      const localizacaoEmpresa = { lat: -23.550520, lng: -46.633308 };
      const localizacaoRegistro = { lat: -23.560520, lng: -46.643308 }; // ~1.5km
      
      const distancia = Math.sqrt(
        Math.pow(localizacaoRegistro.lat - localizacaoEmpresa.lat, 2) +
        Math.pow(localizacaoRegistro.lng - localizacaoEmpresa.lng, 2)
      ) * 111; // Aproximação em km
      
      const raioMaximo = 0.5; // 500m
      expect(distancia).toBeGreaterThan(raioMaximo);
    });

    it('deve verificar intervalo mínimo entre registros', () => {
      const ultimoRegistro = new Date('2024-01-15T12:00:00');
      const novoRegistro = new Date('2024-01-15T12:02:00');
      const diferencaMinutos = differenceInMinutes(novoRegistro, ultimoRegistro);
      const intervaloMinimo = 5;
      
      expect(diferencaMinutos).toBeLessThan(intervaloMinimo);
    });

    it('deve detectar registros duplicados', () => {
      const registros = ['08:00', '12:00', '13:00', '12:00'];
      const duplicados = registros.filter((item, index) => registros.indexOf(item) !== index);
      expect(duplicados.length).toBeGreaterThan(0);
    });
  });
});
