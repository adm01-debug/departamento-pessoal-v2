import { z } from 'zod';

export const etapaOnboardingSchema = z.object({
  titulo: z.string().min(1, 'Título obrigatório'),
  descricao: z.string().optional(),
  ordem: z.number().int().positive(),
  obrigatoria: z.boolean().default(true),
  responsavel: z.string().optional(),
});

export const templateOnboardingSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  descricao: z.string().optional(),
  etapas: z.array(etapaOnboardingSchema).min(1, 'Adicione pelo menos uma etapa'),
  duracaoDias: z.number().int().positive().max(90),
});

export const onboardingFormSchema = z.object({
  colaboradorId: z.string().uuid(),
  templateId: z.string().uuid().optional(),
  dataPrevistaConclusao: z.string().min(1, 'Data prevista obrigatória'),
  mentorId: z.string().uuid().optional(),
});

export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;
