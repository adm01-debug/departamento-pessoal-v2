import { auditLogger } from '@/utils/auditLogger';

/**
 * Utilitário para assinar digitalmente resultados de folha.
 * Isso garante que o cálculo visualizado no frontend é o mesmo auditado.
 */
export async function signCalculation(data: any) {
  const encoder = new TextEncoder();
  const rawData = JSON.stringify(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(rawData));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function auditCalculation(
  colaboradorId: string, 
  competencia: string, 
  resultado: any
) {
  const signature = await signCalculation(resultado);
  
  await auditLogger.log({
    tabela: 'folhas_pagamento',
    registro_id: colaboradorId,
    acao: 'EXECUTE_CALC',
    dados_novos: {
      competencia,
      signature,
      total_proventos: resultado.proventos.totalProventos,
      total_descontos: resultado.descontos.totalDescontos,
      salario_liquido: resultado.salarioLiquido
    }
  });

  return signature;
}
