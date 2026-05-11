/**
 * Utilitário de cálculo de folha (INSS/IRRF/FGTS/Trabalhista).
 *
 * Este módulo centraliza os cálculos de folha de pagamento, integrando
 * impostos e verbas trabalhistas de acordo com a legislação 2026.
 */
import { calcularINSS as _inss, calcularIRRF as _irrf, calcularFGTS as _fgts } from '@/calculators/impostos';
import { calcularHorasExtras, calcularDSR, calcular13Salario } from '@/calculators/trabalhista';
import { FAIXAS_INSS_2026, FAIXAS_IRRF_2026, DEDUCAO_DEPENDENTE_IRRF } from '@/calculators/tabelas';

export interface CalculoResultado {
  proventos: number;
  descontos: number;
  liquido: number;
  inss: number;
  irrf: number;
  fgts: number;
  horasExtras?: number;
  dsr?: number;
  decimoTerceiro?: number;
  faixaInss: string;
  faixaIrrf: string;
  detalheEventos?: Array<{
    codigo: string;
    descricao: string;
    tipo: 'provento' | 'desconto';
    valor: number;
  }>;
}

const TETO_INSS = FAIXAS_INSS_2026[FAIXAS_INSS_2026.length - 1].limite;

function descreverFaixaInss(salarioBruto: number): string {
  if (salarioBruto >= TETO_INSS) return 'Teto (14%)';
  for (let i = 0; i < FAIXAS_INSS_2026.length; i++) {
    if (salarioBruto <= FAIXAS_INSS_2026[i].limite) {
      return `${(FAIXAS_INSS_2026[i].aliquota * 100).toFixed(1).replace('.0', '')}%`;
    }
  }
  return '14%';
}

function descreverFaixaIrrf(base: number): string {
  if (base <= FAIXAS_IRRF_2026[0].limite) return 'Isento';
  for (const f of FAIXAS_IRRF_2026) {
    if (base <= f.limite) return `${(f.aliquota * 100).toFixed(1).replace('.0', '')}%`;
  }
  return '27.5%';
}

export const folhaCalc = {
  calcularINSS: (salarioBruto: number): { valor: number; faixa: string } => ({
    valor: _inss(salarioBruto),
    faixa: descreverFaixaInss(salarioBruto),
  }),

  calcularIRRF: (salarioBruto: number, inss: number, dependentes: number = 0): { valor: number; faixa: string } => {
    const valor = _irrf(salarioBruto, dependentes);
    const base = salarioBruto - inss - dependentes * DEDUCAO_DEPENDENTE_IRRF;
    return { valor, faixa: descreverFaixaIrrf(base) };
  },

  calcularFGTS: (salarioBruto: number): number => _fgts(salarioBruto),

  calcularHorasExtras,
  calcularDSR,
  calcular13Salario,

  processar: (
    salarioBase: number,
    params: {
      adicionais?: number;
      descontosExtras?: number;
      dependentes?: number;
      horasExtras50?: number;
      horasExtras100?: number;
      meses13?: number;
      parcela13?: 1 | 2;
      jornada?: number;
      eventos?: Array<{ codigo: string; descricao: string; tipo: 'provento' | 'desconto'; valor: number }>;
    } = {}
  ): CalculoResultado => {
    const {
      adicionais = 0,
      descontosExtras = 0,
      dependentes = 0,
      horasExtras50 = 0,
      horasExtras100 = 0,
      meses13 = 0,
      parcela13,
      jornada = 220,
      eventos = []
    } = params;

    const detalheEventos: Array<{ codigo: string; descricao: string; tipo: 'provento' | 'desconto'; valor: number }> = [];

    // Salário Base
    detalheEventos.push({ codigo: '1000', descricao: 'Salário Base', tipo: 'provento', valor: salarioBase });

    // Horas Extras
    const valorHE50 = calcularHorasExtras(salarioBase, jornada, horasExtras50, 0.5);
    if (valorHE50 > 0) detalheEventos.push({ codigo: '1001', descricao: 'Horas Extras 50%', tipo: 'provento', valor: valorHE50 });
    
    const valorHE100 = calcularHorasExtras(salarioBase, jornada, horasExtras100, 1.0);
    if (valorHE100 > 0) detalheEventos.push({ codigo: '1002', descricao: 'Horas Extras 100%', tipo: 'provento', valor: valorHE100 });
    
    const totalHE = valorHE50 + valorHE100;
    
    // DSR sobre Horas Extras
    const dsr = calcularDSR(totalHE);
    if (dsr > 0) detalheEventos.push({ codigo: '1003', descricao: 'DSR sobre Horas Extras', tipo: 'provento', valor: dsr });
    
    // 13º Salário
    let decimoTerceiro = 0;
    if (parcela13) {
      decimoTerceiro = calcular13Salario(salarioBase, meses13 || 12, parcela13);
      detalheEventos.push({ 
        codigo: parcela13 === 1 ? '1011' : '1012', 
        descricao: `13º Salário - ${parcela13}ª Parcela`, 
        tipo: 'provento', 
        valor: decimoTerceiro 
      });
    }

    // Eventos Adicionais
    eventos.forEach(ev => {
      detalheEventos.push(ev);
    });

    const proventos = detalheEventos
      .filter(e => e.tipo === 'provento')
      .reduce((acc, curr) => acc + curr.valor, 0);

    const { valor: inss, faixa: faixaInss } = folhaCalc.calcularINSS(proventos);
    detalheEventos.push({ codigo: '5000', descricao: 'Desconto INSS', tipo: 'desconto', valor: inss });

    const { valor: irrf, faixa: faixaIrrf } = folhaCalc.calcularIRRF(proventos, inss, dependentes);
    if (irrf > 0) detalheEventos.push({ codigo: '5001', descricao: 'Desconto IRRF', tipo: 'desconto', valor: irrf });

    const fgts = folhaCalc.calcularFGTS(proventos);
    
    const descontos = detalheEventos
      .filter(e => e.tipo === 'desconto')
      .reduce((acc, curr) => acc + curr.valor, 0);

    const liquido = Math.round((proventos - descontos) * 100) / 100;

    return { 
      proventos, 
      descontos, 
      liquido, 
      inss, 
      irrf, 
      fgts, 
      horasExtras: totalHE,
      dsr,
      decimoTerceiro,
      faixaInss, 
      faixaIrrf,
      detalheEventos
    };
  },
};
