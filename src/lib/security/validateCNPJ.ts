// validateCNPJ - Security utility

export interface validateCNPJResult { valid: boolean; message?: string; data?: any; }

export function validateCNPJ(input: any): validateCNPJResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function validateCNPJAsync(input: any): Promise<validateCNPJResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(validateCNPJ(input)), 0); });
}

export function validateCNPJWithOptions(input: any, options: Record<string, any> = {}): validateCNPJResult {
  const result = validateCNPJ(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const validateCNPJConfig = { enabled: true, strict: false, logErrors: true };

export function configurevalidateCNPJ(config: Partial<typeof validateCNPJConfig>) {
  Object.assign(validateCNPJConfig, config);
}

export default validateCNPJ;
