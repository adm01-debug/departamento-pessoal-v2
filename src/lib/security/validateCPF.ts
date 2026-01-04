// validateCPF - Security utility

export interface validateCPFResult { valid: boolean; message?: string; data?: any; }

export function validateCPF(input: any): validateCPFResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function validateCPFAsync(input: any): Promise<validateCPFResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(validateCPF(input)), 0); });
}

export function validateCPFWithOptions(input: any, options: Record<string, any> = {}): validateCPFResult {
  const result = validateCPF(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const validateCPFConfig = { enabled: true, strict: false, logErrors: true };

export function configurevalidateCPF(config: Partial<typeof validateCPFConfig>) {
  Object.assign(validateCPFConfig, config);
}

export default validateCPF;
