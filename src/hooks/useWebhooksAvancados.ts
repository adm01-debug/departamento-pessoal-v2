import { useQuery } from '@tanstack/react-query';
import { webhookService } from '@/services/webhookService';
import { useEmpresas } from './useEmpresas';
import { useGenericCrud } from './useGenericCrud';

export function useWebhooksAvancados() {
  const { empresaAtual } = useEmpresas();
  const empresaId = empresaAtual?.id;

  const crud = useGenericCrud<any>({
    queryKey: 'webhooks',
    service: webhookService,
    filters: { empresa_id: empresaId },
  });

  return {
    ...crud,
    webhooks: crud.items,
  };
}

export function useWebhookLogs(webhookId: string) {
  return useQuery({
    queryKey: ['webhook_logs', webhookId],
    queryFn: () => webhookService.listarLogs(webhookId),
    enabled: !!webhookId,
  });
}
