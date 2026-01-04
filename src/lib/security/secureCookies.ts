// secureCookies - Security utility

export interface secureCookiesResult { valid: boolean; message?: string; data?: any; }

export function secureCookies(input: any): secureCookiesResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function secureCookiesAsync(input: any): Promise<secureCookiesResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(secureCookies(input)), 0); });
}

export function secureCookiesWithOptions(input: any, options: Record<string, any> = {}): secureCookiesResult {
  const result = secureCookies(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const secureCookiesConfig = { enabled: true, strict: false, logErrors: true };

export function configuresecureCookies(config: Partial<typeof secureCookiesConfig>) {
  Object.assign(secureCookiesConfig, config);
}

export default secureCookies;
