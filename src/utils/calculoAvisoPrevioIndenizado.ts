/**
 * Cálculo de Aviso Prévio Indenizado (CLT Art. 487)
 * Mínimo 30 dias + 3 dias por ano trabalhado (máx 90 dias)
 */
interface AvisoPrevioConfig {
  salarioBase: number;
  anosServico: number;
  mediaComissoes?: number;
  mediaHorasExtras?: number;
  mediaAdicionais?: number;
}

interface AvisoPrevioResult {
  diasAviso: number;
  valorBase: number;
  valorIntegracoes: number;
  valorTotal: number;
  projecao13: number;
  projecaoFerias: number;
}

export function calcularAvisoPrevioIndenizado(config: AvisoPrevioConfig): AvisoPrevioResult {
  const { salarioBase, anosServico, mediaComissoes = 0, mediaHorasExtras = 0, mediaAdicionais = 0 } = config;
  
  const diasBase = 30;
  const diasAdicionais = Math.min(anosServico * 3, 60);
  const diasAviso = diasBase + diasAdicionais;
  
  const remuneracaoTotal = salarioBase + mediaComissoes + mediaHorasExtras + mediaAdicionais;
  const valorDiario = remuneracaoTotal / 30;
  const valorBase = valorDiario * diasAviso;
  
  const projecao13 = (remuneracaoTotal / 12) * (diasAviso / 30);
  const projecaoFerias = ((remuneracaoTotal + remuneracaoTotal/3) / 12) * (diasAviso / 30);

  return {
    diasAviso,
    valorBase: Math.round(valorBase * 100) / 100,
    valorIntegracoes: Math.round((mediaComissoes + mediaHorasExtras + mediaAdicionais) * (diasAviso/30) * 100) / 100,
    valorTotal: Math.round(valorBase * 100) / 100,
    projecao13: Math.round(projecao13 * 100) / 100,
    projecaoFerias: Math.round(projecaoFerias * 100) / 100,
  };
}

export default { calcularAvisoPrevioIndenizado };
