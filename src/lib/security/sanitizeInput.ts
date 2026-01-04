// sanitizeInput - Security utility

export interface sanitizeInputResult { valid: boolean; message?: string; data?: any; }

export function sanitizeInput(input: any): sanitizeInputResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function sanitizeInputAsync(input: any): Promise<sanitizeInputResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(sanitizeInput(input)), 0); });
}

export function sanitizeInputWithOptions(input: any, options: Record<string, any> = {}): sanitizeInputResult {
  const result = sanitizeInput(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const sanitizeInputConfig = { enabled: true, strict: false, logErrors: true };

export function configuresanitizeInput(config: Partial<typeof sanitizeInputConfig>) {
  Object.assign(sanitizeInputConfig, config);
}

export default sanitizeInput;
