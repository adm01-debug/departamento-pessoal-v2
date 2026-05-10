import { SolicitacaoAjuste } from '@/hooks/usePontoMelhorado';

/**
 * Valida a integridade SHA256 e conformidade com a Portaria 671
 */
export const testPortaria671Compliance = (solicitacao: SolicitacaoAjuste) => {
  const errors: string[] = [];
  const relatorio = solicitacao.relatorio_conformidade;

  if (!relatorio) {
    errors.push("Relatório de conformidade ausente.");
    return { success: false, errors };
  }

  // 1. Verificar Timezone (Portaria 671 exige registro do fuso horário)
  if (!relatorio.timezone) {
    errors.push("Fuso horário não registrado (Portaria 671 exige timezone).");
  }

  // 2. Verificar Geofencing (Opcional, mas recomendado para REP-P)
  if (relatorio.geofencing === false) {
    errors.push("Localização fora do perímetro permitido.");
  }

  // 3. Integridade do Hash SHA256
  if (!relatorio.sha256_integridade || relatorio.sha256_integridade.length !== 64) {
    errors.push("Assinatura de integridade SHA256 inválida ou corrompida.");
  }

  // 4. Portaria 671 Status
  if (!relatorio.portaria_671_conformidade) {
    errors.push("Status global de conformidade Portaria 671 falhou.");
  }

  return {
    success: errors.length === 0,
    errors,
    timestamp: new Date().toISOString()
  };
};

/**
 * Simula um teste automatizado de segurança (permissões)
 * Na prática, isso seria um teste de integração E2E, 
 * aqui definimos a lógica que a UI/Backend deve seguir.
 */
export const testSecurityPermissions = (userRole: string, action: string, currentStatus: string) => {
  const adminRoles = ['admin', 'gestor'];
  
  if (action === 'approve' || action === 'reject') {
    return adminRoles.includes(userRole);
  }
  
  if (action === 'edit' || action === 'delete') {
    if (adminRoles.includes(userRole)) return true;
    return currentStatus === 'rascunho';
  }
  
  return true;
};
