// validateToken - Security utility

export interface validateTokenResult { valid: boolean; message?: string; data?: any; }

export function validateToken(input: any): validateTokenResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function validateTokenAsync(input: any): Promise<validateTokenResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(validateToken(input)), 0); });
}

export function validateTokenWithOptions(input: any, options: Record<string, any> = {}): validateTokenResult {
  const result = validateToken(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const validateTokenConfig = { enabled: true, strict: false, logErrors: true };

export function configurevalidateToken(config: Partial<typeof validateTokenConfig>) {
  Object.assign(validateTokenConfig, config);
}

export default validateToken;
