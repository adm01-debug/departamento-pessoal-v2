// hashPassword - Security utility

export interface hashPasswordResult { valid: boolean; message?: string; data?: any; }

export function hashPassword(input: any): hashPasswordResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function hashPasswordAsync(input: any): Promise<hashPasswordResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(hashPassword(input)), 0); });
}

export function hashPasswordWithOptions(input: any, options: Record<string, any> = {}): hashPasswordResult {
  const result = hashPassword(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const hashPasswordConfig = { enabled: true, strict: false, logErrors: true };

export function configurehashPassword(config: Partial<typeof hashPasswordConfig>) {
  Object.assign(hashPasswordConfig, config);
}

export default hashPassword;
