// V17.2-Z013: Schema de Afastamento
import { z } from 'zod';
export const afastamentoSchema = z.object({ empresa_id: z.string().uuid(), colaborador_id: z.string().uuid(), tipo: z.enum(['acidente_trabalho', 'doenca', 'licenca_maternidade', 'licenca_paternidade', 'ferias', 'servico_militar', 'licenca_nao_remunerada', 'suspensao_disciplinar', 'outros']), codigo_motivo: z.string().optional(), cid: z.string().optional(), data_inicio: z.string(), data_fim: z.string().optional(), data_prevista_retorno: z.string().optional(), atestado_url: z.string().url().optional(), observacoes: z.string().optional() });
export type AfastamentoInput = z.infer<typeof afastamentoSchema>;
