/**
 * Cálculo de Ajuda de Custo (CLT Art. 470)
 * Natureza indenizatória - não incide encargos
 */
interface AjudaCustoConfig {
  salarioBase: number;
  tipoMudanca: 'transferencia' | 'viagem' | 'instalacao';
  despesasMudanca?: number;
  dependentes: number;
}

interface AjudaCustoResult {
  valorBase: number;
  adicionalDependentes: number;
  valorTotal: number;
  natureza: string;
  incideINSS: boolean;
  incideIRRF: boolean;
}

export function calcularAjudaCusto(config: AjudaCustoConfig): AjudaCustoResult {
  const { salarioBase, tipoMudanca, despesasMudanca, dependentes } = config;
  let valorBase = 0;

  switch (tipoMudanca) {
    case 'transferencia':
      valorBase = despesasMudanca || salarioBase;
      break;
    case 'viagem':
      valorBase = salarioBase * 0.5;
      break;
    case 'instalacao':
      valorBase = salarioBase * 2;
      break;
  }

  const adicionalDependentes = dependentes * (salarioBase * 0.1);
  const valorTotal = valorBase + adicionalDependentes;

  return {
    valorBase: Math.round(valorBase * 100) / 100,
    adicionalDependentes: Math.round(adicionalDependentes * 100) / 100,
    valorTotal: Math.round(valorTotal * 100) / 100,
    natureza: 'Indenizatória',
    incideINSS: false,
    incideIRRF: false,
  };
}

export default { calcularAjudaCusto };
