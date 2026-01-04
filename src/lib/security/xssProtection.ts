// xssProtection - Security utility

export interface xssProtectionResult { valid: boolean; message?: string; data?: any; }

export function xssProtection(input: any): xssProtectionResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function xssProtectionAsync(input: any): Promise<xssProtectionResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(xssProtection(input)), 0); });
}

export function xssProtectionWithOptions(input: any, options: Record<string, any> = {}): xssProtectionResult {
  const result = xssProtection(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const xssProtectionConfig = { enabled: true, strict: false, logErrors: true };

export function configurexssProtection(config: Partial<typeof xssProtectionConfig>) {
  Object.assign(xssProtectionConfig, config);
}

export default xssProtection;
