// rateLimiting - Security utility

export interface rateLimitingResult { valid: boolean; message?: string; data?: any; }

export function rateLimiting(input: any): rateLimitingResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function rateLimitingAsync(input: any): Promise<rateLimitingResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(rateLimiting(input)), 0); });
}

export function rateLimitingWithOptions(input: any, options: Record<string, any> = {}): rateLimitingResult {
  const result = rateLimiting(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const rateLimitingConfig = { enabled: true, strict: false, logErrors: true };

export function configurerateLimiting(config: Partial<typeof rateLimitingConfig>) {
  Object.assign(rateLimitingConfig, config);
}

export default rateLimiting;
