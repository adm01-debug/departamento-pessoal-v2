/**
 * Rubricas padrão de folha de pagamento (conforme eSocial).
 * Centralizado para sincronizar Frontend, Backend e Migrations.
 */

export type TipoRubrica = 'provento' | 'desconto' | 'informativa';

export interface RubricaPadrao {
  codigo: string;
  descricao: string;
  tipo: TipoRubrica;
  incide_inss: boolean;
  incide_irrf: boolean;
  incide_fgts: boolean;
}

export const RUBRICAS_PADRAO: RubricaPadrao[] = [
  { codigo: '1000', descricao: 'Salário Base', tipo: 'provento', incide_inss: true, incide_irrf: true, incide_fgts: true },
  { codigo: '1001', descricao: 'Horas Extras 50%', tipo: 'provento', incide_inss: true, incide_irrf: true, incide_fgts: true },
  { codigo: '1002', descricao: 'Horas Extras 100%', tipo: 'provento', incide_inss: true, incide_irrf: true, incide_fgts: true },
  { codigo: '1003', descricao: 'DSR sobre Horas Extras', tipo: 'provento', incide_inss: true, incide_irrf: true, incide_fgts: true },
  { codigo: '1004', descricao: 'Adicional Noturno', tipo: 'provento', incide_inss: true, incide_irrf: true, incide_fgts: true },
  { codigo: '1005', descricao: 'Adicional de Insalubridade', tipo: 'provento', incide_inss: true, incide_irrf: true, incide_fgts: true },
  { codigo: '1006', descricao: 'Adicional de Periculosidade', tipo: 'provento', incide_inss: true, incide_irrf: true, incide_fgts: true },
  { codigo: '1007', descricao: 'Salário Família', tipo: 'provento', incide_inss: false, incide_irrf: false, incide_fgts: false },
  { codigo: '1008', descricao: 'Gratificações', tipo: 'provento', incide_inss: true, incide_irrf: true, incide_fgts: true },
  { codigo: '1009', descricao: 'Comissões', tipo: 'provento', incide_inss: true, incide_irrf: true, incide_fgts: true },
  
  { codigo: '5000', descricao: 'Desconto INSS', tipo: 'desconto', incide_inss: false, incide_irrf: false, incide_fgts: false },
  { codigo: '5001', descricao: 'Desconto IRRF', tipo: 'desconto', incide_inss: false, incide_irrf: false, incide_fgts: false },
  { codigo: '5002', descricao: 'Desconto Vale Transporte', tipo: 'desconto', incide_inss: false, incide_irrf: false, incide_fgts: false },
  { codigo: '5003', descricao: 'Pensão Alimentícia', tipo: 'desconto', incide_inss: false, incide_irrf: false, incide_fgts: false },
  { codigo: '5004', descricao: 'Adiantamento Salarial', tipo: 'desconto', incide_inss: false, incide_irrf: false, incide_fgts: false },
  { codigo: '5005', descricao: 'Faltas e Atrasos', tipo: 'desconto', incide_inss: true, incide_irrf: true, incide_fgts: true },

  { codigo: '7000', descricao: 'FGTS (Base)', tipo: 'informativa', incide_inss: false, incide_irrf: false, incide_fgts: false },
];
