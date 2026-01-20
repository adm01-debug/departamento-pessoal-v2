// V20-005: Calculadora Seguro Desemprego 2026
const SALARIO_MINIMO_2026 = 1621.00;
const TETO_SD_2026 = 2424.11;

// Faixas 2026 (valores estimados)
const FAIXAS_2026 = [
  { ate: 2138.76, fator: 0.8, adicional: 0 },
  { ate: 3564.96, fator: 0.5, adicional: 1711.01 },
  { ate: Infinity, fator: 0, adicional: TETO_SD_2026 }
];

export interface ResultadoSeguroDesemprego {
  valorParcela: number;
  numeroParcelas: number;
  totalEstimado: number;
  salarioMedio: number;
  faixa: number;
}

export function calcularSeguroDesemprego(
  salariosMeses: number[],
  mesesTrabalhados: number,
  vezesRecebido: number = 0
): ResultadoSeguroDesemprego {
  // Calcular média dos últimos 3 salários
  const ultimos3 = salariosMeses.slice(-3);
  const salarioMedio = ultimos3.reduce((a, b) => a + b, 0) / ultimos3.length;

  // Determinar valor da parcela
  let valorParcela: number;
  let faixa = 0;

  for (let i = 0; i < FAIXAS_2026.length; i++) {
    if (salarioMedio <= FAIXAS_2026[i].ate) {
      faixa = i + 1;
      if (i === 0) {
        valorParcela = salarioMedio * FAIXAS_2026[i].fator;
      } else if (i === 1) {
        const excedente = salarioMedio - FAIXAS_2026[0].ate;
        valorParcela = FAIXAS_2026[i].adicional + excedente * FAIXAS_2026[i].fator;
      } else {
        valorParcela = FAIXAS_2026[i].adicional;
      }
      break;
    }
  }

  valorParcela = Math.max(valorParcela!, SALARIO_MINIMO_2026);
  valorParcela = Math.min(valorParcela, TETO_SD_2026);
  valorParcela = Math.round(valorParcela * 100) / 100;

  // Determinar número de parcelas
  let numeroParcelas: number;
  if (mesesTrabalhados >= 24) numeroParcelas = 5;
  else if (mesesTrabalhados >= 12) numeroParcelas = 4;
  else numeroParcelas = 3;

  return {
    valorParcela,
    numeroParcelas,
    totalEstimado: Math.round(valorParcela * numeroParcelas * 100) / 100,
    salarioMedio: Math.round(salarioMedio * 100) / 100,
    faixa
  };
}
