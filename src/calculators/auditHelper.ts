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

/**
 * Registra a auditoria de um cálculo de folha com assinatura SHA-256
 */
export async function auditCalculation(
  colaboradorId: string, 
  competencia: string, 
  resultado: any
) {
  // Gera assinatura digital única do resultado
  const signature = await signCalculation(resultado);
  
  await auditLogger.log({
    tabela: 'folhas_pagamento',
    registro_id: colaboradorId,
    acao: 'EXECUTE_CALC',
    dados_novos: {
      competencia,
      signature,
      // Metadados essenciais para conferência rápida
      total_proventos: resultado.proventos?.totalProventos || resultado.proventos,
      total_descontos: resultado.descontos?.totalDescontos || resultado.descontos,
      salario_liquido: resultado.salarioLiquido || resultado.liquido,
      // Flag de integridade
      integridade_calculo: 'ASSINADO_SHA256',
      timestamp: new Date().toISOString()
    }
  });

  return signature;
}

/**
 * Verifica se um resultado de cálculo foi alterado comparando com a assinatura
 */
export async function verifyCalculationIntegrity(data: any, originalSignature: string): Promise<boolean> {
  const currentSignature = await signCalculation(data);
  return currentSignature === originalSignature;
}
