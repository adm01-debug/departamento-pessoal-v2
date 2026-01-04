// csrfTokens - Security utility

export interface csrfTokensResult { valid: boolean; message?: string; data?: any; }

export function csrfTokens(input: any): csrfTokensResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function csrfTokensAsync(input: any): Promise<csrfTokensResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(csrfTokens(input)), 0); });
}

export function csrfTokensWithOptions(input: any, options: Record<string, any> = {}): csrfTokensResult {
  const result = csrfTokens(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const csrfTokensConfig = { enabled: true, strict: false, logErrors: true };

export function configurecsrfTokens(config: Partial<typeof csrfTokensConfig>) {
  Object.assign(csrfTokensConfig, config);
}

export default csrfTokens;
