// @ts-nocheck
import { useAuditoriaIntegration } from './useAuditoriaIntegration';
import { logger } from '@/lib/logger';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useCalculoFolha() {
  const auditoria = useAuditoriaIntegration('calculo_folha');

  return useMutation(
    async (colaboradorId: string) => {
      logger.info(`Iniciando cálculo da folha para o colaborador ${colaboradorId}`);
      auditoria.logCalculoFolha(colaboradorId, 'Início do cálculo da folha');

      try {
        const response = await api.post(`/folhas-pagamento/calcular/${colaboradorId}`);
        logger.info(`Cálculo da folha para o colaborador ${colaboradorId} concluído com sucesso.`);
        auditoria.logCalculoFolha(colaboradorId, 'Cálculo da folha concluído com sucesso.');
        return response.data;
      } catch (error) {
        logger.error(`Erro ao calcular folha para o colaborador ${colaboradorId}: ${error}`);
        auditoria.logErro(colaboradorId, 'Erro ao calcular folha', error);
        throw error;
      }
    },
    {
      onSuccess: (data, variables) => {
        logger.info(`Cálculo da folha para o colaborador ${variables} realizado com sucesso.`);
        auditoria.logSucesso(variables, 'Cálculo da folha realizado com sucesso', data);
      },
      onError: (error, variables) => {
        logger.error(`Falha ao calcular folha para o colaborador ${variables}: ${error}`);
        auditoria.logFalha(variables, 'Falha ao calcular folha', error);
      },
    }
  );
}
