// validateEmail - Security utility

export interface validateEmailResult { valid: boolean; message?: string; data?: any; }

export function validateEmail(input: any): validateEmailResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function validateEmailAsync(input: any): Promise<validateEmailResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(validateEmail(input)), 0); });
}

export function validateEmailWithOptions(input: any, options: Record<string, any> = {}): validateEmailResult {
  const result = validateEmail(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const validateEmailConfig = { enabled: true, strict: false, logErrors: true };

export function configurevalidateEmail(config: Partial<typeof validateEmailConfig>) {
  Object.assign(validateEmailConfig, config);
}

export default validateEmail;
