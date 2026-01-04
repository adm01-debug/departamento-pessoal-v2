// inputSanitization - Security utility

export interface inputSanitizationResult { valid: boolean; message?: string; data?: any; }

export function inputSanitization(input: any): inputSanitizationResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function inputSanitizationAsync(input: any): Promise<inputSanitizationResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(inputSanitization(input)), 0); });
}

export function inputSanitizationWithOptions(input: any, options: Record<string, any> = {}): inputSanitizationResult {
  const result = inputSanitization(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const inputSanitizationConfig = { enabled: true, strict: false, logErrors: true };

export function configureinputSanitization(config: Partial<typeof inputSanitizationConfig>) {
  Object.assign(inputSanitizationConfig, config);
}

export default inputSanitization;
