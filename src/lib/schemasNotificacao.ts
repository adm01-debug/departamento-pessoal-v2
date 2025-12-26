import { z } from 'zod';

export const notificacaoSchema = z.object({
  titulo: z.string().min(1, 'Título obrigatório').max(100),
  mensagem: z.string().min(1, 'Mensagem obrigatória').max(500),
  tipo: z.enum(['info', 'sucesso', 'alerta', 'erro']),
  prioridade: z.enum(['baixa', 'media', 'alta', 'urgente']).default('media'),
  destinatarios: z.array(z.string().uuid()).min(1, 'Selecione pelo menos um destinatário'),
  agendada: z.boolean().default(false),
  dataAgendamento: z.string().optional(),
}).refine(data => !data.agendada || data.dataAgendamento, {
  message: 'Data de agendamento obrigatória',
  path: ['dataAgendamento'],
});

export type NotificacaoFormData = z.infer<typeof notificacaoSchema>;
