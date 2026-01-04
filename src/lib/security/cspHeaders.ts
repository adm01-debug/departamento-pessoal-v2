// cspHeaders - Security utility

export interface cspHeadersResult { valid: boolean; message?: string; data?: any; }

export function cspHeaders(input: any): cspHeadersResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function cspHeadersAsync(input: any): Promise<cspHeadersResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(cspHeaders(input)), 0); });
}

export function cspHeadersWithOptions(input: any, options: Record<string, any> = {}): cspHeadersResult {
  const result = cspHeaders(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const cspHeadersConfig = { enabled: true, strict: false, logErrors: true };

export function configurecspHeaders(config: Partial<typeof cspHeadersConfig>) {
  Object.assign(cspHeadersConfig, config);
}

export default cspHeaders;
