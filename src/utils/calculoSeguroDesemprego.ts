/**
 * Cálculo de Seguro-Desemprego
 * Lei 7.998/90 com alterações da Lei 13.134/2015
 */

interface SeguroDesempregoConfig {
  ultimosSalarios: number[]; // 3 últimos salários
  mesesTrabalhados: number;
  vezesRecebeuUltimos10Anos: number;
  tipoDispensa: 'sem_justa_causa' | 'rescisao_indireta' | 'forca_maior';
}

interface SeguroDesempregoResult {
  valorParcela: number;
  quantidadeParcelas: number;
  valorTotal: number;
  mediaSalarial: number;
  faixaAplicada: number;
  elegivel: boolean;
  motivoInelegibilidade?: string;
}

// Tabela 2025
const FAIXAS_2025 = [
  { limite: 2041.39, multiplicador: 0.8, adicional: 0 },
  { limite: 3402.65, multiplicador: 0.5, adicional: 1633.11 },
  { limite: Infinity, multiplicador: 0, adicional: 2313.74 }, // Teto fixo
];

export function calcularSeguroDesemprego(config: SeguroDesempregoConfig): SeguroDesempregoResult {
  const { ultimosSalarios, mesesTrabalhados, vezesRecebeuUltimos10Anos, tipoDispensa } = config;
  const SALARIO_MINIMO = 1518.00;
  
  // Verificar elegibilidade
  let mesesNecessarios: number;
  if (vezesRecebeuUltimos10Anos === 0) {
    mesesNecessarios = 12; // Primeira vez: 12 meses
  } else if (vezesRecebeuUltimos10Anos === 1) {
    mesesNecessarios = 9; // Segunda vez: 9 meses
  } else {
    mesesNecessarios = 6; // Terceira em diante: 6 meses
  }
  
  if (mesesTrabalhados < mesesNecessarios) {
    return {
      valorParcela: 0,
      quantidadeParcelas: 0,
      valorTotal: 0,
      mediaSalarial: 0,
      faixaAplicada: 0,
      elegivel: false,
      motivoInelegibilidade: `Necessário ${mesesNecessarios} meses, possui ${mesesTrabalhados}`,
    };
  }
  
  // Calcular média salarial
  const salariosFiltrados = ultimosSalarios.filter(s => s > 0).slice(0, 3);
  const mediaSalarial = salariosFiltrados.reduce((a, b) => a + b, 0) / salariosFiltrados.length;
  
  // Calcular valor da parcela
  let valorParcela: number;
  let faixaAplicada = 0;
  
  if (mediaSalarial <= FAIXAS_2025[0].limite) {
    valorParcela = mediaSalarial * FAIXAS_2025[0].multiplicador;
    faixaAplicada = 1;
  } else if (mediaSalarial <= FAIXAS_2025[1].limite) {
    const excedente = mediaSalarial - FAIXAS_2025[0].limite;
    valorParcela = FAIXAS_2025[1].adicional + (excedente * FAIXAS_2025[1].multiplicador);
    faixaAplicada = 2;
  } else {
    valorParcela = FAIXAS_2025[2].adicional; // Teto
    faixaAplicada = 3;
  }
  
  // Garantir mínimo de 1 salário mínimo
  valorParcela = Math.max(valorParcela, SALARIO_MINIMO);
  
  // Calcular quantidade de parcelas
  let quantidadeParcelas: number;
  if (mesesTrabalhados >= 24) {
    quantidadeParcelas = 5;
  } else if (mesesTrabalhados >= 12) {
    quantidadeParcelas = 4;
  } else {
    quantidadeParcelas = 3;
  }
  
  return {
    valorParcela: Math.round(valorParcela * 100) / 100,
    quantidadeParcelas,
    valorTotal: Math.round(valorParcela * quantidadeParcelas * 100) / 100,
    mediaSalarial: Math.round(mediaSalarial * 100) / 100,
    faixaAplicada,
    elegivel: true,
  };
}

export default { calcularSeguroDesemprego };
