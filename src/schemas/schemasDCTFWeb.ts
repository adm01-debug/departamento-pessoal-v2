import { z } from "zod";

export const schemasDCTFWeb = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(1, "Nome é obrigatório").max(200),
  descricao: z.string().max(500).optional(),
  codigo: z.string().max(50).optional(),
  ativo: z.boolean().default(true),
  valor: z.number().positive().optional(),
  dataInicio: z.string().datetime().optional(),
  dataFim: z.string().datetime().optional(),
  observacoes: z.string().max(1000).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export const schemasDCTFWebCreate = schemasDCTFWeb.omit({ id: true, createdAt: true, updatedAt: true });
export const schemasDCTFWebUpdate = schemasDCTFWeb.partial().omit({ id: true, createdAt: true });

export type DCTFWeb = z.infer<typeof schemasDCTFWeb>;
export type DCTFWebCreate = z.infer<typeof schemasDCTFWebCreate>;
export type DCTFWebUpdate = z.infer<typeof schemasDCTFWebUpdate>;

export const validateDCTFWeb = (data: unknown) => schemasDCTFWeb.safeParse(data);
export default schemasDCTFWeb;
