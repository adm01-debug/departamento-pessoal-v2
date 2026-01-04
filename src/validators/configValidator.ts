import { z } from "zod";
const schema = z.object({ id: z.string().uuid().optional(), nome: z.string().min(1).max(100), ativo: z.boolean().default(true) });
export function validate(data: unknown) { return schema.parse(data); }
export function safeValidate(data: unknown) { return schema.safeParse(data); }
export function isValid(data: unknown): boolean { return schema.safeParse(data).success; }
export const configValidator = { schema, validate, safeValidate, isValid };
export default configValidator;
